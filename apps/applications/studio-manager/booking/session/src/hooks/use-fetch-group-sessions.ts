import { queryOptions, useQuery } from "@tanstack/react-query";
import keyBy from "lodash/keyBy";

import { fetchGroupSessionsAPI, groupSessionKeys } from "@bsport/api-book";

import { fetch } from "../utils/fetch";

const GROUP_SESSIONS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchGroupSessions = fetchGroupSessionsAPI.bind(null, fetch);

const groupSessionsQueryOptions = (
  groupSessionIds: number[],
  enabled: boolean,
) => {
  const groupSessionIdsSorted = [...groupSessionIds].sort();
  const queryParams = {
    id__in: groupSessionIdsSorted,
    page: 1,
    page_size: groupSessionIdsSorted.length,
  };
  return queryOptions({
    queryKey: groupSessionKeys.list(queryParams),
    queryFn: () => fetchGroupSessions(queryParams),
    enabled: enabled && groupSessionIdsSorted.length > 0,
    staleTime: GROUP_SESSIONS_STALE_TIME,
  });
};

export const useFetchGroupSessions = (
  groupSessionIds: number[] = [],
  enabled = true,
) => {
  return useQuery({
    ...groupSessionsQueryOptions(groupSessionIds, enabled),
    select: (groupSessions) => keyBy(groupSessions.results, "id"),
  });
};
