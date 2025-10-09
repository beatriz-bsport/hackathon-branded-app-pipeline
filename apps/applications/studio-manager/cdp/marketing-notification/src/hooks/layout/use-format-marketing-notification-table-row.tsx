import type { MetaActivity } from "@bsport/store-booking-group-activity";
import type { EmailTemplateSummary } from "@bsport/store-cdp-email-template";
import type {
  BookingCreationEventRules,
  MarketingNotification,
} from "@bsport/store-cdp-marketing-notification";

import { useFormatNotificationTriggerName } from "#src/hooks/layout/use-format-notification-trigger-name";
import { NOTIFICATION_ADVANCED_TYPE } from "#src/utils/constants";
import {
  BIRTHDAY_NOTIFICATION,
  BOOKING_CREATION_NOTIFICATION,
  CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT,
  CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME,
  type MarketingNotificationTableRowData,
  type NotificationType,
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
  groupActivitiesById,
  canToggleNotification,
  emailTemplatesById,
}: {
  emailTemplatesById: Record<number, EmailTemplateSummary>;
  groupActivitiesById: Record<number, MetaActivity>;
  canToggleNotification: boolean;
}) => {
  const { formatNotificationTriggerName, formatNotificationTriggerTiming } =
    useFormatNotificationTriggerName();

  const getMarketingNotificationType = ({
    kind,
    eventRules,
  }: {
    kind: number;
    eventRules: MarketingNotification["event_rules"];
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
        return NOTIFICATION_ADVANCED_TYPE.location;

      if (isMarketingNotificationGroupActivityType(eventRules)) {
        const metaActivityId = eventRules?.meta_activity_id;

        if (!metaActivityId) return NOTIFICATION_ADVANCED_TYPE.unknown;

        const metaActivity = groupActivitiesById[metaActivityId];

        if (metaActivity?.is_workshop)
          return NOTIFICATION_ADVANCED_TYPE.workshop;

        return NOTIFICATION_ADVANCED_TYPE.groupActivity;
      }
    }

    return NOTIFICATION_ADVANCED_TYPE.unknown;
  };

  const formatMarketingNotificationForTable = ({
    marketingNotificationList,
  }: {
    marketingNotificationList: MarketingNotification[];
  }): MarketingNotificationTableRowData[] =>
    marketingNotificationList.map((notification) => {
      const notificationType = getMarketingNotificationType({
        kind: notification.kind,
        eventRules: notification.event_rules,
      });
      const isEmailTemplateValid =
        typeof notification.email_design === "number" &&
        notification.email_design in emailTemplatesById;
      return {
        id: notification.id,
        notificationType,
        triggerType: formatNotificationTriggerName({
          marketingNotification: notification,
          triggerType: notificationType,
        }),
        triggerDate: formatNotificationTriggerTiming({
          marketingNotification: notification,
          triggerType: notificationType,
        }),
        isEmailNotificationSet: notification.email_design !== null,
        isEmailNotificationBroken: !isEmailTemplateValid,
        isPushNotificationSet:
          notification.push_notification_title !== "" &&
          notification.push_notification_content !== "",
        isNotificationActive: notification.active,
        isAbleToUpdateNotification: canToggleNotification,
      };
    });

  return { formatMarketingNotificationForTable };
};
