import { queryOptions, useQuery } from "@tanstack/react-query";
import pick from "lodash/pick";

import { fetchSimilarSessionsAPI } from "@bsport/api-book";

import { fetch } from "../utils/fetch";
import { SESSIONS_QUERY_KEY } from "./constants";

const SESSIONS_WITH_PENDING_REQUESTS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const fetchSimilarSessions = fetchSimilarSessionsAPI.bind(null, fetch);

const sessionsWithPendingRequestsQueryOptions = (
  sessionId: number,
  enabled: boolean,
) => {
  return queryOptions({
    queryKey: [`${SESSIONS_QUERY_KEY}_similar`, sessionId],
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
