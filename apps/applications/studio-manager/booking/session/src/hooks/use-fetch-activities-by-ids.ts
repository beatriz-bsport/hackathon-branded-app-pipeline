import { queryOptions, useQuery } from "@tanstack/react-query";
import keyBy from "lodash/keyBy";

import {
  MetaActivity,
  fetchGroupActivitiesAndWorkshops,
  groupActivityKeys,
} from "@bsport/api-book";
import { PaginatedResponse } from "@bsport/store-base";

import { fetch } from "../utils/fetch";

const ACTIVITIES_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchActivitiesByIds = fetchGroupActivitiesAndWorkshops.bind(null, fetch);

const activitiesByIdsQueryOptions = (ids: number[], enabled: boolean) => {
  const params = {
    inIdList: ids,
  };
  return queryOptions({
    queryKey: groupActivityKeys.list(params),
    queryFn: () => fetchActivitiesByIds(params),
    staleTime: ACTIVITIES_STALE_TIME,
    enabled: enabled && ids.length > 0,
  });
};

export const useFetchActivitiesByIds = <T = Record<string, MetaActivity>>(
  ids: number[],
  enabled: boolean = true,
  options?: {
    select?: (data: PaginatedResponse<MetaActivity>) => T;
  },
) => {
  return useQuery({
    ...activitiesByIdsQueryOptions(ids, enabled),
    select:
      options?.select ??
      ((data) => {
        return keyBy(data.results, "id") as unknown as T;
      }),
  });
};
