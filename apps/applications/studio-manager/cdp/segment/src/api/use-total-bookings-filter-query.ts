import { useQuery } from "@tanstack/react-query";

import {
  type SmartlistGetFiltersResponse,
  TOTAL_BOOKING_FILTER_IDENTIFIER,
  smartlistFiltersQueryOptions,
} from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

const mapTotalBookingFilters = (payload?: SmartlistGetFiltersResponse) => {
  const totalBookingFiltersMap = payload?.[TOTAL_BOOKING_FILTER_IDENTIFIER];
  if (!totalBookingFiltersMap) {
    return [];
  }

  return Object.values(totalBookingFiltersMap)
    .map((filter) => filter)
    .sort((leftFilter, rightFilter) => leftFilter.id - rightFilter.id);
};

export const useTotalBookingFilterQuery = (smartlistId: string) =>
  useQuery({
    ...smartlistFiltersQueryOptions(fetch, smartlistId),
    select: (data) => mapTotalBookingFilters(data),
  });
