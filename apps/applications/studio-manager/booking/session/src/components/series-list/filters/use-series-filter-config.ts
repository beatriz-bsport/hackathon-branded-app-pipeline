import { useCallback, useRef } from "react";

import type {
  FilterElementState,
  FilterProps,
} from "@bsport/kaizen-primitive-core";
import {
  DEFAULT_PAGE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import {
  selectSeriesFilters,
  setFilters,
  useCalendarStore,
} from "#src/stores/calendar";
import { useTranslation } from "#src/utils/i18n";
import { useObjectLevelPermission } from "#src/utils/permission";

import { SeriesFilterField, SeriesFilterOperator } from "./types";
import { useServiceFilter } from "./use-service-filter";

const SERIES_PAGINATION_NAMESPACE = "series";

type UseSeriesFilterConfigParams = {
  enabled?: boolean;
};

export const useSeriesFilterConfig = ({
  enabled = true,
}: UseSeriesFilterConfigParams = {}) => {
  const { t } = useTranslation("series");
  const filters = useCalendarStore(selectSeriesFilters);
  const filterRef = useRef<{ resetFilters: () => void }>(null);
  const { currentPageSize, setPageSettings } = usePaginationQueryParams({
    namespace: SERIES_PAGINATION_NAMESPACE,
  });
  const serviceFilter = useServiceFilter(enabled);
  const hasShowCancelledSeriesPermission = useObjectLevelPermission(
    "planning.calendar.allowed_actions.readCancellations",
  );

  const onFilterChange = useCallback(
    (newFilters: FilterElementState[]) => {
      setFilters("series", newFilters);
      setPageSettings(DEFAULT_PAGE, currentPageSize);
    },
    [currentPageSize, setPageSettings],
  );

  const filterConfig: FilterProps = {
    fields: {
      [SeriesFilterField.SERVICE]: serviceFilter,
      [SeriesFilterField.BOOKING_RULE]: {
        id: SeriesFilterField.BOOKING_RULE,
        label: t("seriesFilters.bookingRule.label"),
        availableFilters: [SeriesFilterOperator.FILTER_IS],
        values: [
          {
            id: "fullSeries",
            label: t("seriesTable.bookingRules.fullSeries"),
          },
          {
            id: "openSeries",
            label: t("seriesTable.bookingRules.openSeries"),
          },
          {
            id: "singleClass",
            label: t("seriesTable.bookingRules.singleClass"),
          },
        ],
        multiSelect: false,
      },
      [SeriesFilterField.STATUS]: {
        id: SeriesFilterField.STATUS,
        label: t("seriesFilters.status.label"),
        availableFilters: [SeriesFilterOperator.FILTER_IS],
        values: [
          {
            id: "scheduled",
            label: t("seriesFilters.status.scheduled"),
          },
          {
            id: "past",
            label: t("seriesFilters.status.past"),
          },
          ...(hasShowCancelledSeriesPermission
            ? [
                {
                  id: "cancelled",
                  label: t("seriesFilters.status.cancelled"),
                },
              ]
            : []),
        ],
        multiSelect: false,
      },
    },
    filters: [
      {
        id: SeriesFilterOperator.FILTER_IS,
        label: t("seriesFilters.is"),
      },
    ],
    selectFieldLabel: t("seriesFilters.label"),
    onFilterChange,
    defaultFilters: filters,
  };

  return {
    filterConfig,
    seriesFiltersRef: filterRef,
  };
};
