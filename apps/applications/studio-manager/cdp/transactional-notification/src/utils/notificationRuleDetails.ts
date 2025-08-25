import {
  NotificationRuleDetail,
  NotificationRuleEvent,
  NotificationRuleSettings,
} from "@bsport/store-cdp-notification-rule";

import type { RefinedNotificationRuleEventData } from "./types";

/**
 * Checks if push notifications are checked for a notification rule event.
 *
 * This utility function examines the details of a refined notification rule event
 * to determine if push notifications are active for that event.
 *
 * @param params - Configuration object
 * @param params.refinedNotificationRuleData - The refined notification rule event data
 * @returns True if push notifications are checked, false otherwise
 */
export const getIsPushNotificationChecked = ({
  refinedNotificationRuleData,
}: {
  refinedNotificationRuleData: RefinedNotificationRuleEventData;
}) => {
  return (
    refinedNotificationRuleData?.details?.is_notification_push_active || false
  );
};

/**
 * Checks if email notifications are checked for a notification rule event.
 *
 * This utility function examines the settings of a refined notification rule event
 * to determine if email notifications are checked. It returns true if the notification
 * is NOT disabled in the settings.
 *
 * @param params - Configuration object
 * @param params.refinedNotificationRuleData - The refined notification rule event data
 * @returns True if email notifications are checked (not disabled), false if disabled
 */
export const getIsEmailNotificationChecked = ({
  refinedNotificationRuleData,
}: {
  refinedNotificationRuleData: RefinedNotificationRuleEventData;
}) => {
  return !refinedNotificationRuleData?.settings?.disabled || false;
};

/**
 * Determines if email notifications should be disabled for a notification rule event.
 *
 * This utility function checks multiple conditions that would cause email notifications
 * to be disabled: franchise ownership, disabled checkboxes setting, or presence of
 * required tags. When any of these conditions are true, the email notification
 * functionality should typically be disabled in the user interface.
 *
 * @param params - Configuration object
 * @param params.refinedNotificationRuleData - The refined notification rule event data
 * @returns True if email notifications should be disabled, false if they can remain enabled
 */
export const getIsEmailNotificationDisabled = ({
  refinedNotificationRuleData,
}: {
  refinedNotificationRuleData: RefinedNotificationRuleEventData;
}) => {
  // Check if the notification rule is managed on the franchise level or not
  const isFranchiseOwned = getIsFranchiseOwned({
    refinedNotificationRuleData,
  });

  // Check if checkboxes should be disabled
  const shouldDisableCheckboxes =
    refinedNotificationRuleData?.settings?.disabled_checkboxes ?? false;

  // Check required tag list for the notification rule
  const requiredTagList =
    refinedNotificationRuleData?.rule?.required_tags || [];
  const hasRequiredTags = requiredTagList.length > 0;

  return isFranchiseOwned || shouldDisableCheckboxes || hasRequiredTags;
};

/**
 * Determines if push notifications should be disabled for a notification rule event.
 *
 * This utility function checks multiple conditions that would cause push notifications
 * to be disabled: missing push notification content (title or content), disabled checkboxes
 * setting, or presence of required tags. When any of these conditions are true, the push
 * notification functionality should typically be disabled in the user interface.
 *
 * @param params - Configuration object
 * @param params.refinedNotificationRuleData - The refined notification rule event data
 * @returns True if push notifications should be disabled, false if they can remain enabled
 */
export const getIsPushNotificationDisabled = ({
  refinedNotificationRuleData,
}: {
  refinedNotificationRuleData: RefinedNotificationRuleEventData;
}) => {
  // Check if push notification is set up by studio manager
  const pushNotificationTitle =
    refinedNotificationRuleData?.details?.push_notification_title || "";
  const pushNotificationContent =
    refinedNotificationRuleData?.details?.push_notification_content || "";
  const hasPushNotificationEmptyContent =
    pushNotificationTitle === "" || pushNotificationContent === "";

  // Check if checkboxes should be disabled
  const shouldDisableCheckboxes =
    refinedNotificationRuleData?.settings?.disabled_checkboxes ?? false;

  // Check required tag list for the notification rule
  const requiredTagList =
    refinedNotificationRuleData?.rule?.required_tags || [];
  const hasRequiredTags = requiredTagList.length > 0;

  return (
    hasPushNotificationEmptyContent ||
    shouldDisableCheckboxes ||
    hasRequiredTags
  );
};

export const getIsFranchiseOwned = ({
  refinedNotificationRuleData,
}: {
  refinedNotificationRuleData: RefinedNotificationRuleEventData;
}) => {
  return refinedNotificationRuleData?.details?.franchisor !== null;
};

/**
 * Merges notification rule details that share the same notification_event.
 * Priority rules:
 * 1. Items with company === null are always overridden by items with a company
 * 2. The last element in the array always takes precedence when there are multiple items with the same notification_event
 * 3. email_design and email_template fields are merged - if one entry has email_design and another has email_template, both are preserved
 *
 * @param details - Array of notification rule details from the API
 * @returns Array of merged notification rule details with duplicates resolved
 */
export const mergeNotificationRuleDetailsByEvent = (
  details: NotificationRuleDetail[],
) => {
  const mergedMap = new Map();

  details.forEach((detail) => {
    const eventId = detail.notification_event;
    const existing = mergedMap.get(eventId);

    if (!existing) {
      // First occurrence of this notification_event
      mergedMap.set(eventId, detail);
    } else {
      // Apply priority rules
      const currentHasCompany = detail.company !== null;
      const existingHasCompany = existing.company !== null;

      // Rule 1: If existing has no company and current has company, override
      // Rule 2: If both have companies or both don't have companies, last one wins
      const shouldOverride =
        (currentHasCompany && !existingHasCompany) || // Prefer items with company
        currentHasCompany === existingHasCompany; // Same priority → last wins

      if (shouldOverride) {
        // Merge email fields from existing entry before overriding
        const mergedDetail = {
          ...detail,
          // Preserve email_design from existing if current doesn't have it
          email_design: detail.email_design || existing.email_design,
          // Preserve email_template from existing if current doesn't have it
          email_template: detail.email_template || existing.email_template,
        };
        mergedMap.set(eventId, mergedDetail);
      } else {
        // Keep existing but merge email fields from current detail
        const mergedDetail = {
          ...existing,
          // Preserve email_design from current if existing doesn't have it
          email_design: existing.email_design || detail.email_design,
          // Preserve email_template from current if existing doesn't have it
          email_template: existing.email_template || detail.email_template,
        };
        mergedMap.set(eventId, mergedDetail);
      }
    }
  });
  return Array.from(mergedMap.values());
};

/**
 * Refines the notification rule event data for a specific event ID.
 * For this object, notification rule, data are scattered accross different endpoints and are really not practical to work with.
 * To limit the spreading of technical debt in the frontend we want to refine the data in a single object.
 * This way it will be easier to remove this logic and to not spread it in the future if we plan to revamp this feature.
 * @param notificationRuleEventId - The ID of the notification rule event to refine
 * @returns RefinedNotificationRuleEventData | null, an object containing the rule, details, and settings for the event, or null if not found
 */
export const refineNotificationRuleEventData = ({
  eventGroupIdentifier,
  notificationRuleEventId,
  notificationRuleEventMapByGroup,
  mergedNotificationRuleDetails,
  notificationRuleSettings,
}: {
  eventGroupIdentifier: string;
  notificationRuleEventMapByGroup: Record<string, NotificationRuleEvent[]>;
  mergedNotificationRuleDetails: NotificationRuleDetail[];
  notificationRuleEventId: number;
  notificationRuleSettings: NotificationRuleSettings;
}): RefinedNotificationRuleEventData | null => {
  const eventRule = notificationRuleEventMapByGroup[eventGroupIdentifier]?.find(
    (event) => event.notification_event === notificationRuleEventId,
  );
  if (!eventRule) {
    return null;
  }
  const eventDetails =
    mergedNotificationRuleDetails.find(
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
