import {
  BOOKING_CREATION_NOTIFICATION,
  type BookingCreationEventRules,
  CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT,
  CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME,
  type MarketingNotification,
  PRIVATE_BOOKING_CREATION_NOTIFICATION,
  PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT,
  PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME,
  SUBSCRIPTION_NOTIFICATION_CREATION,
  SUBSCRIPTION_NOTIFICATION_END,
  SUBSCRIPTION_NOTIFICATION_FIRST_BILLING,
  type TypedMarketingNotification,
} from "@bsport/store-cdp-marketing-notification";

/**
 * Type guard to check if event rules contain meta_activity_id
 */
const hasMetaActivityId = (
  eventRules: MarketingNotification["event_rules"],
): eventRules is BookingCreationEventRules & { meta_activity_id: number } => {
  return (
    "meta_activity_id" in eventRules &&
    typeof eventRules.meta_activity_id === "number" &&
    eventRules.meta_activity_id > 0
  );
};

/**
 * Type guard to check if event rules contain establishment_id
 */
const hasEstablishmentId = (
  eventRules: MarketingNotification["event_rules"],
): eventRules is BookingCreationEventRules & { establishment_id: number } => {
  return (
    "establishment_id" in eventRules &&
    typeof eventRules.establishment_id === "number" &&
    eventRules.establishment_id > 0
  );
};

/**
 * Type guard to check if event rules contain private_service_id
 */
const hasPrivateServiceId = (
  eventRules: MarketingNotification["event_rules"],
): eventRules is BookingCreationEventRules & { private_service_id: number } => {
  return (
    "private_service_id" in eventRules &&
    typeof eventRules.private_service_id === "number" &&
    eventRules.private_service_id > 0
  );
};

/**
 * Type guard to check if event rules are booking-related
 */
const isBookingEventRules = (
  eventRules: MarketingNotification["event_rules"],
): eventRules is BookingCreationEventRules => {
  return "kind" in eventRules && typeof eventRules.kind === "number";
};

/**
 * Type guard to check if notification is a private booking creation notification
 */
const isMarketingNotificationPrivateBookingType = (
  notification: MarketingNotification,
): notification is TypedMarketingNotification<
  typeof PRIVATE_BOOKING_CREATION_NOTIFICATION
> => {
  return notification.kind === PRIVATE_BOOKING_CREATION_NOTIFICATION;
};

/**
 * Type guard to check if notification is a booking creation notification
 */
const isMarketingNotificationBookingType = (
  notification: MarketingNotification,
): notification is TypedMarketingNotification<
  typeof BOOKING_CREATION_NOTIFICATION
> => {
  return notification.kind === BOOKING_CREATION_NOTIFICATION;
};

/**
 * Type guard to check if notification is a payment pack time notification
 */
const isMarketingNotificationPaymentPackTimeType = (
  notification: MarketingNotification,
): notification is TypedMarketingNotification<
  typeof CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME
> => {
  return notification.kind === CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME;
};

/**
 * Type guard to check if notification is a payment pack credits notification
 */
const isMarketingNotificationPaymentPackCreditsType = (
  notification: MarketingNotification,
): notification is TypedMarketingNotification<
  typeof CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT
> => {
  return notification.kind === CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT;
};

/**
 * Type guard to check if notification is a private pass time notification
 */
const isMarketingNotificationPrivatePassTimeType = (
  notification: MarketingNotification,
): notification is TypedMarketingNotification<
  typeof PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME
> => {
  return notification.kind === PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME;
};

/**
 * Type guard to check if notification is a private pass credits notification
 */
const isMarketingNotificationPrivatePassCreditsType = (
  notification: MarketingNotification,
): notification is TypedMarketingNotification<
  typeof PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT
> => {
  return notification.kind === PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT;
};

/**
 * Type guard to check if notification is a subscription notification
 */
const isMarketingNotificationSubscriptionType = (
  notification: MarketingNotification,
): notification is TypedMarketingNotification<
  | typeof SUBSCRIPTION_NOTIFICATION_CREATION
  | typeof SUBSCRIPTION_NOTIFICATION_END
  | typeof SUBSCRIPTION_NOTIFICATION_FIRST_BILLING
> => {
  return (
    notification.kind === SUBSCRIPTION_NOTIFICATION_CREATION ||
    notification.kind === SUBSCRIPTION_NOTIFICATION_END ||
    notification.kind === SUBSCRIPTION_NOTIFICATION_FIRST_BILLING
  );
};

/**
 * Get function that is returning the queried key from the event_rules object of a marketing notification
 */
const getEventRuleKey = <T>({
  key,
  eventRules,
}: {
  key: string;
  eventRules: MarketingNotification["event_rules"];
}): T | undefined => {
  if (key in eventRules) {
    const value = eventRules[key as keyof typeof eventRules];
    return value as T;
  }
  return undefined;
};

export {
  getEventRuleKey,
  hasMetaActivityId,
  hasEstablishmentId,
  hasPrivateServiceId,
  isBookingEventRules,
  isMarketingNotificationPrivateBookingType,
  isMarketingNotificationBookingType,
  isMarketingNotificationPaymentPackTimeType,
  isMarketingNotificationPaymentPackCreditsType,
  isMarketingNotificationPrivatePassTimeType,
  isMarketingNotificationPrivatePassCreditsType,
  isMarketingNotificationSubscriptionType,
};
