import { queryOptions, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useNavigate } from "react-router";

import {
  type FetchSessionsParams,
  GroupSession,
  type ManagerSession,
  MetaActivity,
  fetchManagerSessions,
} from "@bsport/api-book";
import { Teacher } from "@bsport/api-core";
import type { Establishment } from "@bsport/api-core";
import {
  type DateTime,
  fromIsoString,
  getIsoDate,
} from "@bsport/datetime-manipulation";
import { dataAccessLayer } from "@bsport/sm-backbone";
import { getCompanyTimezone } from "@bsport/timezone-utils";

import { getParamsFromFilters } from "#src/components/SessionList/Filters/getParamsFromFilters";
import { sessionListSessionClickedEvent } from "#src/events/session-list/events";
import { useUrls } from "#src/urls";
import { analyticsTrackSafeEvent } from "#src/utils/analytics-track-safe-event";

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
  useObjectLevelPermission,
} from "../utils/permission";
import { SESSIONS_QUERY_KEY } from "./constants";
import { useFetchSessionsWithPendingRequests } from "./session-api/fetch/use-fetch-sessions-with-pending-requests";
import { useFetchActivitiesByIds } from "./use-fetch-activities-by-ids";
import { useFetchGroupSessions } from "./use-fetch-group-sessions";
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
    groupSessionsById: Record<number, GroupSession>,
    activitiesById: Record<number, MetaActivity>,
    navigateToBookingsManagement: (session: EnrichedSession) => void,
  ) =>
  (session: ManagerSession): EnrichedSession => {
    const teacher = teachersById[session.coach];
    const teacherOverride = session.coach_override
      ? teachersById[session.coach_override]
      : undefined;
    const establishment = establishmentsById[session.establishment];
    const group = session.group ? groupSessionsById[session.group] : undefined;
    const activity = activitiesById[session.meta_activity];

    const sessionName = session.name_override || session.name;

    const teacherName = teacherOverride?.name ?? teacher?.name;

    return {
      ...session,
      teacherName: teacherName,
      originalTeacherName: teacher?.name,
      establishmentName: establishment?.title,
      name: sessionName,
      color: session.meta_activity_color,
      hasPendingReplacementRequest: sessionsWithPendingRequests.includes(
        session.id,
      ),
      groupName: group?.name,
      isTeacherArchived: teacher ? teacher.disabled : false,
      isEstablishmentArchived: establishment ? establishment.disabled : false,
      isMetaActivityArchived: activity ? !activity.customer_enabled : false,
      onRowClick: () => {
        analyticsTrackSafeEvent(sessionListSessionClickedEvent, {
          session_id: session.id,
          session_name: sessionName,
          session_date: session.date_start,
          teacher_name: teacherName,
          teacher_id: teacherOverride?.id ?? teacher?.id,
          participant_number: session.nb_attendant,
          session_type: session?.is_workshop ? "workshop" : "group-activity",
          session_is_online: session.is_broadcast,
        });

        navigateToBookingsManagement(session);
      },
      navigateToBookingsManagement,
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
  const groupIds = new Set<number>();
  const activityIds = new Set<number>();

  sessions.forEach((session) => {
    teacherIds.add(session.coach);
    if (session.coach_override) {
      teacherIds.add(session.coach_override);
    }
    establishmentIds.add(session.establishment);
    sessionIds.add(session.id);
    if (session.group) {
      groupIds.add(session.group);
    }
    activityIds.add(session.meta_activity);
  });

  return {
    teacherIds: Array.from(teacherIds),
    establishmentIds: Array.from(establishmentIds),
    sessionIds: Array.from(sessionIds),
    groupIds: Array.from(groupIds),
    activityIds: Array.from(activityIds),
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
  restrictedTeachers: number[],
) =>
  queryOptions({
    queryKey: [
      SESSIONS_QUERY_KEY,
      minDateKey,
      maxDateKey,
      filterParams,
      showCancelledSessions,
      restrictedTeachers,
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

      if (restrictedTeachers.length > 0) {
        params["coaches"] = restrictedTeachers;
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

  const { getBookingsManagementUrl } = useUrls();

  const showCancelledSessions = useSessionListStore(
    selectShowCancelledSessions,
  );
  const hasShowCancelledSessionsPermission = useObjectLevelPermission(
    "planning.calendar.allowed_actions.readCancellations",
  );
  const effectiveShowCancelledSessions = hasShowCancelledSessionsPermission
    ? showCancelledSessions
    : false;
  const restrictedTeachers = dataAccessLayer.useUserRestrictedTeachers();

  const navigate = useNavigate();

  const {
    data: rawSessions = [],
    isLoading: isLoadingSessions,
    error,
  } = useQuery(
    sessionsQueryOptions(
      minDateKey,
      maxDateKey,
      filterParams,
      effectiveShowCancelledSessions,
      restrictedTeachers,
    ),
  );

  const { teacherIds, establishmentIds, sessionIds, groupIds, activityIds } =
    useMemo(() => extractRelatedIds(rawSessions), [rawSessions]);
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
  const { data: groupSessionsById = {} } = useFetchGroupSessions(
    groupIds,
    !isLoadingSessions,
  );
  const { data: activitiesById = {} } = useFetchActivitiesByIds(
    activityIds,
    !isLoadingSessions,
  );

  const sessions = useMemo(() => {
    const navigateToBookingsManagement = (session: EnrichedSession) => {
      navigate(getBookingsManagementUrl(session.id));
    };

    return rawSessions.map(
      processSession(
        teachersById,
        establishmentsById,
        sessionsWithPendingRequests,
        groupSessionsById,
        activitiesById,
        navigateToBookingsManagement,
      ),
    );
  }, [
    rawSessions,
    teachersById,
    establishmentsById,
    sessionsWithPendingRequests,
    groupSessionsById,
    activitiesById,
    getBookingsManagementUrl,
    navigate,
  ]);

  return {
    sessions,
    isLoading:
      isLoadingSessions || isLoadingTeachers || isLoadingEstablishments,
    error,
  };
};
