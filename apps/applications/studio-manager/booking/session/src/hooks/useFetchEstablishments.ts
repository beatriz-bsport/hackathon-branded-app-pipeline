import { queryOptions, useQuery } from "@tanstack/react-query";
import { keyBy } from "lodash";

import { fetchEstablishments } from "../api";

const establishmentsQueryOptions = (
  establishmentIds: number[],
  enabled: boolean,
) =>
  queryOptions({
    queryKey: ["establishments", [...establishmentIds].sort().join(",")],
    queryFn: () => fetchEstablishments(establishmentIds),
    enabled: enabled && establishmentIds.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

export const useFetchEstablishments = (
  establishmentIds: number[] = [],
  enabled = true,
) => {
  return useQuery({
    ...establishmentsQueryOptions(establishmentIds, enabled),
    select: (establishments) => keyBy(establishments, "id"),
  });
};
