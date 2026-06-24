import type { FilterElementState } from "@bsport/kaizen-primitive-core";

import {
  type SeriesFilterBookingRule,
  SeriesFilterField,
  type SeriesFilterParams,
  type SeriesFilterStatus,
} from "#src/components/series-list/filters/types";

const isCompleteFilter = (filter: FilterElementState) =>
  filter.field !== null && filter.filter !== null && filter.valueIds.length > 0;

export const hasActiveSeriesFilters = (filters: FilterElementState[]) =>
  filters.some(isCompleteFilter);

const isSeriesStatus = (value: string): value is SeriesFilterStatus =>
  value === "scheduled" || value === "past" || value === "cancelled";

const isSeriesBookingRule = (value: string): value is SeriesFilterBookingRule =>
  value === "fullSeries" || value === "openSeries" || value === "singleClass";

const getServiceParamsFromFilter = (
  filter: FilterElementState,
): SeriesFilterParams | null => {
  const serviceIdentifiers = filter.valueIds
    .map((serviceIdentifier) => Number(serviceIdentifier))
    .filter((serviceIdentifier) => Number.isFinite(serviceIdentifier));

  if (serviceIdentifiers.length === 0) {
    return null;
  }

  return {
    meta_activity__in: serviceIdentifiers,
  };
};

const getStatusParamsFromFilter = (
  filter: FilterElementState,
): SeriesFilterParams | null => {
  const status = filter.valueIds[0];

  if (!status || !isSeriesStatus(status)) {
    return null;
  }

  return { status };
};

const getBookingRuleParamsFromFilter = (
  filter: FilterElementState,
): SeriesFilterParams | null => {
  const bookingRule = filter.valueIds[0];

  if (!bookingRule || !isSeriesBookingRule(bookingRule)) {
    return null;
  }

  if (bookingRule === "fullSeries") {
    return {
      allow_booking_after_start: false,
      full_booking_only: true,
    };
  }

  if (bookingRule === "openSeries") {
    return {
      allow_booking_after_start: true,
      full_booking_only: true,
    };
  }

  return {
    full_booking_only: false,
  };
};

type GetSeriesParamsFromFiltersOptions = {
  canShowCancelled?: boolean;
};

export const getSeriesParamsFromFilters = (
  filters: FilterElementState[],
  { canShowCancelled = true }: GetSeriesParamsFromFiltersOptions = {},
): SeriesFilterParams => {
  return filters.reduce<SeriesFilterParams>((params, filter) => {
    if (!isCompleteFilter(filter)) {
      return params;
    }

    if (filter.field === SeriesFilterField.SERVICE) {
      const serviceParams = getServiceParamsFromFilter(filter);

      if (serviceParams) {
        Object.assign(params, serviceParams);
      }
    } else if (filter.field === SeriesFilterField.STATUS) {
      const statusParams = getStatusParamsFromFilter(filter);

      if (statusParams) {
        if (statusParams.status === "cancelled" && !canShowCancelled) {
          return params;
        }

        Object.assign(params, statusParams);
      }
    } else if (filter.field === SeriesFilterField.BOOKING_RULE) {
      const bookingRuleParams = getBookingRuleParamsFromFilter(filter);

      if (bookingRuleParams) {
        Object.assign(params, bookingRuleParams);
      }
    }

    return params;
  }, {});
};

export const getSeriesAvailableParamFromFilters = (
  filters: FilterElementState[],
  showCancelled: boolean,
  defaultAvailable: boolean,
  canShowCancelled = true,
): boolean | undefined => {
  const filterParams = getSeriesParamsFromFilters(filters, {
    canShowCancelled,
  });

  if (filterParams.status === "cancelled") {
    return undefined;
  }

  if (filterParams.status === "scheduled" || filterParams.status === "past") {
    return defaultAvailable;
  }

  return showCancelled ? undefined : defaultAvailable;
};
