import { useEffect } from "react";

import { sessionListViewedEvent } from "#src/events/session-list/events";
import {
  selectCalendarView,
  selectDisplayedColumns,
  selectFilters,
  selectShowCancelledSessions,
  useSessionListStore,
} from "#src/stores/session-list";
import { analyticsTrackSafeEvent } from "#src/utils/analytics-track-safe-event";

/**
 * Custom hook to track the session list view event with the current display settings.
 * We want to track the display settings (calendar view, displayed columns, whether cancelled sessions are displayed) when the user lands on the session list page.
 * This is why the useEffect has an empty dependency array, we only want to track the event once when the user lands on the page, and not every time the display settings change.
 */
export const useTrackSessionListViewed = () => {
  const displayed_columns = useSessionListStore(selectDisplayedColumns);
  const calendar_view = useSessionListStore(selectCalendarView);
  const cancelled_sessions_displayed = useSessionListStore(
    selectShowCancelledSessions,
  );
  const filters = useSessionListStore(selectFilters);

  useEffect(() => {
    analyticsTrackSafeEvent(sessionListViewedEvent, {
      calendar_view,
      displayed_columns,
      cancelled_sessions_displayed,
      filters,
    });
  }, []);
};
