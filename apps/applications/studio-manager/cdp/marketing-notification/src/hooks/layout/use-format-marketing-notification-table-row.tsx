import type { MetaActivity } from "@bsport/api-book";
import type { EmailTemplateSummary } from "@bsport/store-cdp-email-template";
import type { MarketingNotification } from "@bsport/store-cdp-marketing-notification";

import { useFormatNotificationTriggerName } from "#src/hooks/layout/use-format-notification-trigger-name";
import { MARKETING_NOTIFICATION_LIST_ITEM_ID } from "#src/utils/constants";
import {
  checkIfEmailTemplateIsMissing,
  getMarketingNotificationType,
} from "#src/utils/marketingNotification";
import { type MarketingNotificationTableRowData } from "#src/utils/types";

export const useFormatMarketingNotificationTableRow = ({
  groupActivitiesById,
  emailTemplatesById,
}: {
  emailTemplatesById: Record<number, EmailTemplateSummary>;
  groupActivitiesById: Record<number, MetaActivity>;
}) => {
  const {
    formatNotificationTriggerName,
    formatNotificationTriggerTiming,
    checkNotificationEntityExistence,
  } = useFormatNotificationTriggerName();

  const formatMarketingNotificationForTable = ({
    selectedMarketingNotificationId,
    marketingNotificationList,
    onRowClick,
  }: {
    selectedMarketingNotificationId: number | null;
    marketingNotificationList: MarketingNotification[];
    onRowClick: (notificationId: number) => void;
  }): MarketingNotificationTableRowData[] =>
    marketingNotificationList.map((notification) => {
      const notificationType = getMarketingNotificationType({
        kind: notification.kind,
        eventRules: notification.event_rules,
        availableGroupActivitiesById: groupActivitiesById,
      });
      const isEmailTemplateMissing = checkIfEmailTemplateIsMissing({
        marketingNotification: notification,
        emailTemplatesById,
      });
      const notificationCustomName =
        "name" in notification.event_rules &&
        typeof notification.event_rules.name === "string"
          ? notification.event_rules.name
          : undefined;
      return {
        id: MARKETING_NOTIFICATION_LIST_ITEM_ID(notification.id),
        notificationId: notification.id,
        notificationType: notificationType ?? "",
        triggerType:
          notificationCustomName ||
          formatNotificationTriggerName({
            marketingNotification: notification,
            triggerType: notificationType,
          }),
        triggerDate: formatNotificationTriggerTiming({
          marketingNotification: notification,
          triggerType: notificationType,
        }),
        isEmailNotificationSet: notification.email_design !== null,
        isEmailTemplateMissing,
        isPushNotificationSet:
          notification.push_notification_title !== "" &&
          notification.push_notification_content !== "",
        isNotificationActive: notification.active,
        onRowClick: () => onRowClick?.(notification.id),
        isActive: notification.id === selectedMarketingNotificationId,
        isNotificationEntityMissing: !checkNotificationEntityExistence({
          marketingNotification: notification,
        }),
      };
    });

  return { formatMarketingNotificationForTable };
};
