import { queryOptions, useQuery } from "@tanstack/react-query";

import {
  listSessionsWithPendingReplacementRequestIdsAPI,
  sessionKeys,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const SESSIONS_WITH_PENDING_REQUESTS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const listSessionsWithPendingReplacementRequestIds =
  listSessionsWithPendingReplacementRequestIdsAPI.bind(null, fetch);

const sessionsWithPendingRequestsQueryOptions = (
  sessionIds: number[],
  enabled: boolean,
) => {
  const sessionIdsSorted = [...sessionIds].sort();
  const params = {
    offer_id_list: sessionIdsSorted,
  };

  return queryOptions({
    queryKey: sessionKeys.withPendingReplacementRequests(params),
    queryFn: () => listSessionsWithPendingReplacementRequestIds(params),
    enabled: enabled && sessionIdsSorted.length > 0,
    staleTime: SESSIONS_WITH_PENDING_REQUESTS_STALE_TIME,
  });
};

export const useFetchSessionsWithPendingRequests = (
  sessionIds: number[] = [],
  enabled = true,
) => {
  return useQuery({
    ...sessionsWithPendingRequestsQueryOptions(sessionIds, enabled),
  });
};
