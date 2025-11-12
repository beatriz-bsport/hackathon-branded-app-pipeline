import type { FC } from "react";

import {
  List,
  type ListItemChipsProps,
  type ListProps,
} from "@bsport/kaizen-primitive-core";

import { useFormatNotificationEventTable } from "#src/hooks/layout/use-format-notification-event-table";
import { useTranslation } from "#src/utils/i18n";
import {
  getIsEmailNotificationChecked,
  getIsPushNotificationChecked,
} from "#src/utils/notificationRuleDetails";
import type { RefinedNotificationRuleEventData } from "#src/utils/types";

type NotificationRuleListProps = {
  notificationEventsRefinedData: RefinedNotificationRuleEventData[];
  selectedNotificationRule: RefinedNotificationRuleEventData | null;
  isPushNotificationEnabled: boolean;
  onItemClick: (notificationEventId: number) => void;
};

export const NotificationRuleList: FC<NotificationRuleListProps> = ({
  notificationEventsRefinedData,
  selectedNotificationRule,
  isPushNotificationEnabled,
  onItemClick,
}) => {
  const { t } = useTranslation("transactionalNotification");
  const { getNotificationRuleEventLabel } = useFormatNotificationEventTable();

  const listItems: ListProps["items"] = notificationEventsRefinedData.map(
    (event) => {
      const notificationEventId = event.rule.notification_event;
      const name = getNotificationRuleEventLabel(notificationEventId);

      // Check if email notification is active
      const isEmailActive = getIsEmailNotificationChecked({
        refinedNotificationRuleData: event,
      });

      // Check if push notification is active and set
      const isPushNotificationSet =
        isPushNotificationEnabled &&
        (!!event.details?.push_notification_title ||
          !!event.details?.push_notification_content);
      const isPushActive =
        getIsPushNotificationChecked({
          refinedNotificationRuleData: event,
        }) && isPushNotificationSet;

      // Build chips tuple based on active notifications
      let chips:
        | [ListItemChipsProps]
        | [ListItemChipsProps, ListItemChipsProps]
        | undefined;

      if (isEmailActive && isPushActive) {
        chips = [
          {
            iconLeft: "mail-01",
            type: "weak",
            color: "default",
            size: "lg",
          },
          {
            iconLeft: "notification-message",
            type: "weak",
            color: "default",
            size: "lg",
          },
        ];
      } else if (isEmailActive) {
        chips = [
          {
            iconLeft: "mail-01",
            type: "weak",
            size: "lg",
            color: "default",
          },
        ];
      } else if (isPushActive) {
        chips = [
          {
            iconLeft: "notification-message",
            type: "weak",
            size: "lg",
            color: "default",
          },
        ];
      }

      // Check if this is the selected item
      const isActive =
        selectedNotificationRule?.rule.notification_event ===
        notificationEventId;

      return {
        id: `notification-rule-${notificationEventId}`,
        title: name,
        chips,
        buttons: [
          {
            id: `edit-notification-${notificationEventId}`,
            kind: "icon-button",
            icon: "edit-02",
            label: t("notificationRuleEventDetails.table.actions.edit"),
            size: "md",
            intent: "flat",
            color: "default",
            onClick: () => {
              onItemClick(notificationEventId);
            },
          },
        ],
        onClick: () => onItemClick(notificationEventId),
        isActive,
      };
    },
  );

  return (
    <List
      id="notification-rule-mobile-list"
      items={listItems}
      isCompact={false}
    />
  );
};
