import { useEffect } from "react";

import {
  type NotificationRuleEvent,
  fetchNotificationRuleEventsAction,
  selectNotificationRuleEvents,
  selectNotificationRuleEventsByGroup,
  useNotificationRuleStore,
} from "@bsport/store-cdp-notification-rule";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseFetchNotificationRuleEventsParams = {
  onSuccess?: (events: NotificationRuleEvent[]) => void;
  onFailure?: (error: Error) => void;
};

const _fetchNotificationRuleEvents = fetchNotificationRuleEventsAction.bind(
  null,
  fetch,
);

/**
 * Hook for fetching notification rule events from the system.
 *
 * This hook retrieves all available notification rule events that can trigger notifications
 * (e.g., member registration, class booking, payment received, etc.). It manages the loading
 * state and automatically fetches the events on mount.
 *
 * @param params - Optional callbacks for handling fetch success and failure
 * @param params.onSuccess - Called with the list of notification rule events when fetching succeeds
 * @param params.onFailure - Called with an error when fetching notification rule events fails
 * @returns Object containing loading state, fetch function, and notification rule events from the store
 * @returns returns.isLoading - Whether the fetch operation is in progress
 * @returns returns.notificationRuleEvents - Array of notification rule events from the store
 * @returns returns.fetchNotificationRuleEvents - Function to manually trigger a fetch
 *
 * @example
 * ```tsx
 * const { isLoading, notificationRuleEvents, fetchNotificationRuleEvents } = useFetchNotificationRuleEvents({
 *   onSuccess: (events) => console.log('Fetched events:', events.length),
 *   onFailure: (error) => console.error('Failed to fetch events:', error)
 * });
 * ```
 */
export function useFetchNotificationRuleEvents({
  onSuccess,
  onFailure,
}: UseFetchNotificationRuleEventsParams = {}) {
  const [{ isLoading }, fetchNotificationRuleEvents] = useAsync<
    typeof _fetchNotificationRuleEvents
  >({
    asyncFn: _fetchNotificationRuleEvents,
    onSuccess: ({ value }) => onSuccess?.(value),
    onFailure: ({ error }) => onFailure?.(error),
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
