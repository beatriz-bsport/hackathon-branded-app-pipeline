export type MarketingNotificationTableRowParams = {
  openPreview: (notificationId: number) => void;
  editNotification: (notificationId: number) => void;
  deleteNotification: (notificationId: number) => void;
  toggleMarketingNotification: ({
    notificationId,
    checked,
  }: {
    notificationId: number;
    checked: boolean;
  }) => void;
  permissions: {
    isPushNotificationEnabled: boolean;
    isUserMarketingNotificationManager: boolean;
  };
};

export type MarketingNotificationTableRowData = {
  id: number;
  notificationType: string;
  triggerType: string;
  triggerDate: string;
  isEmailNotificationSet: boolean;
  isPushNotificationSet: boolean;
  isEmailNotificationBroken: boolean;
  isNotificationActive: boolean;
  isAbleToUpdateNotification: boolean;
};

export const BIRTHDAY_NOTIFICATION = 0;
export const PRIVATE_BOOKING_CREATION_NOTIFICATION = 1;
export const BOOKING_CREATION_NOTIFICATION = 2;
export const CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME = 3;
export const CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT = 4;
export const PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME = 5;
export const PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT = 6;
export const SUBSCRIPTION_NOTIFICATION_CREATION = 7;
export const SUBSCRIPTION_NOTIFICATION_FIRST_BILLING = 8;
export const SUBSCRIPTION_NOTIFICATION_END = 9;

export const MarketingNotificationTypeByEventRulesKindMap: Record<
  number,
  string
> = {
  [BIRTHDAY_NOTIFICATION]: "Birthday",
  [PRIVATE_BOOKING_CREATION_NOTIFICATION]: "Appointment Creation",
  [BOOKING_CREATION_NOTIFICATION]: "Booking Creation",
  [CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME]: "Payment Pack - Time",
  [CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT]: "Payment Pack - Credit",
  [PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME]: "Appointment Pass - Time",
  [PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT]: "Appointment Pass - Credit",
  [SUBSCRIPTION_NOTIFICATION_CREATION]: "Subscription - Creation",
  [SUBSCRIPTION_NOTIFICATION_FIRST_BILLING]: "Subscription - First Billing",
  [SUBSCRIPTION_NOTIFICATION_END]: "Subscription",
};
