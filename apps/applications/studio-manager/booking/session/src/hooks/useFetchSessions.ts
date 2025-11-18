import { useCallback, useEffect } from "react";

import { getIsoDateString } from "@bsport/datetime-manipulation";
import { fetchManagerSessionsAction } from "@bsport/store-booking-session";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

export const useFetchSessions = (params: {
  onSuccess: ({
    teacherIds,
    establishmentIds,
  }: {
    teacherIds: number[];
    establishmentIds: number[];
  }) => void;
}) => {
  const _fetchManagerSessions = useCallback(async () => {
    const today = new Date();

    return fetchManagerSessionsAction(fetch, {
      date: getIsoDateString(today), // YYYY-MM-DD
    });
  }, []);

  const [{ isLoading }, fetchManagerSessions] = useAsync<
    typeof _fetchManagerSessions
  >({
    asyncFn: _fetchManagerSessions,
    dependencies: [_fetchManagerSessions],
    onSuccess: ({ value }) => {
      const sessions = Array.isArray(value) ? value : value.results;

      // Retrieve teacher and establishment ids to fetch related data
      const teacherIds = new Set<number>();
      const establishmentIds = new Set<number>();
      sessions.forEach((session) => {
        teacherIds.add(session.coach);

        if (session.coach_override) {
          teacherIds.add(session.coach_override);
        }

        establishmentIds.add(session.establishment);
      });

      params?.onSuccess({
        teacherIds: Array.from(teacherIds),
        establishmentIds: Array.from(establishmentIds),
      });
    },
  });

  // -- Load data
  useEffect(() => {
    fetchManagerSessions();
  }, [fetchManagerSessions]);

  return {
    isLoading,
  };
};
