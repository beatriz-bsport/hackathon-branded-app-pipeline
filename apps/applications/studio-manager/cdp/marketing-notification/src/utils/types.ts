export const BOOKING_TYPE = "booking";
export const APPOINTMENT_TYPE = "appointment";
export const SUBSCRIPTION_TYPE = "subscription";
export const BIRTHDAY_TYPE = "birthday";

export const GROUP_ACTIVITY_TYPE = "groupActivity";
export const WORKSHOP_TYPE = "workshop";
export const LOCATION_TYPE = "location";
export const ESTABLISHMENT_TYPE = "establishment";

export const PASSES_UNION_TYPE = "passes";

export const PASS_TYPE = "pass";
export const APPOINTMENT_PASS_TYPE = "appointmentPass";

export type PassesType = typeof PASS_TYPE | typeof APPOINTMENT_PASS_TYPE;

export const notificationTypeFilters = [
  GROUP_ACTIVITY_TYPE,
  WORKSHOP_TYPE,
  LOCATION_TYPE,
  ESTABLISHMENT_TYPE,
  SUBSCRIPTION_TYPE,
  APPOINTMENT_PASS_TYPE,
  PASS_TYPE,
  APPOINTMENT_TYPE,
  BIRTHDAY_TYPE,
];

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
  onRowClick?: () => void;
  isActive?: boolean;
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

export type NotificationType =
  | typeof BIRTHDAY_TYPE
  | typeof LOCATION_TYPE
  | typeof ESTABLISHMENT_TYPE
  | typeof GROUP_ACTIVITY_TYPE
  | typeof WORKSHOP_TYPE
  | typeof APPOINTMENT_TYPE
  | typeof PASS_TYPE
  | typeof APPOINTMENT_PASS_TYPE
  | typeof SUBSCRIPTION_TYPE;

// We use a refined type to group some base notification types together
// For example, location, groupActivity, workshop and privateService are all booking-related notifications
// and are therefore grouped under the "booking" refined type
export type RefinedNotificationType =
  | typeof BIRTHDAY_TYPE
  | typeof BOOKING_TYPE
  | typeof PASSES_UNION_TYPE
  | typeof SUBSCRIPTION_TYPE;

export type TriggerTimingConfig = {
  unit: "hour" | "day" | "credit" | "immediate";
  duration: number;
  beforeOrAfter: "before" | "after" | "immediate";
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
  birthday: BIRTHDAY_TYPE,
  location: BOOKING_TYPE,
  workshop: BOOKING_TYPE,
  groupActivity: BOOKING_TYPE,
  establishment: BOOKING_TYPE,
  appointment: BOOKING_TYPE,
  pass: PASSES_UNION_TYPE,
  appointmentPass: PASSES_UNION_TYPE,
  subscription: SUBSCRIPTION_TYPE,
};

export type PassListItemData = {
  id: number;
  name: string;
  credits: number | null;
  price: string;
};

export type TriggerTypeSelectorConfig = {
  type: NotificationType;
  translationKey: string;
  mode?: "groupActivity" | "workshop" | "all";
};

export type NotificationFormType =
  | typeof BIRTHDAY_TYPE
  | typeof BOOKING_TYPE
  | typeof PASS_TYPE
  | typeof APPOINTMENT_PASS_TYPE
  | typeof SUBSCRIPTION_TYPE
  | typeof APPOINTMENT_TYPE;

// Notification type mapping, its linked to the refined notification type and help us to associate them together
export const SELECTABLE_NOTIFICATION_TYPE_TO_REFINED_TYPE: Record<
  NotificationType,
  NotificationFormType
> = {
  birthday: BIRTHDAY_TYPE,
  location: BOOKING_TYPE,
  workshop: BOOKING_TYPE,
  groupActivity: BOOKING_TYPE,
  establishment: BOOKING_TYPE,
  appointment: APPOINTMENT_TYPE,
  pass: PASS_TYPE,
  appointmentPass: APPOINTMENT_PASS_TYPE,
  subscription: SUBSCRIPTION_TYPE,
};
