import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetchManagerSessions } from "@bsport/api-book";

import { SESSIONS_QUERY_KEY } from "#src/hooks/constants";
import { fetch } from "#src/utils/fetch";

const SESSION_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const retrieveManagerSessions = fetchManagerSessions.bind(null, fetch);

const retrieveSessionQueryOptions = (sessionId?: number) => {
  return queryOptions({
    queryKey: [SESSIONS_QUERY_KEY, sessionId],
    queryFn: () =>
      retrieveManagerSessions({ id__in: sessionId ? [sessionId] : [] }),
    staleTime: SESSION_STALE_TIME,
    enabled: !!sessionId,
  });
};

export const useRetrieveManagerSession = (sessionId?: number) => {
  return useQuery({
    ...retrieveSessionQueryOptions(sessionId),
    select: (sessions) => sessions[0], // We know there's only one session since we're fetching by ID, so we can select it directly
  });
};
