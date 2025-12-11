import { queryOptions, useQuery } from "@tanstack/react-query";
import type { Dictionary } from "lodash";
import groupBy from "lodash/groupBy";
import { useMemo } from "react";

import {
  type FetchSessionsParams,
  type ManagerSession,
  fetchManagerSessions,
} from "@bsport/api-book";
import { Teacher } from "@bsport/api-core";
import type { Establishment } from "@bsport/api-core";
import { fromIsoString, getIsoDateString } from "@bsport/datetime-manipulation";
import { FilterElementState } from "@bsport/kaizen-primitive-core";
import { getCompanyTimezone } from "@bsport/timezone-utils";

import { selectFilters, useSessionListStore } from "../stores/session-list";
import type { EnrichedSession } from "../types";
import { fetch } from "../utils/fetch";
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
    };
  };

const getSessionDateStart = (session: EnrichedSession): string => {
  return fromIsoString(session.date_start, {
    zone: getCompanyTimezone(),
  }).toISODate()!;
};

const groupProcessedSessionsByDate = (
  sessions: ManagerSession[],
  teachersById: Record<number, Teacher>,
  establishmentsById: Record<number, Establishment>,
): Dictionary<EnrichedSession[]> => {
  const processedSessions = sessions.map(
    processSession(teachersById, establishmentsById),
  );

  return groupBy(processedSessions, getSessionDateStart);
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

const getParamsFromFilters = (
  filters: FilterElementState[],
): FetchSessionsParams => {
  let params = {};
  const activityTypeFilter = filters.find(
    (filter) => filter.field === "activity-type",
  );
  if (activityTypeFilter) {
    const filterValue = activityTypeFilter.valueIds[0];
    if (filterValue === "group-activity") {
      params = { ...params, is_workshop: false };
    } else if (filterValue === "workshop") {
      params = { ...params, is_workshop: true };
    }
  }
  return params;
};

const sessionsQueryOptions = (
  minDateKey: string | null,
  maxDateKey: string | null,
  filterParams: FetchSessionsParams,
) =>
  queryOptions({
    queryKey: ["sessions", minDateKey, maxDateKey, filterParams],
    queryFn: async () => {
      if (!minDateKey || !maxDateKey) {
        return [];
      }

      const fetchedData = await fetchManagerSessions(fetch, {
        ...filterParams,
        min_date: minDateKey,
        max_date: maxDateKey,
      });

      return fetchedData;
    },
    enabled: !!minDateKey && !!maxDateKey,
    staleTime: SESSIONS_STALE_TIME,
  });

export const useSessionListData = (
  params: { date: Date } | { minDate: Date; maxDate: Date } | null,
) => {
  const { minDateKey, maxDateKey } = extractDateRangeParams(params);

  const filters = useSessionListStore(selectFilters);
  const filterParams = getParamsFromFilters(filters);

  const { data: rawSessions = [], isLoading: isLoadingSessions } = useQuery(
    sessionsQueryOptions(minDateKey, maxDateKey, filterParams),
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
