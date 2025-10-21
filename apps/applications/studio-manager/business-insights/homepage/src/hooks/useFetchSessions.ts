import { useCallback } from "react";

import { getIsoDateString } from "@bsport/datetime-manipulation";
import { fetchManagerSessionsAction } from "@bsport/store-booking-session";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

export const useFetchSessions = (params: {
  onSuccess: ({
    teacherIds,
    sessionIds,
  }: {
    teacherIds: number[];
    sessionIds: number[];
  }) => void;
}) => {
  const handleFetchManagerSessions = useCallback(async () => {
    const today = new Date();

    return fetchManagerSessionsAction(fetch, {
      only_future_strict: true,
      available: true,
      date: getIsoDateString(today), // YYYY-MM-DD
    });
  }, []);

  const [{ isLoading }, fetchManagerSessions] = useAsync<
    typeof handleFetchManagerSessions
  >({
    asyncFn: handleFetchManagerSessions,
    dependencies: [handleFetchManagerSessions],
    onSuccess: ({ value }) => {
      const sessions = Array.isArray(value) ? value : value.results;

      // Retrieve teacher ids to fetch related data
      const teacherIds = new Set<number>();
      sessions.forEach((session) => {
        if (session.coach) {
          teacherIds.add(session.coach);
        }

        if (session.coach_override) {
          teacherIds.add(session.coach_override);
        }
      });

      params?.onSuccess({
        teacherIds: Array.from(teacherIds),
        sessionIds: sessions.map((session) => session.id),
      });
    },
    onFailure: console.error,
  });

  return {
    isLoading,
    fetchManagerSessions,
  };
};
