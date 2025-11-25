import { useCallback, useEffect } from "react";

import { getIsoDateString } from "@bsport/datetime-manipulation";
import {
  selectEstablishmentMappedById,
  useEstablishmentStore,
} from "@bsport/store-core-data-establishment";
import {
  selectTeachersById,
  useTeacherStore,
} from "@bsport/store-core-data-teacher";
import { useAsync } from "@bsport/use-async";

import type { EnrichedSession } from "../../stores/session-list";
import {
  fetchSessionsAction,
  selectProcessedSessions,
  useSessionListStore,
} from "../stores/session-list";
import { fetch } from "../utils/fetch";
import { useFetchEstablishments } from "./useFetchEstablishments";
import { useFetchTeachers } from "./useFetchTeachers";

export const useSessionListData = (params: { date: Date }) => {
  const { isLoading: isLoadingTeachers, fetchTeachers } = useFetchTeachers();
  const { isLoading: isLoadingEstablishments, fetchEstablishments } =
    useFetchEstablishments();

  const _fetchSessions = useCallback(async () => {
    const dateKey = getIsoDateString(params.date);
    return fetchSessionsAction(fetch, { date: dateKey });
  }, [params.date]);

  const [{ isLoading: isLoadingSessions }, executeFetchSessions] = useAsync<
    typeof _fetchSessions
  >({
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

      if (teacherIds.size > 0) {
        fetchTeachers({ teacherIds: Array.from(teacherIds) });
      }
      if (establishmentIds.size > 0) {
        fetchEstablishments({ establishmentIds: Array.from(establishmentIds) });
      }
    },
  });

  useEffect(() => {
    executeFetchSessions();
  }, [executeFetchSessions]);

  const sessions = useSessionListStore(selectProcessedSessions);
  const teachersById = useTeacherStore(selectTeachersById);
  const establishmentsById = useEstablishmentStore(
    selectEstablishmentMappedById,
  );

  const tableRowData: EnrichedSession[] = sessions.map((session) => ({
    ...session,
    teacher: teachersById[session.coach],
    teacherOverride: session.coach_override
      ? teachersById[session.coach_override]
      : undefined,
    teacherName: session.coach_override
      ? teachersById[session.coach_override]?.name
      : teachersById[session.coach]?.name,
    originalTeacherName: teachersById[session.coach]?.name,
    establishmentName: establishmentsById[session.establishment]?.title,
  }));

  return {
    sessions: tableRowData,
    isLoading:
      isLoadingSessions || isLoadingTeachers || isLoadingEstablishments,
  };
};
