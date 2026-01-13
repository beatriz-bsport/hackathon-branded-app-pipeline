import { queryOptions, useQuery } from "@tanstack/react-query";
import { keyBy } from "lodash";

import { fetchLevelsAPI } from "@bsport/api-core";

import { fetch } from "#src/utils/fetch";

import { LEVEL_QUERY_KEY } from "./constants";

const LEVELS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchLevels = fetchLevelsAPI.bind(null, fetch);

const levelsQueryOptions = (companyId?: number) => {
  return queryOptions({
    queryKey: [LEVEL_QUERY_KEY, companyId],
    queryFn: () => fetchLevels({ is_active: true, company: companyId }),
    enabled: !!companyId,
    staleTime: LEVELS_STALE_TIME,
  });
};

export const useFetchLevels = (companyId?: number) => {
  return useQuery({
    ...levelsQueryOptions(companyId),
    select: (levels) => keyBy(levels, "id"),
  });
};
