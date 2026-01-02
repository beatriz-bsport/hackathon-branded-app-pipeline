import { queryOptions, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  type FetchSessionsParams,
  type ManagerSession,
  fetchManagerSessions,
} from "@bsport/api-book";
import { Teacher } from "@bsport/api-core";
import type { Establishment } from "@bsport/api-core";
import {
  DateTime,
  fromIsoString,
  getIsoDate,
} from "@bsport/datetime-manipulation";
import { getCompanyTimezone } from "@bsport/timezone-utils";

import { getParamsFromFilters } from "#src/components/SessionList/Filters/getParamsFromFilters";

import {
  selectFilters,
  selectShowCancelledSessions,
  useSessionListStore,
} from "../stores/session-list";
import type { EnrichedSession } from "../types";
import { fetch } from "../utils/fetch";
import {
  ADD_ON_IDENTIFIER_SUBTEACHER_TOOL,
  useCheckCompanyAddOn,
} from "../utils/permission";
import { useFetchSessionsWithPendingRequests } from "./use-fetch-sessions-with-pending-requests";
import { useFetchEstablishments } from "./useFetchEstablishments";
import { useFetchTeachers } from "./useFetchTeachers";

const SESSIONS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

/**
 * Process a single session by enriching it with teacher and establishment data,
 * applying name overrides, and adding color information.
 */
const processSession =
  (
    teachersById: Record<number, Teacher>,
    establishmentsById: Record<number, Establishment>,
    sessionsWithPendingRequests: number[],
  ) =>
  (session: ManagerSession): EnrichedSession => {
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
      hasPendingReplacementRequest: sessionsWithPendingRequests.includes(
        session.id,
      ),
    };
  };

export const getSessionDateStart = (session: EnrichedSession): string => {
  return fromIsoString(session.date_start, {
    zone: getCompanyTimezone(),
  }).toISODate()!;
};

const extractRelatedIds = (sessions: ManagerSession[]) => {
  const teacherIds = new Set<number>();
  const establishmentIds = new Set<number>();
  const sessionIds = new Set<number>();

  sessions.forEach((session) => {
    teacherIds.add(session.coach);
    if (session.coach_override) {
      teacherIds.add(session.coach_override);
    }
    establishmentIds.add(session.establishment);
    sessionIds.add(session.id);
  });

  return {
    teacherIds: Array.from(teacherIds),
    establishmentIds: Array.from(establishmentIds),
    sessionIds: Array.from(sessionIds),
  };
};

const extractDateRangeParams = (
  params: { date: DateTime } | { minDate: DateTime; maxDate: DateTime } | null,
): { minDateKey: string | null; maxDateKey: string | null } => {
  if (!params) return { minDateKey: null, maxDateKey: null };

  if ("date" in params) {
    return {
      minDateKey: getIsoDate(params.date),
      maxDateKey: getIsoDate(params.date),
    };
  }

  return {
    minDateKey: getIsoDate(params.minDate),
    maxDateKey: getIsoDate(params.maxDate),
  };
};

const sessionsQueryOptions = (
  minDateKey: string | null,
  maxDateKey: string | null,
  filterParams: FetchSessionsParams,
  showCancelledSessions: boolean,
) =>
  queryOptions({
    queryKey: [
      "sessions",
      minDateKey,
      maxDateKey,
      filterParams,
      showCancelledSessions,
    ],
    queryFn: async () => {
      if (!minDateKey || !maxDateKey) {
        return [];
      }

      const params = {
        ...filterParams,
        min_date: minDateKey,
        max_date: maxDateKey,
      };
      if (!showCancelledSessions) {
        params["available"] = true;
      }

      const fetchedData = await fetchManagerSessions(fetch, params);

      return fetchedData;
    },
    enabled: !!minDateKey && !!maxDateKey,
    staleTime: SESSIONS_STALE_TIME,
  });

export const useSessionListData = (
  params: { date: DateTime } | { minDate: DateTime; maxDate: DateTime } | null,
) => {
  const { minDateKey, maxDateKey } = extractDateRangeParams(params);

  const filters = useSessionListStore(selectFilters);
  const filterParams = getParamsFromFilters(filters);

  const showCancelledSessions = useSessionListStore(
    selectShowCancelledSessions,
  );

  const { data: rawSessions = [], isLoading: isLoadingSessions } = useQuery(
    sessionsQueryOptions(
      minDateKey,
      maxDateKey,
      filterParams,
      showCancelledSessions,
    ),
  );

  const { teacherIds, establishmentIds, sessionIds } = useMemo(
    () => extractRelatedIds(rawSessions),
    [rawSessions],
  );
  const shouldFetchPendingRequests = useCheckCompanyAddOn(
    ADD_ON_IDENTIFIER_SUBTEACHER_TOOL,
  );

  // Fetch teachers and establishments as dependent queries (only after sessions load)
  const { data: teachersById = {}, isLoading: isLoadingTeachers } =
    useFetchTeachers(teacherIds, !isLoadingSessions);
  const { data: establishmentsById = {}, isLoading: isLoadingEstablishments } =
    useFetchEstablishments(establishmentIds, !isLoadingSessions);
  const { data: sessionsWithPendingRequests = [] } =
    useFetchSessionsWithPendingRequests(
      sessionIds,
      shouldFetchPendingRequests && !isLoadingSessions,
    );

  const sessions = useMemo(
    () =>
      rawSessions.map(
        processSession(
          teachersById,
          establishmentsById,
          sessionsWithPendingRequests,
        ),
      ),
    [
      rawSessions,
      teachersById,
      establishmentsById,
      sessionsWithPendingRequests,
    ],
  );

  return {
    sessions,
    isLoading:
      isLoadingSessions || isLoadingTeachers || isLoadingEstablishments,
  };
};
