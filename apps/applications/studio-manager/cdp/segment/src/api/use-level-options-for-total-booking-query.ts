import { useSuspenseQuery } from "@tanstack/react-query";

import { fetchLevelsAPI } from "@bsport/api-core";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

const LEVEL_OPTIONS_QUERY_STALE_TIME_MS = 2 * 60 * 1000;

/**
 * Loads active levels for the current company and adapts them for
 * `ItemsSearchFilter` consumption in the total-booking filter.
 */
export const useLevelOptionsForTotalBookingQuery = (
  companyId: number | undefined,
) => {
  return useSuspenseQuery({
    queryKey: smartlistQueryKeys.levelOptionsForTotalBooking(companyId),
    queryFn: async () => {
      if (companyId === undefined || companyId <= 0) {
        return [];
      }

      const levels = await fetchLevelsAPI(fetch, {
        company: companyId,
        is_active: true,
      });

      return levels
        .map((level) => ({ id: level.id, name: level.name }))
        .sort((leftLevel, rightLevel) =>
          leftLevel.name.localeCompare(rightLevel.name),
        );
    },
    staleTime: LEVEL_OPTIONS_QUERY_STALE_TIME_MS,
  });
};
