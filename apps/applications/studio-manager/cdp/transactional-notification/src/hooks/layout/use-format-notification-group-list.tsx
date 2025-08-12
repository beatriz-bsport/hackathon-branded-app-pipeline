import type { ListItemProps } from "@bsport/kaizen-primitive-core";
import {
  type NotificationRuleEvent,
  isValidNotificationRuleEventCategory,
} from "@bsport/store-cdp-notification-rule";

import { useNotificationRuleNavigation } from "#src/hooks/actions/use-notification-rule-navigation";
import { useTranslation } from "#src/utils/i18n";

/**
 * Hook for formatting notification rule group categories into list items.
 *
 * This hook provides utilities to format notification rule group categories for display
 * in list components. It handles translation of category names and generates properly
 * formatted list items with action buttons showing notification counts.
 *
 * @param params - Configuration object for the hook
 * @param params.notificationRuleEventMapByGroup - Mapping of notification groups to their events
 * @returns Object containing formatting functions
 * @returns returns.formatNotificationRuleEventListItems - Function to format categories into list items
 */
export const useFormatNotificationGroupList = ({
  notificationRuleEventMapByGroup,
}: {
  notificationRuleEventMapByGroup: Record<string, NotificationRuleEvent[]>;
}) => {
  const { t } = useTranslation("transactionalNotification");
  const { navigateToNotificationGroupDetails } =
    useNotificationRuleNavigation();

  const getNotificationRuleGroupLabel = (event: string): string => {
    if (!isValidNotificationRuleEventCategory(event)) {
      return event;
    }
    return t(`notificationRuleEvents.categories.${event}`) || event;
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
  const formatNotificationRuleGroupListItems = (
    items: string[],
  ): ListItemProps[] => {
    return items.map((item) => {
      const eventLabel = getNotificationRuleGroupLabel(item);
      const notificationCount =
        notificationRuleEventMapByGroup[item]?.length ?? 0;
      return {
        id: item,
        title: eventLabel,
        onItemClick: () => {
          navigateToNotificationGroupDetails(item);
        },
        buttons: [
          {
            id: `goto-notification-rule-event-${item}`,
            label: String(
              // @ts-expect-error : known pluralization issue with our current setup
              t("notificationRuleEvents.list.notificationNumber", {
                count: notificationCount,
              }),
            ),
            iconRight: "arrow-right",
            intent: "flat",
            color: "default",
            size: "md",
            onClick: () => {
              navigateToNotificationGroupDetails(item);
            },
          },
        ],
      };
    });
  };

  return {
    formatNotificationRuleGroupListItems,
    getNotificationRuleGroupLabel,
  };
};
