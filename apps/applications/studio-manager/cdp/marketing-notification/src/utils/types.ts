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

export type MarketingNotificationRecipientsTableRowData = {
  id: number;
  communicationKind: number;
  dateSent: string;
  hourSent: string;
  recipientIdentity: string;
  status: number;
  isNotificationRead: boolean;
  recipientsRelationshipsCount?: number;
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

export type NotificationType =
  | "birthday"
  | "location"
  | "establishment"
  | "groupActivity"
  | "workshop"
  | "privateService"
  | "paymentPack"
  | "privatePass"
  | "subscription"
  | "unknown"
  | "unknown_groupActivity";

// We use a refined type to group some base notification types together
// For example, location, groupActivity, workshop and privateService are all booking-related notifications
// and are therefore grouped under the "booking" refined type
export type RefinedNotificationType =
  | "birthday"
  | "booking"
  | "passes"
  | "subscription"
  | "unknown";

export type TriggerTimingConfig = {
  unit: "hour" | "day" | "credit";
  duration: number;
  beforeOrAfter: "before" | "after";
};

// Booking trigger constants, the trigger kind here is not related to the
// notification kind but to the booking events event_rules.kind property
export const TRIGGER_KINDS = {
  BOOKING_APPOINTMENT_ATTENDED: 0,
  BOOKING_APPOINTMENT_CANCELLED_ON_TIME: 1,
  BOOKING_APPOINTMENT_CANCELLED_TOO_LATE: 2,
  BOOKING_ATTENDED: 3,
  BOOKING_NOT_ATTENDED: 4,
  BOOKING_CANCELLED_ON_TIME: 5,
  BOOKING_CANCELLED_TOO_LATE: 6,
} as const;

// Notification type mapping, its linked to the refined notification type and help us to associate them together
export const NOTIFICATION_TYPE_TO_REFINED_TYPE: Record<
  NotificationType,
  RefinedNotificationType
> = {
  birthday: "birthday",
  location: "booking",
  workshop: "booking",
  groupActivity: "booking",
  establishment: "booking",
  privateService: "booking",
  unknown_groupActivity: "booking",
  paymentPack: "passes",
  privatePass: "passes",
  subscription: "subscription",
  unknown: "unknown",
};

export type PassListItemData = {
  id: number;
  name: string;
  credits: number | null;
  price: string;
};
