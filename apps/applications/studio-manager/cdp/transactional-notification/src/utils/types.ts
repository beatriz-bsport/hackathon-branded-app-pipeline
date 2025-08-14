import type {
  NotificationRuleDetail,
  NotificationRuleEvent,
  NotificationRuleEventSetting,
} from "@bsport/store-cdp-notification-rule";

import type { NotificationRuleAvailableUpsells } from "#src/hooks/layout/use-upsell-blocker";

export type NotificationRuleEventTableRowData = {
  openPreview: (notificationRuleEventId: number) => void;
  checkCommunicationMethodPreferences: ({
    notificationRuleEventId,
    communicationMethod,
    checked,
  }: {
    notificationRuleEventId: number;
    communicationMethod: "push_notification" | "email_notification";
    checked: boolean;
  }) => void;
  permissions: NotificationRuleAvailableUpsells;
};

export type TableRowData = {
  id: number;
  name: string;
  push_notification_checked: boolean;
  email_notification_checked: boolean;
  push_notification_disabled: boolean;
  email_notification_disabled: boolean;
  is_franchise_owned: boolean;
};

export type RefinedNotificationRuleEventData = {
  details?: NotificationRuleDetail;
  settings?: NotificationRuleEventSetting;
  rule: NotificationRuleEvent;
};
