import { useMemo } from "react";

import type {
  NotificationRuleDetail,
  NotificationRuleEvent,
  NotificationRuleSettings,
} from "@bsport/store-cdp-notification-rule";

import {
  mergeNotificationRuleDetailsByEvent,
  refineNotificationRuleEventData,
} from "#src/utils/notificationRuleDetails";
import type { RefinedNotificationRuleEventData } from "#src/utils/types";

export const useRefineNotificationEventData = ({
  notificationRuleDetails,
  eventGroupIdentifier,
  notificationRuleEventMapByGroup,
  notificationRuleSettings,
}: {
  notificationRuleDetails: NotificationRuleDetail[];
  notificationRuleEventMapByGroup: Record<string, NotificationRuleEvent[]>;
  eventGroupIdentifier: string;
  notificationRuleSettings: NotificationRuleSettings;
}) => {
  // Apply merging logic to the notification rule details
  const mergedNotificationRuleDetails = mergeNotificationRuleDetailsByEvent(
    notificationRuleDetails,
  );

  const currentGroupNotificationEventIds = useMemo(
    () =>
      notificationRuleEventMapByGroup[eventGroupIdentifier]?.map(
        (event) => event.notification_event,
      ) || [],
    [notificationRuleEventMapByGroup, eventGroupIdentifier],
  );

  const notificationEventsRefinedData = useMemo(
    () =>
      currentGroupNotificationEventIds
        .map((eventId) =>
          refineNotificationRuleEventData({
            notificationRuleEventId: eventId,
            eventGroupIdentifier,
            notificationRuleEventMapByGroup,
            mergedNotificationRuleDetails,
            notificationRuleSettings,
          }),
        )
        .filter(Boolean) as RefinedNotificationRuleEventData[],
    [
      eventGroupIdentifier,
      mergedNotificationRuleDetails,
      notificationRuleEventMapByGroup,
      notificationRuleSettings,
      currentGroupNotificationEventIds,
    ],
  );

  return {
    notificationEventsRefinedData: [...notificationEventsRefinedData],
  };
};
