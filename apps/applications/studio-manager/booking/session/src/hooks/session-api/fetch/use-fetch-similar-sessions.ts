import { queryOptions, useQuery } from "@tanstack/react-query";
import pick from "lodash/pick";

import { fetchSimilarSessionsAPI, sessionKeys } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const SESSIONS_WITH_PENDING_REQUESTS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchSimilarSessions = fetchSimilarSessionsAPI.bind(null, fetch);

const sessionsWithPendingRequestsQueryOptions = (
  sessionId: number,
  enabled: boolean,
) => {
  return queryOptions({
    queryKey: sessionKeys.similarList(sessionId),
    queryFn: () => fetchSimilarSessions(sessionId, {}),
    enabled: enabled,
    staleTime: SESSIONS_WITH_PENDING_REQUESTS_STALE_TIME,
  });
};

export const useFetchSimilarSessions = (sessionId: number, enabled = true) => {
  return useQuery({
    ...sessionsWithPendingRequestsQueryOptions(sessionId, enabled),
    select: (sessions) =>
      sessions.map((session) =>
        pick(session, [
          "id",
          "date_start",
          "effectif",
          "validated_booking_count",
          "timezone_name",
        ]),
      ),
  });
};
