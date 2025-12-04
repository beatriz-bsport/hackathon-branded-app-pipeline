import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

import { fromIsoString, getIsoDateString } from "@bsport/datetime-manipulation";
import type { Establishment } from "@bsport/store-core-data-establishment";
import {
  selectEstablishmentMappedById,
  useEstablishmentStore,
} from "@bsport/store-core-data-establishment";
import type { Teacher } from "@bsport/store-core-data-teacher";
import {
  selectTeachersById,
  useTeacherStore,
} from "@bsport/store-core-data-teacher";
import { getCompanyTimezone } from "@bsport/timezone-utils";

import { fetchManagerSessionsAPI } from "../stores/session-list/api";
import { EnrichedSession, ManagerSession } from "../types";
import { fetch } from "../utils/fetch";
import { useFetchEstablishments } from "./useFetchEstablishments";
import { useFetchTeachers } from "./useFetchTeachers";

/**
 * Process a single session by enriching it with teacher and establishment data,
 * applying name overrides, and adding color information.
 */
const processSession = (
  session: ManagerSession,
  teachersById: Record<number, Teacher>,
  establishmentsById: Record<number, Establishment>,
): EnrichedSession => {
  const teacher = teachersById[session.coach];
  const teacherOverride = session.coach_override
    ? teachersById[session.coach_override]
    : undefined;
  const establishment = establishmentsById[session.establishment];

  const { name_override, ...sessionWithoutOverride } = session;

  return {
    ...sessionWithoutOverride,
    teacherName: teacherOverride?.name ?? teacher?.name,
    originalTeacherName: teacher?.name,
    establishmentName: establishment?.title,
    name: name_override || session.name,
    color: session.meta_activity_color,
  };
};

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

  const { data, isLoading: isLoadingSessions } = useQuery({
    queryKey: ["sessions", minDateKey, maxDateKey],
    queryFn: async () => {
      if (!minDateKey || !maxDateKey) {
        return { results: [] };
      }
      const [uri, init] = fetchManagerSessionsAPI({
        min_date: minDateKey,
        max_date: maxDateKey,
      });

      const { data: fetchData } = await fetch<ManagerSession[]>(uri, init);

      return { results: fetchData };
    },
    enabled: !!minDateKey && !!maxDateKey,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (!data) return;

    const sessions = data.results;

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
  }, [data, fetchTeachers, fetchEstablishments]);

  const sessionsByDate = useMemo(() => {
    if (!data?.results) return {};

    const sessions = data.results;
    const enrichedSessionsByDate: Record<string, EnrichedSession[]> = {};

    sessions.forEach((session) => {
      const processedSession = processSession(
        session,
        teachersById,
        establishmentsById,
      );

      const sessionDate = fromIsoString(session.date_start, {
        zone: getCompanyTimezone(),
      }).toISODate();

      if (sessionDate) {
        if (!enrichedSessionsByDate[sessionDate]) {
          enrichedSessionsByDate[sessionDate] = [];
        }
        enrichedSessionsByDate[sessionDate].push(processedSession);
      }
    });

    return enrichedSessionsByDate;
  }, [data, teachersById, establishmentsById]);

  return {
    sessionsByDate,
    isLoading:
      isLoadingSessions || isLoadingTeachers || isLoadingEstablishments,
  };
};
