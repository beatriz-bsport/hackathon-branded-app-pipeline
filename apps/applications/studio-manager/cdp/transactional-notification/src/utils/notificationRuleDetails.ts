import type { RefinedNotificationRuleEventData } from "./types";

/**
 * Checks if push notifications are enabled for a notification rule event.
 *
 * This utility function examines the details of a refined notification rule event
 * to determine if push notifications are active for that event.
 *
 * @param params - Configuration object
 * @param params.refinedNotificationRuleData - The refined notification rule event data
 * @returns True if push notifications are enabled, false otherwise
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
 * Checks if email notifications are enabled for a notification rule event.
 *
 * This utility function examines the settings of a refined notification rule event
 * to determine if email notifications are enabled. It returns true if the notification
 * is NOT disabled in the settings.
 *
 * @param params - Configuration object
 * @param params.refinedNotificationRuleData - The refined notification rule event data
 * @returns True if email notifications are enabled (not disabled), false if disabled
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
