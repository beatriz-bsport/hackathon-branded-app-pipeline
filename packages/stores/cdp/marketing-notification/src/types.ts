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
 */
export interface NotificationKindToEventRulesMap {
  [BIRTHDAY_NOTIFICATION]: BaseEventRules; // Birthday notifications may not have specific event rules
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
 */
export type TypedMarketingNotification<K extends MarketingNotificationKind> = {
  id: number;
  company: number;
  kind: K;
  event_rules: NotificationKindToEventRulesMap[K];
  is_event_based: boolean;
  email_design: number | null;
  active: boolean;
  push_notification_title: string;
  push_notification_content: string;
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
  kind: number;
  event_based: boolean;
  smartlist_exclude: number[];
  smartlist_include: number[];
};

export type PrivateBookingCreationEventRules = BaseEventRules & {
  days: number;
  hours: number;
  notify_booking_nb: number;
  private_service_id: number;
};

export type BookingCreationEventRules = BaseEventRules & {
  hours: number;
  establishment_id: number | null;
  establishment_group_id: number | null;
  meta_activity_id: number;
  notify_booking_nb: number;
};

export type ConsumerPaymentPackTimeEventRules = BaseEventRules & {
  name: string;
  days_left: number;
  payment_pack_ids: number[];
  disabled_if_in_contract: boolean;
  contains_all_payment_packs: boolean;
};

export type ConsumerPaymentPackCreditsEventRules = BaseEventRules & {
  hours: number;
  name: string;
  credits_left: number;
  payment_pack_ids: number[];
  disabled_if_in_contract: boolean;
};

export type PrivateConsumerPassTimeEventRules = BaseEventRules & {
  days_left: number;
  private_pass_ids: number[];
  name: string;
  contains_all_private_passes: boolean;
};

export type PrivateConsumerPassCreditsEventRules = BaseEventRules & {
  hours: number;
  name: string;
  credits_left: number;
  private_pass_ids: number[];
  disabled_if_in_contract: boolean;
};

export type SubscriptionEventRules = BaseEventRules & {
  days: number | null;
  hours: number | null;
  contract_id: number;
};
