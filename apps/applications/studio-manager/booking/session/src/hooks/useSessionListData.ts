import { useCallback, useEffect } from "react";
import { Result } from "typescript-result";

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

import {
  FetchSessionsResponse,
  enrichSessionsWithRelatedData,
  fetchSessionsAction,
  selectProcessedSessionsByDate,
  useSessionListStore,
} from "../stores/session-list";
import { fetch } from "../utils/fetch";
import { useFetchEstablishments } from "./useFetchEstablishments";
import { useFetchTeachers } from "./useFetchTeachers";

export const useSessionListData = (
  params: { date: Date } | { minDate: Date; maxDate: Date } | null,
) => {
  const { isLoading: isLoadingTeachers, fetchTeachers } = useFetchTeachers();
  const { isLoading: isLoadingEstablishments, fetchEstablishments } =
    useFetchEstablishments();

  const teachersById = useTeacherStore(selectTeachersById);
  const establishmentsById = useEstablishmentStore(
    selectEstablishmentMappedById,
  );

  const minDate = params
    ? "date" in params
      ? params.date
      : params.minDate
    : null;
  const maxDate = params
    ? "date" in params
      ? params.date
      : params.maxDate
    : null;

  const minDateKey = minDate ? getIsoDateString(minDate) : null;
  const maxDateKey = maxDate ? getIsoDateString(maxDate) : null;

  const _fetchSessions = useCallback(async () => {
    // Don't fetch if we don't have complete date range
    if (!minDateKey || !maxDateKey) {
      return Result.ok<FetchSessionsResponse>({ results: [] });
    }
    return fetchSessionsAction(fetch, {
      minDate: minDateKey,
      maxDate: maxDateKey,
    });
  }, [minDateKey, maxDateKey]);

  const [{ isLoading: isLoadingSessions }, executeFetchSessions] = useAsync<
    typeof _fetchSessions
  >({
    asyncFn: _fetchSessions,
    dependencies: [_fetchSessions],
    onSuccess: ({ value }) => {
      const sessions = value.results;

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

  // Enrich sessions whenever teachers or establishments are loaded
  useEffect(() => {
    if (
      Object.keys(teachersById).length > 0 ||
      Object.keys(establishmentsById).length > 0
    ) {
      enrichSessionsWithRelatedData({ teachersById, establishmentsById });
    }
  }, [teachersById, establishmentsById]);

  const sessionsByDate = useSessionListStore(selectProcessedSessionsByDate);

  return {
    sessionsByDate,
    isLoading:
      isLoadingSessions || isLoadingTeachers || isLoadingEstablishments,
  };
};
