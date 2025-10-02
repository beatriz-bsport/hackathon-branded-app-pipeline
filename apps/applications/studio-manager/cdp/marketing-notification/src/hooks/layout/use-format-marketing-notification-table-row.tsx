import type { MetaActivity } from "@bsport/store-booking-group-activity";
import type {
  BookingCreationEventRules,
  MarketingNotification,
} from "@bsport/store-cdp-marketing-notification";

import {
  BIRTHDAY_NOTIFICATION,
  BOOKING_CREATION_NOTIFICATION,
  CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT,
  CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME,
  type MarketingNotificationTableRowData,
  PRIVATE_BOOKING_CREATION_NOTIFICATION,
  PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT,
  PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME,
  SUBSCRIPTION_NOTIFICATION_CREATION,
  SUBSCRIPTION_NOTIFICATION_END,
  SUBSCRIPTION_NOTIFICATION_FIRST_BILLING,
} from "#src/utils/types";

const isMarketingNotificationEstablishmentType = (
  eventRules: MarketingNotification["event_rules"],
): eventRules is BookingCreationEventRules => {
  return (
    ("establishment_id" in eventRules &&
      eventRules.establishment_id !== null) ||
    ("establishment_group_id" in eventRules &&
      eventRules.establishment_group_id !== null)
  );
};

const isMarketingNotificationGroupActivityType = (
  eventRules: MarketingNotification["event_rules"],
): eventRules is BookingCreationEventRules => {
  return (
    "meta_activity_id" in eventRules && eventRules.meta_activity_id !== null
  );
};

export const useFormatMarketingNotificationTableRow = ({
  groupActivityMapById,
}: {
  groupActivityMapById: Record<number, MetaActivity>;
}) => {
  const getMarketingNotificationType = ({
    kind,
    eventRules,
  }: {
    kind: number;
    eventRules: MarketingNotification["event_rules"];
  }) => {
    if (kind === BIRTHDAY_NOTIFICATION) return "birthday";
    if (kind === BOOKING_CREATION_NOTIFICATION) {
      if (isMarketingNotificationEstablishmentType(eventRules))
        return "location";
      if (isMarketingNotificationGroupActivityType(eventRules)) {
        const metaActivityId = eventRules?.meta_activity_id;
        if (!metaActivityId) return "unkown_groupActivity";
        const metaActivity = groupActivityMapById[metaActivityId];
        if (metaActivity?.is_workshop) return "workshop";
        return "groupActivity";
      }
    }
    if (kind === PRIVATE_BOOKING_CREATION_NOTIFICATION) return "privateService";
    if (
      kind === CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT ||
      kind === CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME
    )
      return "paymentPack";
    if (
      kind === PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT ||
      kind === PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME
    )
      return "privatePass";
    if (
      kind === SUBSCRIPTION_NOTIFICATION_CREATION ||
      kind === SUBSCRIPTION_NOTIFICATION_END ||
      kind === SUBSCRIPTION_NOTIFICATION_FIRST_BILLING
    )
      return "subscription";
    return "unknown";
  };

  const formatMarketingNotificationForTable = ({
    marketingNotificationList,
  }: {
    marketingNotificationList: MarketingNotification[];
  }): MarketingNotificationTableRowData[] =>
    marketingNotificationList.map((notification) => ({
      id: notification.id,
      notificationType: getMarketingNotificationType({
        kind: notification.kind,
        eventRules: notification.event_rules,
      }),
      triggerType: "Trigger type", // To be implemented in future PR
      triggerDate: "Trigger date", // To be implemented in future PR
      isEmailNotificationSet: notification.email_design !== null,
      isEmailNotificationBroken: notification.id % 5 === 0, // Temporary logic to simulate broken email notification
      isPushNotificationSet:
        notification.push_notification_title !== "" &&
        notification.push_notification_content !== "",
      isNotificationActive: notification.active,
      isAbleToUpdateNotification: notification.id % 3 === 0, // Temporary logic to simulate permission
    }));

  return { formatMarketingNotificationForTable };
};
