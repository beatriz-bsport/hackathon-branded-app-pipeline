import { queryOptions, useQuery } from "@tanstack/react-query";
import keyBy from "lodash/keyBy";

import { EstablishmentGroup, fetchEstablishmentGroups } from "@bsport/api-core";

import { fetch } from "../utils/fetch";

const ESTABLISHMENT_GROUPS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchEstablishmentGroupsByIds = async (
  ids: number[],
): Promise<EstablishmentGroup[]> => {
  const { results } = await fetchEstablishmentGroups(fetch, {
    id__in: ids,
  });
  return results;
};

const establishmentGroupsQueryOptions = (ids: number[], enabled: boolean) => {
  const idsSorted = [...ids].sort();
  return queryOptions({
    queryKey: ["establishmentGroups", idsSorted],
    queryFn: () => fetchEstablishmentGroupsByIds(idsSorted),
    enabled: enabled && idsSorted.length > 0,
    staleTime: ESTABLISHMENT_GROUPS_STALE_TIME,
  });
};

export const useFetchEstablishmentGroups = <
  T = Record<string, EstablishmentGroup>,
>(
  ids: number[] = [],
  enabled = true,
  options?: {
    select?: (data: EstablishmentGroup[]) => T;
  },
) => {
  return useQuery({
    ...establishmentGroupsQueryOptions(ids, enabled),
    select:
      options?.select ?? ((groups) => keyBy(groups, "id") as unknown as T),
  });
};
