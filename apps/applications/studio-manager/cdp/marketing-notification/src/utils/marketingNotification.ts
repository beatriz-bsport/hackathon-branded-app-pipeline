import type { MetaActivity } from "@bsport/api-book";
import {
  BIRTHDAY_NOTIFICATION,
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
} from "@bsport/store-cdp-marketing-notification";

import { NOTIFICATION_ADVANCED_TYPE } from "./constants";
import type { NotificationType } from "./types";

const isMarketingNotificationEstablishmentType = (
  eventRules: MarketingNotification["event_rules"],
): eventRules is BookingCreationEventRules =>
  "establishment_group_id" in eventRules &&
  eventRules.establishment_group_id !== null;

const isMarketingNotificationLocationType = (
  eventRules: MarketingNotification["event_rules"],
): eventRules is BookingCreationEventRules =>
  "establishment_id" in eventRules && eventRules.establishment_id !== null;

const isMarketingNotificationGroupActivityType = (
  eventRules: MarketingNotification["event_rules"],
): eventRules is BookingCreationEventRules =>
  "meta_activity_id" in eventRules && eventRules.meta_activity_id !== null;

const TRIGGER_TYPE_MAP: Record<number, string> = {
  [BIRTHDAY_NOTIFICATION]: NOTIFICATION_ADVANCED_TYPE.birthday,
  [PRIVATE_BOOKING_CREATION_NOTIFICATION]:
    NOTIFICATION_ADVANCED_TYPE.appointment,
  [CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT]: NOTIFICATION_ADVANCED_TYPE.pass,
  [CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME]: NOTIFICATION_ADVANCED_TYPE.pass,
  [PRIVATE_CONSUMER_PASS_NOTIFICATION_CREDIT]:
    NOTIFICATION_ADVANCED_TYPE.appointmentPass,
  [PRIVATE_CONSUMER_PASS_NOTIFICATION_TIME]:
    NOTIFICATION_ADVANCED_TYPE.appointmentPass,
  [SUBSCRIPTION_NOTIFICATION_CREATION]: NOTIFICATION_ADVANCED_TYPE.subscription,
  [SUBSCRIPTION_NOTIFICATION_END]: NOTIFICATION_ADVANCED_TYPE.subscription,
  [SUBSCRIPTION_NOTIFICATION_FIRST_BILLING]:
    NOTIFICATION_ADVANCED_TYPE.subscription,
};

type ResolveTypeParams = {
  kind: number;
  eventRules: MarketingNotification["event_rules"];
  availableGroupActivitiesById: Record<number, MetaActivity>;
};

const resolveBookingCreationType = (
  eventRules: MarketingNotification["event_rules"],
  availableGroupActivitiesById: Record<number, MetaActivity>,
): NotificationType | null => {
  if (isMarketingNotificationEstablishmentType(eventRules))
    return NOTIFICATION_ADVANCED_TYPE.establishment;
  if (isMarketingNotificationLocationType(eventRules))
    return NOTIFICATION_ADVANCED_TYPE.location;

  if (isMarketingNotificationGroupActivityType(eventRules)) {
    const metaActivityId = eventRules?.meta_activity_id;
    if (!metaActivityId) return null;

    const metaActivity = availableGroupActivitiesById[metaActivityId];
    return metaActivity?.is_workshop
      ? NOTIFICATION_ADVANCED_TYPE.workshop
      : NOTIFICATION_ADVANCED_TYPE.groupActivity;
  }

  return null;
};

const getMarketingNotificationType = ({
  availableGroupActivitiesById,
  kind,
  eventRules,
}: ResolveTypeParams): NotificationType | null => {
  if (kind in TRIGGER_TYPE_MAP)
    return TRIGGER_TYPE_MAP[kind] as NotificationType;

  if (kind === BOOKING_CREATION_NOTIFICATION)
    return resolveBookingCreationType(eventRules, availableGroupActivitiesById);

  return null;
};

const getMarketingSelectableNotificationType = ({
  availableGroupActivitiesById,
  kind,
  eventRules,
}: ResolveTypeParams): NotificationType | null => {
  if (kind in TRIGGER_TYPE_MAP)
    return TRIGGER_TYPE_MAP[kind] as NotificationType;

  if (kind === BOOKING_CREATION_NOTIFICATION)
    return resolveBookingCreationType(eventRules, availableGroupActivitiesById);

  return null;
};

export { getMarketingNotificationType, getMarketingSelectableNotificationType };
