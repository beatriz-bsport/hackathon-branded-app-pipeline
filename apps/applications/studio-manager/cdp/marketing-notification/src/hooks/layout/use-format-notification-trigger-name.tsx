import type { MarketingNotification } from "@bsport/store-cdp-marketing-notification";

import { useGetMarketingNotificationDependenciesData } from "#src/hooks/api/use-get-marketing-notification-dependencies-data";
import { NOTIFICATION_BASE_TYPE } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";
import {
  extractEntityId,
  findEntityName,
  useGenerateBookingTriggerType,
  useGeneratePassesTriggerType,
  useGenerateSubscriptionTriggerType,
} from "#src/utils/marketingNotificationTriggerCondition";
import {
  useGenerateBookingTriggerTiming,
  useGeneratePassesTriggerTiming,
  useGenerateSubscriptionTriggerTiming,
} from "#src/utils/notificationTriggerTiming";
import { isBookingEventRules } from "#src/utils/typeGuards";
import {
  NOTIFICATION_TYPE_TO_REFINED_TYPE,
  type NotificationType,
} from "#src/utils/types";
import {
  isMarketingNotificationBookingType,
  isMarketingNotificationPaymentPackCreditsType,
  isMarketingNotificationPaymentPackTimeType,
  isMarketingNotificationPrivateBookingType,
  isMarketingNotificationPrivatePassCreditsType,
  isMarketingNotificationPrivatePassTimeType,
  isMarketingNotificationSubscriptionType,
} from "#src/utils/typesGuards";

export const useFormatNotificationTriggerName = () => {
  const { t } = useTranslation("marketingNotificationList");
  const { getBookingTriggerTypeTranslation } = useGenerateBookingTriggerType();
  const { getPassesTriggerTypeTranslation } = useGeneratePassesTriggerType();
  const { getSubscriptionTriggerTypeTranslation } =
    useGenerateSubscriptionTriggerType();
  const { getBookingTriggerTimingTranslation } =
    useGenerateBookingTriggerTiming();
  const { getPassesTriggerTimingTranslation } =
    useGeneratePassesTriggerTiming();
  const { getSubscriptionTriggerTimingTranslation } =
    useGenerateSubscriptionTriggerTiming();

  const {
    groupActivitiesById,
    appointmentsById,
    establishmentsById,
    appointmentPassesById,
    subscriptionsById,
    passesById,
    locationsById,
  } = useGetMarketingNotificationDependenciesData();

  /**
   * Main function to format notification trigger name
   */
  const formatNotificationTriggerName = ({
    triggerType,
    marketingNotification,
  }: {
    triggerType: NotificationType;
    marketingNotification: MarketingNotification;
  }): string => {
    // Extract entity information
    console.log("1 - locationsById", locationsById);
    console.log("1 - establishmentsById", establishmentsById);
    const entityIds = extractEntityId(marketingNotification);
    const entityName = findEntityName(triggerType, entityIds, {
      groupActivitiesById,
      establishmentsById,
      appointmentsById,
      appointmentPassesById,
      subscriptionsById,
      passesById,
      locationsById,
    });

    // Get refined trigger type
    const refinedTriggerType = NOTIFICATION_TYPE_TO_REFINED_TYPE[triggerType];

    // Generate trigger type translation based on refined type
    switch (refinedTriggerType) {
      case NOTIFICATION_BASE_TYPE.birthday:
        return t("table.triggerType.birthday");

      case NOTIFICATION_BASE_TYPE.booking: {
        if (isBookingEventRules(marketingNotification.event_rules)) {
          return getBookingTriggerTypeTranslation(
            marketingNotification.event_rules,
            entityName,
          );
        }
        return "";
      }

      case NOTIFICATION_BASE_TYPE.passes:
        return getPassesTriggerTypeTranslation(
          marketingNotification,
          entityName,
        );

      case NOTIFICATION_BASE_TYPE.subscription:
        return getSubscriptionTriggerTypeTranslation(
          marketingNotification,
          entityName,
        );

      case NOTIFICATION_BASE_TYPE.unknown:
      default:
        return "";
    }
  };

  /**
   * Main function to format notification trigger timing
   */
  const formatNotificationTriggerTiming = ({
    triggerType,
    marketingNotification,
  }: {
    triggerType: NotificationType;
    marketingNotification: MarketingNotification;
  }): string => {
    // Get refined trigger type
    const refinedTriggerType = NOTIFICATION_TYPE_TO_REFINED_TYPE[triggerType];

    // Generate trigger type translation based on refined type
    switch (refinedTriggerType) {
      case NOTIFICATION_BASE_TYPE.birthday:
        return t("table.triggerTiming.birthday");

      case NOTIFICATION_BASE_TYPE.booking: {
        if (
          isMarketingNotificationBookingType(marketingNotification) ||
          isMarketingNotificationPrivateBookingType(marketingNotification)
        ) {
          return getBookingTriggerTimingTranslation(marketingNotification);
        }

        return "";
      }

      case NOTIFICATION_BASE_TYPE.passes: {
        if (
          isMarketingNotificationPaymentPackCreditsType(
            marketingNotification,
          ) ||
          isMarketingNotificationPrivatePassCreditsType(
            marketingNotification,
          ) ||
          isMarketingNotificationPrivatePassTimeType(marketingNotification) ||
          isMarketingNotificationPaymentPackTimeType(marketingNotification)
        ) {
          return getPassesTriggerTimingTranslation(marketingNotification);
        }

        return "";
      }

      case NOTIFICATION_BASE_TYPE.subscription: {
        if (isMarketingNotificationSubscriptionType(marketingNotification)) {
          return getSubscriptionTriggerTimingTranslation(marketingNotification);
        }

        return "";
      }

      case NOTIFICATION_BASE_TYPE.unknown:
      default:
        return "";
    }
  };

  return {
    formatNotificationTriggerName,
    formatNotificationTriggerTiming,
  };
};
