import { useQuery } from "@tanstack/react-query";

import { dataAccessLayer } from "@bsport/sm-backbone";

import { getParamsFromFilters } from "#src/components/SessionList/Filters/getParamsFromFilters";
import {
  selectSelectedDate,
  selectSessionFilters,
  selectSessionShowCancelled,
  useCalendarStore,
} from "#src/stores/calendar";
import { extractDateRangeParams } from "#src/utils/extract-date-range-params";
import { useObjectLevelPermission } from "#src/utils/permission";

import { sessionsQueryOptions } from "./useSessionListData";

/**
 * Custom hook to retrieve the next and previous session IDs based on the current session ID and the applied filters.
 * It uses the same filters and date range as the CalendarPage to ensure consistency in navigation.
 *
 * @param currentSessionId - The ID of the current session for which to find the next and previous sessions.
 * @returns An object containing the nextSessionId and previousSessionId, or undefined if not found.
 */
export const useSessionNavigation = (currentSessionId: number) => {
  // Read the same filter/date state the CalendarPage uses
  // Because the filters are saved in a persistent zustand store, we can be sure to read the same values the CalendarPage used to fetch the session list, even if we are in a different route
  const filters = useCalendarStore(selectSessionFilters);
  const filterParams = getParamsFromFilters(filters);
  const selectedDate = useCalendarStore(selectSelectedDate);
  const showCancelledSessions = useCalendarStore(selectSessionShowCancelled);
  const hasShowCancelledSessionsPermission = useObjectLevelPermission(
    "planning.calendar.allowed_actions.readCancellations",
  );

  const effectiveShowCancelledSessions = hasShowCancelledSessionsPermission
    ? showCancelledSessions
    : false;

  const restrictedTeachers = dataAccessLayer.useUserRestrictedTeachers();

  const { minDateKey, maxDateKey } = extractDateRangeParams(
    selectedDate.type === "single"
      ? { date: selectedDate.date }
      : selectedDate.minDate && selectedDate.maxDate
        ? { minDate: selectedDate.minDate, maxDate: selectedDate.maxDate }
        : null,
  );

  /**
   * We fetch the sessions with the same filters and date range as the CalendarPage, and then find the index of the current session to determine the next and previous session IDs.
   * This ensures that the navigation is consistent with the sessions displayed in the CalendarPage, even when filters are applied.
   * We also handle the case where the current session might not be in the list of fetched sessions (e.g., if it's outside the date range or doesn't match the filters) by returning undefined for both next and previous session IDs.
   */
  const { data, isLoading } = useQuery({
    ...sessionsQueryOptions(
      minDateKey,
      maxDateKey,
      filterParams,
      effectiveShowCancelledSessions,
      restrictedTeachers,
    ),
    select: (sessions) => {
      const currentIndex = sessions.findIndex((s) => s.id === currentSessionId);
      if (currentIndex === -1) return undefined;
      return {
        previousSessionId:
          currentIndex > 0 ? sessions[currentIndex - 1].id : undefined,
        nextSessionId:
          currentIndex < sessions.length - 1
            ? sessions[currentIndex + 1].id
            : undefined,
      };
    },
  });

  return {
    nextSessionId: data?.nextSessionId,
    previousSessionId: data?.previousSessionId,
    isLoading,
  };
};
