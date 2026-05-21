import { queryOptions, useQuery } from "@tanstack/react-query";
import keyBy from "lodash/keyBy";

import {
  Establishment,
  establishmentKeys,
  fetchEstablishments,
} from "@bsport/api-book";

import { fetch } from "../utils/fetch";

const ESTABLISHMENTS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchEstablishmentsByIds = async (
  establishmentIds: number[],
): Promise<Establishment[]> => {
  const { results } = await fetchEstablishments(fetch, {
    id__in: establishmentIds,
  });
  return results;
};

const establishmentsQueryOptions = (
  establishmentIds: number[],
  enabled: boolean,
) => {
  const establishmentIdsSorted = [...establishmentIds].sort();
  return queryOptions({
    queryKey: establishmentKeys.list({ id__in: establishmentIdsSorted }),
    queryFn: () => fetchEstablishmentsByIds(establishmentIdsSorted),
    enabled: enabled && establishmentIdsSorted.length > 0,
    staleTime: ESTABLISHMENTS_STALE_TIME,
  });
};

export const useFetchEstablishments = <T = Record<string, Establishment>>(
  establishmentIds: number[] = [],
  enabled = true,
  options?: {
    select?: (data: Establishment[]) => T;
  },
) => {
  return useQuery({
    ...establishmentsQueryOptions(establishmentIds, enabled),
    select:
      options?.select ??
      ((establishments) => keyBy(establishments, "id") as unknown as T),
  });
};
