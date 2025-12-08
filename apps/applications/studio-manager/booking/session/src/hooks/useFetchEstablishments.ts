import { queryOptions, useQuery } from "@tanstack/react-query";
import { keyBy } from "lodash";

import { fetchEstablishments } from "../api";

const ESTABLISHMENTS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const establishmentsQueryOptions = (
  establishmentIds: number[],
  enabled: boolean,
) => {
  const establishmentIdsSorted = [...establishmentIds].sort();
  return queryOptions({
    queryKey: ["establishments", establishmentIdsSorted],
    queryFn: () => fetchEstablishments(establishmentIdsSorted),
    enabled: enabled && establishmentIdsSorted.length > 0,
    staleTime: ESTABLISHMENTS_STALE_TIME,
  });
};

export const useFetchEstablishments = (
  establishmentIds: number[] = [],
  enabled = true,
) => {
  return useQuery({
    ...establishmentsQueryOptions(establishmentIds, enabled),
    select: (establishments) => keyBy(establishments, "id"),
  });
};
