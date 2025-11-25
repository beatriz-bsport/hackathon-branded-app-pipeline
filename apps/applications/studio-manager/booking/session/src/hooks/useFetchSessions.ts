import { useCallback, useEffect } from "react";

import { getIsoDateString } from "@bsport/datetime-manipulation";
import { useAsync } from "@bsport/use-async";

import { fetchSessionsAction } from "#src/stores/session-list";
import { fetch } from "#src/utils/fetch";

export const useFetchSessions = (params: {
  date: Date;
  onSuccess: ({
    teacherIds,
    establishmentIds,
  }: {
    teacherIds: number[];
    establishmentIds: number[];
  }) => void;
}) => {
  const _fetchSessions = useCallback(async () => {
    const dateKey = getIsoDateString(params.date);
    return fetchSessionsAction(fetch, { date: dateKey });
  }, [params.date]);

  const [{ isLoading }, fetchSessions] = useAsync<typeof _fetchSessions>({
    asyncFn: _fetchSessions,
    dependencies: [_fetchSessions],
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
    fetchSessions();
  }, [fetchSessions]);

  return {
    isLoading,
  };
};
