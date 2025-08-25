import { useEffect } from "react";

import {
  fetchNotificationRuleDetailsAction,
  fetchNotificationRuleGenericDetailsAction,
  selectNotificationRuleDetails,
  useNotificationRuleStore,
} from "@bsport/store-cdp-notification-rule";
import { useAsync } from "@bsport/use-async";

import { useFetchNotificationRuleEvents } from "#src/hooks/api/use-fetch-notification-rule-events";
import { useFetchNotificationRuleEventSettings } from "#src/hooks/api/use-fetch-notification-rule-events-settings";
import { fetch } from "#src/utils/fetch";
import {
  mergeNotificationRuleDetailsByEvent,
  refineNotificationRuleEventData,
} from "#src/utils/notificationRuleDetails";
import type { RefinedNotificationRuleEventData } from "#src/utils/types";

const _fetchNotificationRuleEventDetails =
  fetchNotificationRuleDetailsAction.bind(null, fetch);

const _fetchGenericNotificationRuleEventDetails =
  fetchNotificationRuleGenericDetailsAction.bind(null, fetch);

/**
 * Hook for fetching and refining notification rule event details for a specific group.
 *
 * This hook retrieves detailed information about notification rule events within a specific
 * notification group (e.g., 'member-lifecycle', 'class-booking', 'payment'). It combines data
 * from multiple sources (events, details, and settings) to provide a unified, refined data
 * structure that's easier to work with in components. The hook automatically fetches all
 * required data and provides refined objects for each event in the group.
 *
 * @param params - Configuration object for the hook
 * @param params.eventGroupIdentifier - The identifier of the notification group to fetch details for
 * @returns Object containing loading state, refined data, and fetch function
 */
export function useFetchNotificationRuleEventGroupDetails({
  eventGroupIdentifier,
}: {
  eventGroupIdentifier: string;
}) {
  const { notificationRuleEventMapByGroup, fetchNotificationRuleEvents } =
    useFetchNotificationRuleEvents();
  const { notificationRuleSettings, fetchNotificationRuleEventSettings } =
    useFetchNotificationRuleEventSettings();

  const [{ isLoading }, fetchNotificationRuleEventDetails] = useAsync<
    typeof _fetchNotificationRuleEventDetails
  >({
    asyncFn: _fetchNotificationRuleEventDetails,
  });

  const [
    { isLoading: isLoadingGenericData },
    fetchNotificationRuleGenericEventDetails,
  ] = useAsync<typeof _fetchGenericNotificationRuleEventDetails>({
    asyncFn: _fetchGenericNotificationRuleEventDetails,
  });

  const notificationRuleDetails = useNotificationRuleStore((state) =>
    selectNotificationRuleDetails(state),
  );

  // Apply merging logic to the notification rule details
  const mergedNotificationRuleDetails = mergeNotificationRuleDetailsByEvent(
    notificationRuleDetails,
  );

  const currentGroupNotificationEventIds =
    notificationRuleEventMapByGroup[eventGroupIdentifier]?.map(
      (event) => event.notification_event,
    ) || [];

  const notificationEventsRefinedData = currentGroupNotificationEventIds
    .map((eventId) =>
      refineNotificationRuleEventData({
        notificationRuleEventId: eventId,
        eventGroupIdentifier,
        notificationRuleEventMapByGroup,
        mergedNotificationRuleDetails,
        notificationRuleSettings,
      }),
    )
    .filter(Boolean) as RefinedNotificationRuleEventData[];

  const fetchNotificationRuleEventData = () => {
    Promise.allSettled([
      fetchNotificationRuleEventDetails(),
      fetchNotificationRuleGenericEventDetails(),
      fetchNotificationRuleEvents(),
      fetchNotificationRuleEventSettings(),
    ]);
  };

  useEffect(() => {
    Promise.allSettled([
      fetchNotificationRuleEventDetails(),
      fetchNotificationRuleGenericEventDetails(),
    ]);
  }, [
    fetchNotificationRuleEventDetails,
    fetchNotificationRuleGenericEventDetails,
  ]);

  return {
    isLoading: isLoading || isLoadingGenericData,
    notificationEventsRefinedData:
      notificationEventsRefinedData.filter(Boolean),
    notificationRuleSettings,
    fetchNotificationRuleEventDetails,
    fetchNotificationRuleEventData,
  };
}
