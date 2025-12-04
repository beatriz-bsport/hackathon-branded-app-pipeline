import { queryOptions, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { fromIsoString, getIsoDateString } from "@bsport/datetime-manipulation";
import type { Establishment } from "@bsport/store-core-data-establishment";
import type { Teacher } from "@bsport/store-core-data-teacher";
import { getCompanyTimezone } from "@bsport/timezone-utils";

import { fetchManagerSessionsAPI } from "../api/api";
import { EnrichedSession, ManagerSession } from "../api/types";
import { fetch } from "../utils/fetch";
import { useFetchEstablishments } from "./useFetchEstablishments";
import { useFetchTeachers } from "./useFetchTeachers";

const SESSIONS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

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

const groupProcessedSessionsByDate = (
  sessions: ManagerSession[],
  teachersById: Record<number, Teacher>,
  establishmentsById: Record<number, Establishment>,
): Record<string, EnrichedSession[]> => {
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
};

const extractRelatedIds = (sessions: ManagerSession[]) => {
  const teacherIds = new Set<number>();
  const establishmentIds = new Set<number>();

  sessions.forEach((session) => {
    teacherIds.add(session.coach);
    if (session.coach_override) {
      teacherIds.add(session.coach_override);
    }
    establishmentIds.add(session.establishment);
  });

  return {
    teacherIds: Array.from(teacherIds),
    establishmentIds: Array.from(establishmentIds),
  };
};

const extractDateRangeParams = (
  params: { date: Date } | { minDate: Date; maxDate: Date } | null,
): { minDateKey: string | null; maxDateKey: string | null } => {
  if (!params) return { minDateKey: null, maxDateKey: null };

  if ("date" in params) {
    return {
      minDateKey: getIsoDateString(params.date),
      maxDateKey: getIsoDateString(params.date),
    };
  }

  return {
    minDateKey: getIsoDateString(params.minDate),
    maxDateKey: getIsoDateString(params.maxDate),
  };
};

const sessionsQueryOptions = (
  minDateKey: string | null,
  maxDateKey: string | null,
) =>
  queryOptions({
    queryKey: ["sessions", minDateKey, maxDateKey],
    queryFn: async () => {
      if (!minDateKey || !maxDateKey) {
        return [];
      }
      const [uri, init] = fetchManagerSessionsAPI({
        min_date: minDateKey,
        max_date: maxDateKey,
      });

      const { data: fetchData } = await fetch<ManagerSession[]>(uri, init);

      return fetchData;
    },
    enabled: !!minDateKey && !!maxDateKey,
    staleTime: SESSIONS_STALE_TIME,
  });

export const useSessionListData = (
  params: { date: Date } | { minDate: Date; maxDate: Date } | null,
) => {
  const { minDateKey, maxDateKey } = extractDateRangeParams(params);

  const { data: rawSessions = [], isLoading: isLoadingSessions } = useQuery(
    sessionsQueryOptions(minDateKey, maxDateKey),
  );

  const { teacherIds, establishmentIds } = useMemo(
    () => extractRelatedIds(rawSessions),
    [rawSessions],
  );

  // Fetch teachers and establishments as dependent queries (only after sessions load)
  const { data: teachersById = {}, isLoading: isLoadingTeachers } =
    useFetchTeachers(teacherIds, !isLoadingSessions);
  const { data: establishmentsById = {}, isLoading: isLoadingEstablishments } =
    useFetchEstablishments(establishmentIds, !isLoadingSessions);

  const sessionsByDate = useMemo(
    () =>
      groupProcessedSessionsByDate(
        rawSessions,
        teachersById,
        establishmentsById,
      ),
    [rawSessions, teachersById, establishmentsById],
  );

  return {
    sessionsByDate,
    isLoading:
      isLoadingSessions || isLoadingTeachers || isLoadingEstablishments,
  };
};
