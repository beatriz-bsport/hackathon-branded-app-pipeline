// DUPLICATE OF: apps/applications/studio-manager/booking/session/src/hooks/session-api/fetch/use-fetch-similar-sessions.ts
import { queryOptions, useQuery } from "@tanstack/react-query";
import pick from "lodash/pick";

import { fetchSimilarSessionsAPI } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const STALE_TIME = 2 * 60 * 1000;

const fetchSimilarSessions = fetchSimilarSessionsAPI.bind(null, fetch);

const similarSessionsQueryOptions = (sessionId: number, enabled: boolean) =>
  queryOptions({
    queryKey: ["wellhub-similar-sessions", sessionId],
    queryFn: () => fetchSimilarSessions(sessionId, {}),
    enabled,
    staleTime: STALE_TIME,
  });

export const useFetchSimilarSessions = (sessionId: number, enabled = true) =>
  useQuery({
    ...similarSessionsQueryOptions(sessionId, enabled),
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
