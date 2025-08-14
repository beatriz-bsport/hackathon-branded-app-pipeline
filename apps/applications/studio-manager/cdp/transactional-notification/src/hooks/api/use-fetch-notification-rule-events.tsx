import { useEffect } from "react";

import {
  fetchNotificationRuleEventsAction,
  selectNotificationRuleEvents,
  selectNotificationRuleEventsByGroup,
  useNotificationRuleStore,
} from "@bsport/store-cdp-notification-rule";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const _fetchNotificationRuleEvents = fetchNotificationRuleEventsAction.bind(
  null,
  fetch,
);

/**
 * Hook for fetching notification rule events from the system.
 *
 * This hook retrieves all available notification rule events that can trigger notifications
 * (e.g., member registration, class booking, payment received, etc.). It manages the loading
 * state and automatically fetches the events on mount. The hook provides both the flat array
 * of events and a grouped version organized by notification group for easier categorization.
 *
 * @returns Object containing loading state, fetch function, and notification rule events from the store
 */
export function useFetchNotificationRuleEvents() {
  const [{ isLoading }, fetchNotificationRuleEvents] = useAsync<
    typeof _fetchNotificationRuleEvents
  >({
    asyncFn: _fetchNotificationRuleEvents,
  });

  const notificationRuleEvents = useNotificationRuleStore((state) =>
    selectNotificationRuleEvents(state),
  );

  const notificationRuleEventMapByGroup = useNotificationRuleStore((state) =>
    selectNotificationRuleEventsByGroup(state),
  );

  useEffect(() => {
    fetchNotificationRuleEvents();
  }, [fetchNotificationRuleEvents]);

  return {
    isLoading,
    notificationRuleEvents,
    notificationRuleEventMapByGroup,
    fetchNotificationRuleEvents,
  };
}
