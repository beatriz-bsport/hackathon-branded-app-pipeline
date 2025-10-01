// Marketing notification kinds
export const BIRTHDAY_NOTIFICATION = 0 as const;
export const PRIVATE_BOOKING_CREATION_NOTIFICATION = 1 as const;
export const BOOKING_CREATION_NOTIFICATION = 2 as const;
export const CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME = 3 as const;
export const CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT = 4 as const;
export const PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME = 5 as const;
export const PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT = 6 as const;
export const SUBSCRIPTION_NOTIFICATION_CREATION = 7 as const;
export const SUBSCRIPTION_NOTIFICATION_FIRST_BILLING = 8 as const;
export const SUBSCRIPTION_NOTIFICATION_END = 9 as const;

/**
 * Union type of all marketing notification kinds
 */
export type MarketingNotificationKind =
  | typeof BIRTHDAY_NOTIFICATION
  | typeof PRIVATE_BOOKING_CREATION_NOTIFICATION
  | typeof BOOKING_CREATION_NOTIFICATION
  | typeof CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME
  | typeof CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT
  | typeof PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME
  | typeof PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT
  | typeof SUBSCRIPTION_NOTIFICATION_CREATION
  | typeof SUBSCRIPTION_NOTIFICATION_FIRST_BILLING
  | typeof SUBSCRIPTION_NOTIFICATION_END;

/**
 * Type mapping between notification kinds and their corresponding event rules
 * Based on Django JSON schemas and backend validation
 */
export interface NotificationKindToEventRulesMap {
  [BIRTHDAY_NOTIFICATION]: BaseEventRules; // Birthday notifications have minimal schema
  [PRIVATE_BOOKING_CREATION_NOTIFICATION]: PrivateBookingCreationEventRules;
  [BOOKING_CREATION_NOTIFICATION]: BookingCreationEventRules;
  [CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME]: ConsumerPaymentPackTimeEventRules;
  [CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT]: ConsumerPaymentPackCreditsEventRules;
  [PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME]: PrivateConsumerPassTimeEventRules;
  [PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT]: PrivateConsumerPassCreditsEventRules;
  [SUBSCRIPTION_NOTIFICATION_CREATION]: SubscriptionEventRules;
  [SUBSCRIPTION_NOTIFICATION_FIRST_BILLING]: SubscriptionEventRules;
  [SUBSCRIPTION_NOTIFICATION_END]: SubscriptionEventRules;
}

/**
 * Generic marketing notification type that ensures type safety between kind and event_rules
 * Matches Django MarketingNotificationSerializer output exactly
 */
export type TypedMarketingNotification<K extends MarketingNotificationKind> = {
  id: number;
  company: number; // Read-only field from serializer
  kind: K;
  event_rules: NotificationKindToEventRulesMap[K];
  is_event_based: boolean; // Auto-computed based on notification type
  email_design: number | null;
  active: boolean;
  push_notification_title: string; // Max 25 characters in backend
  push_notification_content: string; // Max 200 characters in backend
};

/**
 * Union type of all possible marketing notifications with proper type binding
 */
export type MarketingNotification =
  | TypedMarketingNotification<typeof BIRTHDAY_NOTIFICATION>
  | TypedMarketingNotification<typeof PRIVATE_BOOKING_CREATION_NOTIFICATION>
  | TypedMarketingNotification<typeof BOOKING_CREATION_NOTIFICATION>
  | TypedMarketingNotification<typeof CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME>
  | TypedMarketingNotification<typeof CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT>
  | TypedMarketingNotification<typeof PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME>
  | TypedMarketingNotification<typeof PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT>
  | TypedMarketingNotification<typeof SUBSCRIPTION_NOTIFICATION_CREATION>
  | TypedMarketingNotification<typeof SUBSCRIPTION_NOTIFICATION_FIRST_BILLING>
  | TypedMarketingNotification<typeof SUBSCRIPTION_NOTIFICATION_END>;

export type MarketingNotificationType =
  | "booking"
  | "subscription"
  | "birthday"
  | "private_service"
  | "payment_packs"
  | "private_pass";

export type BaseEventRules = {
  event_based: boolean;
  smartlist_exclude: number[];
  smartlist_include: number[];
};

export type PrivateBookingCreationEventRules = BaseEventRules & {
  private_service_id: number;
  notify_booking_nb: number;
  hours: number;
  days: number;
  kind: 0 | 1 | 2; // VALID, CANCELLED_REFUNDED, CANCELLED_NOT_REFUNDED
};

export type BookingCreationEventRules = BaseEventRules & {
  establishment_id: number | null;
  establishment_group_id: number | null;
  meta_activity_id: number | null;
  notify_booking_nb: number;
  hours: number;
  days: number;
  kind: 0 | 1 | 2 | 3 | 4 | 5 | 6; // Booking notification kinds from backend
};

export type ConsumerPaymentPackTimeEventRules = BaseEventRules & {
  name: string;
  contains_all_payment_packs: boolean;
  payment_pack_ids: number[];
  days_left: number;
  disabled_if_in_contract: boolean;
};

export type ConsumerPaymentPackCreditsEventRules = BaseEventRules & {
  name: string;
  contains_all_payment_packs: boolean;
  payment_pack_ids: number[];
  credits_left: number;
  hours: number;
  kind: 0 | 1; // COUNTDOWN_ON_BOOKING, COUNTDOWN_ON_OFFER_START
  disabled_if_in_contract: boolean;
};

export type PrivateConsumerPassTimeEventRules = BaseEventRules & {
  name: string;
  contains_all_private_passes: boolean;
  private_pass_ids: number[];
  days_left: number;
  disabled_if_in_contract: boolean;
};

export type PrivateConsumerPassCreditsEventRules = BaseEventRules & {
  name: string;
  contains_all_private_passes: boolean;
  private_pass_ids: number[];
  credits_left: number;
  hours: number;
  disabled_if_in_contract: boolean;
};

export type SubscriptionEventRules = BaseEventRules & {
  contract_id: number;
  days: number | null;
  hours: number | null;
};

/**
 * API parameters for fetching marketing notifications
 * Matches Django queryset filtering capabilities
 */
export type FetchMarketingNotificationsParams = {
  kind__in?: number[]; // Filter by notification kinds
  company?: number; // Filter by company ID
  active?: boolean; // Filter by active status
  is_event_based?: boolean; // Filter by event-based notifications
  id?: number; // Filter by specific notification ID
  email_design?: number; // Filter by email design ID
  email_design__isnull?: boolean; // Filter notifications with/without email design
};

/**
 * API request payload for creating/updating marketing notifications
 * Matches Django serializer expected input
 */
export type MarketingNotificationPayload<K extends MarketingNotificationKind> =
  {
    kind: K;
    event_rules: NotificationKindToEventRulesMap[K];
    email_design?: number | null;
    active?: boolean;
    push_notification_title?: string; // Max 25 characters
    push_notification_content?: string; // Max 200 characters
  };

/**
 * Constants for marketing notification credit kinds
 * Matches backend constants
 */
export const CONSUMER_PAYMENT_PACK_CREDIT_KINDS = {
  COUNTDOWN_ON_BOOKING: 0,
  COUNTDOWN_ON_OFFER_START: 1,
} as const;

/**
 * Constants for private booking notification kinds
 * Matches backend constants
 */
export const PRIVATE_BOOKING_NOTIFICATION_KINDS = {
  VALID: 0,
  CANCELLED_REFUNDED: 1,
  CANCELLED_NOT_REFUNDED: 2,
} as const;

/**
 * Constants for booking notification kinds
 * Matches backend constants
 */
export const BOOKING_NOTIFICATION_KINDS = {
  BOOKING_DEPRECATED: 0,
  ATTENDANCE_DEPRECATED: 1,
  CANCELLATION_DEPRECATED: 2,
  VALID_ATTENDANCE: 3,
  VALID_ABSENCE: 4,
  CANCELLED_REFUNDED: 5,
  CANCELLED_NOT_REFUNDED: 6,
} as const;
