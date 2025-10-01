import {
  BOOKING_CREATION_NOTIFICATION,
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

const isMarketingNotificationPrivateBookingType = (
  notification: MarketingNotification,
): notification is TypedMarketingNotification<
  typeof PRIVATE_BOOKING_CREATION_NOTIFICATION
> => {
  return notification.kind === PRIVATE_BOOKING_CREATION_NOTIFICATION;
};

const isMarketingNotificationBookingType = (
  notification: MarketingNotification,
): notification is TypedMarketingNotification<
  typeof BOOKING_CREATION_NOTIFICATION
> => {
  return notification.kind === BOOKING_CREATION_NOTIFICATION;
};

const isMarketingNotificationPaymentPackTimeType = (
  notification: MarketingNotification,
): notification is TypedMarketingNotification<
  typeof CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME
> => {
  return notification.kind === CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME;
};

const isMarketingNotificationPaymentPackCreditsType = (
  notification: MarketingNotification,
): notification is TypedMarketingNotification<
  typeof CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT
> => {
  return notification.kind === CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT;
};

const isMarketingNotificationPrivatePassTimeType = (
  notification: MarketingNotification,
): notification is TypedMarketingNotification<
  typeof PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME
> => {
  return notification.kind === PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME;
};

const isMarketingNotificationPrivatePassCreditsType = (
  notification: MarketingNotification,
): notification is TypedMarketingNotification<
  typeof PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT
> => {
  return notification.kind === PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT;
};

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

export {
  isMarketingNotificationPrivateBookingType,
  isMarketingNotificationBookingType,
  isMarketingNotificationPaymentPackTimeType,
  isMarketingNotificationPaymentPackCreditsType,
  isMarketingNotificationPrivatePassTimeType,
  isMarketingNotificationPrivatePassCreditsType,
  isMarketingNotificationSubscriptionType,
};
