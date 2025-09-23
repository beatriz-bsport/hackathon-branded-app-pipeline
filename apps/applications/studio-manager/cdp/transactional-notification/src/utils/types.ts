import type {
  NotificationRuleDetail,
  NotificationRuleEvent,
  NotificationRuleEventSetting,
} from "@bsport/store-cdp-notification-rule";

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
  permissions: {
    isPushNotificationEnabled: boolean;
  };
};

export type TableRowData = {
  id: number;
  name: string;
  push_notification_checked: boolean;
  email_notification_checked: boolean;
  push_notification_disabled: boolean;
  email_notification_disabled: boolean;
  is_franchise_owned: boolean;
  is_push_notification_set: boolean;
};

export type RefinedNotificationRuleEventData = {
  details?: NotificationRuleDetail;
  settings?: NotificationRuleEventSetting;
  rule: NotificationRuleEvent;
};

export type PushNotificationFormData = {
  title: string;
  content: string;
};

export type ToggleEmailNotificationMethodParams = {
  checked: boolean;
  notificationEventId: number;
};

export type TogglePushNotificationMethodParams = {
  checked: boolean;
  notificationEventDetails: NotificationRuleDetail;
};
