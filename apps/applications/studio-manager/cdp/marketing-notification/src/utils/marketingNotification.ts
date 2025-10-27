import { MetaActivity } from "@bsport/store-booking-group-activity";
import {
  BIRTHDAY_NOTIFICATION,
  BOOKING_CREATION_NOTIFICATION,
  BookingCreationEventRules,
  CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT,
  CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME,
  MarketingNotification,
  PRIVATE_BOOKING_CREATION_NOTIFICATION,
  PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT,
  PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME,
  SUBSCRIPTION_NOTIFICATION_CREATION,
  SUBSCRIPTION_NOTIFICATION_END,
  SUBSCRIPTION_NOTIFICATION_FIRST_BILLING,
} from "@bsport/store-cdp-marketing-notification";

import { NOTIFICATION_ADVANCED_TYPE } from "./constants";
import type { NotificationType } from "./types";

const isMarketingNotificationEstablishmentType = (
  eventRules: MarketingNotification["event_rules"],
): eventRules is BookingCreationEventRules => {
  return (
    "establishment_group_id" in eventRules &&
    eventRules.establishment_group_id !== null
  );
};

const isMarketingNotificationLocationType = (
  eventRules: MarketingNotification["event_rules"],
): eventRules is BookingCreationEventRules => {
  return (
    "establishment_id" in eventRules && eventRules.establishment_id !== null
  );
};

const isMarketingNotificationGroupActivityType = (
  eventRules: MarketingNotification["event_rules"],
): eventRules is BookingCreationEventRules => {
  return (
    "meta_activity_id" in eventRules && eventRules.meta_activity_id !== null
  );
};

const getMarketingNotificationType = ({
  availableGroupActivitiesById,
  kind,
  eventRules,
}: {
  kind: number;
  eventRules: MarketingNotification["event_rules"];
  availableGroupActivitiesById: Record<number, MetaActivity>;
}): NotificationType => {
  const triggerTypeMap: Record<number, string> = {
    [BIRTHDAY_NOTIFICATION]: NOTIFICATION_ADVANCED_TYPE.birthday,
    [PRIVATE_BOOKING_CREATION_NOTIFICATION]:
      NOTIFICATION_ADVANCED_TYPE.privateService,
    [CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT]:
      NOTIFICATION_ADVANCED_TYPE.paymentPack,
    [CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME]:
      NOTIFICATION_ADVANCED_TYPE.paymentPack,
    [PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT]:
      NOTIFICATION_ADVANCED_TYPE.privatePass,
    [PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME]:
      NOTIFICATION_ADVANCED_TYPE.privatePass,
    [SUBSCRIPTION_NOTIFICATION_CREATION]:
      NOTIFICATION_ADVANCED_TYPE.subscription,
    [SUBSCRIPTION_NOTIFICATION_END]: NOTIFICATION_ADVANCED_TYPE.subscription,
    [SUBSCRIPTION_NOTIFICATION_FIRST_BILLING]:
      NOTIFICATION_ADVANCED_TYPE.subscription,
  };

  if (kind in triggerTypeMap) {
    return triggerTypeMap[kind] as NotificationType;
  }

  if (kind === BOOKING_CREATION_NOTIFICATION) {
    if (isMarketingNotificationEstablishmentType(eventRules))
      return NOTIFICATION_ADVANCED_TYPE.establishment;
    if (isMarketingNotificationLocationType(eventRules))
      return NOTIFICATION_ADVANCED_TYPE.location;

    if (isMarketingNotificationGroupActivityType(eventRules)) {
      const metaActivityId = eventRules?.meta_activity_id;

      if (!metaActivityId) return NOTIFICATION_ADVANCED_TYPE.unknown;

      const metaActivity = availableGroupActivitiesById[metaActivityId];

      if (metaActivity?.is_workshop) return NOTIFICATION_ADVANCED_TYPE.workshop;

      return NOTIFICATION_ADVANCED_TYPE.groupActivity;
    }
  }

  return NOTIFICATION_ADVANCED_TYPE.unknown;
};

export { getMarketingNotificationType };
