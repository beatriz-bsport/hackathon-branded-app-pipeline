import { useTranslation } from "#src/utils/i18n";
import {
  getIsEmailNotificationChecked,
  getIsEmailNotificationDisabled,
  getIsFranchiseOwned,
  getIsPushNotificationChecked,
  getIsPushNotificationDisabled,
} from "#src/utils/notificationRuleDetails";
import type { RefinedNotificationRuleEventData } from "#src/utils/types";

/**
 * Hook for formatting notification rule event categories into list items.
 *
 * This hook provides utilities to format notification rule event categories for display
 * in list components. It handles translation of category names and generates properly
 * formatted list items with action buttons showing notification counts.
 *
 * @param params - Configuration object for the hook
 * @param params.notificationRuleEventMapByGroup - Mapping of notification groups to their events
 * @returns Object containing formatting functions
 * @returns returns.formatNotificationRuleEventListItems - Function to format categories into list items
 */
export const useFormatNotificationEventTable = () => {
  const { t } = useTranslation("notificationRuleEvent");

  const getNotificationRuleEventLabel = (
    notificationEventId: number,
  ): string => {
    // @ts-expect-error: our setup TSC isn't supporting dynamic keys yet
    return t("eventType." + String(notificationEventId));
  };

  /**
   * Formats notification rule event categories into list item props.
   *
   * This function transforms an array of notification rule event categories into
   * properly formatted list items with translated titles and action buttons showing
   * the count of notifications for each category.
   *
   * @param items - Array of notification rule event category identifiers
   * @returns Array of list item props ready for rendering
   */
  const formatNotificationRuleEventTableItems = (
    items: RefinedNotificationRuleEventData[],
  ) => {
    return items.map((event) => {
      const notificationEventId = event.rule.notification_event;
      const isPushNotificationChecked = getIsPushNotificationChecked({
        refinedNotificationRuleData: event,
      });
      const isEmailNotificationChecked = getIsEmailNotificationChecked({
        refinedNotificationRuleData: event,
      });
      const isPushNotificationDisabled = getIsPushNotificationDisabled({
        refinedNotificationRuleData: event,
      });
      const isEmailNotificationDisabled = getIsEmailNotificationDisabled({
        refinedNotificationRuleData: event,
      });
      const isFranchiseOwned = getIsFranchiseOwned({
        refinedNotificationRuleData: event,
      });
      return {
        id: notificationEventId,
        name: getNotificationRuleEventLabel(notificationEventId),
        push_notification_checked: isPushNotificationChecked,
        email_notification_checked: isEmailNotificationChecked,
        push_notification_disabled: isPushNotificationDisabled,
        email_notification_disabled: isEmailNotificationDisabled,
        is_franchise_owned: isFranchiseOwned,
      };
    });
  };

  return {
    formatNotificationRuleEventTableItems,
    getNotificationRuleEventLabel,
  };
};
