import { useEffect } from "react";

import {
  fetchNotificationRuleDetailsAction,
  selectNotificationRuleDetails,
  useNotificationRuleStore,
} from "@bsport/store-cdp-notification-rule";
import { useAsync } from "@bsport/use-async";

import { useFetchNotificationRuleEvents } from "#src/hooks/api/use-fetch-notification-rule-events";
import { useFetchNotificationRuleEventSettings } from "#src/hooks/api/use-fetch-notification-rule-events-settings";
import { fetch } from "#src/utils/fetch";
import { RefinedNotificationRuleEventData } from "#src/utils/types";

const _fetchNotificationRuleEventDetails =
  fetchNotificationRuleDetailsAction.bind(null, fetch);

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

  const notificationRuleDetails = useNotificationRuleStore((state) =>
    selectNotificationRuleDetails(state),
  );

  const currentGroupNotificationEventIds =
    notificationRuleEventMapByGroup[eventGroupIdentifier]?.map(
      (event) => event.notification_event,
    ) || [];

  /**
   * Refines the notification rule event data for a specific event ID.
   * For this object, notification rule, data are scattered accross different endpoints and are really not practical to work with.
   * To limit the spreading of technical debt in the frontend we want to refine the data in a single object.
   * This way it will be easier to remove this logic and to not spread it in the future if we plan to revamp this feature.
   * @param notificationRuleEventId - The ID of the notification rule event to refine
   * @returns RefinedNotificationRuleEventData | null, an object containing the rule, details, and settings for the event, or null if not found
   */
  const refineNotificationRuleEventData = ({
    notificationRuleEventId,
  }: {
    notificationRuleEventId: number;
  }): RefinedNotificationRuleEventData | null => {
    const eventRule = notificationRuleEventMapByGroup[
      eventGroupIdentifier
    ]?.find((event) => event.notification_event === notificationRuleEventId);
    if (!eventRule) {
      return null;
    }
    const eventDetails =
      notificationRuleDetails.find(
        (detail) => detail.notification_event === notificationRuleEventId,
      ) || undefined;
    const eventSettings =
      notificationRuleSettings.settings[notificationRuleEventId] || undefined;
    return {
      rule: eventRule,
      details: eventDetails,
      settings: eventSettings,
    };
  };

  /**
   * Builds a list of refined notification rule event data for the current group.
   * This function maps over the current group notification event IDs and refines each one.
   * It also filters out any null values to ensure only valid data is returned.
   * @param notificationRuleGroupEventIds - Array of notification rule event IDs for the current group
   * @returns Array of RefinedNotificationRuleEventData objects for the current group
   */
  const buildRefinedNotificationRuleEventDataList = (
    notificationRuleGroupEventIds: number[],
  ): RefinedNotificationRuleEventData[] => {
    return notificationRuleGroupEventIds
      .map((eventId) =>
        refineNotificationRuleEventData({ notificationRuleEventId: eventId }),
      )
      .filter(Boolean) as RefinedNotificationRuleEventData[];
  };

  const notificationEventsRefinedData =
    buildRefinedNotificationRuleEventDataList(currentGroupNotificationEventIds);

  const fetchNotificationRuleEventData = () => {
    fetchNotificationRuleEventDetails();
    fetchNotificationRuleEvents();
    fetchNotificationRuleEventSettings();
  };

  useEffect(() => {
    fetchNotificationRuleEventDetails();
  }, [fetchNotificationRuleEventDetails]);

  return {
    isLoading,
    notificationEventsRefinedData:
      notificationEventsRefinedData.filter(Boolean),
    notificationRuleSettings,
    fetchNotificationRuleEventDetails,
    fetchNotificationRuleEventData,
  };
}
