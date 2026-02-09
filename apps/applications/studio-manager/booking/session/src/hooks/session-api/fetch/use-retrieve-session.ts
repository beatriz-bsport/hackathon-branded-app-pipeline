import { queryOptions, useQuery } from "@tanstack/react-query";

import { RetrieveSessionParams, retrieveSessionAPI } from "@bsport/api-book";

import { SESSIONS_QUERY_KEY } from "#src/hooks/constants";
import { fetch } from "#src/utils/fetch";

const SESSION_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const retrieveSession = retrieveSessionAPI.bind(null, fetch);

const retrieveSessionQueryOptions = (
  sessionId?: number,
  params?: RetrieveSessionParams,
) => {
  return queryOptions({
    queryKey: [SESSIONS_QUERY_KEY, sessionId, params],
    queryFn: () => retrieveSession(sessionId!, params),
    staleTime: SESSION_STALE_TIME,
    enabled: !!sessionId,
  });
};

export const useRetrieveSession = (
  sessionId?: number,
  params?: RetrieveSessionParams,
) => {
  return useQuery({
    ...retrieveSessionQueryOptions(sessionId, params),
  });
};
