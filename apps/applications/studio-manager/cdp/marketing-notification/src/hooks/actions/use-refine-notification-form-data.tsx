import {
  BIRTHDAY_NOTIFICATION,
  BOOKING_CREATION_NOTIFICATION,
  PRIVATE_BOOKING_CREATION_NOTIFICATION,
} from "@bsport/store-cdp-marketing-notification";

import type { TriggerConditionStepProps } from "#src/components/MarketingNotificationEdition/Context/FormStepContext.context";

const TIME_OPTION_NOT_SELECTED = 0;

export const useRefineNotificationFormData = () => {
  const getTriggerConditionKind = (
    triggerCondition: TriggerConditionStepProps,
  ) => {
    if (triggerCondition.type === "booking") {
      return BOOKING_CREATION_NOTIFICATION;
    }
    if (triggerCondition.type === "appointment") {
      return PRIVATE_BOOKING_CREATION_NOTIFICATION;
    }
    return BIRTHDAY_NOTIFICATION;
  };

  const getTriggerEventRules = (
    triggerCondition: TriggerConditionStepProps,
  ) => {
    if (triggerCondition.type === "booking") {
      const timingValue =
        triggerCondition.timingTemporality === "before"
          ? -1 * triggerCondition.timingValue
          : triggerCondition.timingValue;
      return {
        days:
          triggerCondition.timingUnit === "day"
            ? timingValue
            : TIME_OPTION_NOT_SELECTED,
        hours:
          triggerCondition.timingUnit === "hour"
            ? timingValue
            : TIME_OPTION_NOT_SELECTED,
        establishment_id:
          triggerCondition.notificationType === "location"
            ? triggerCondition.bookingItemId
            : null,
        establishment_group_id:
          triggerCondition.notificationType === "establishment"
            ? triggerCondition.bookingItemId
            : null,
        meta_activity_id:
          triggerCondition.notificationType === "workshop" ||
          triggerCondition.notificationType === "groupActivity"
            ? triggerCondition.bookingItemId
            : null,
        event_based: true,
        kind: triggerCondition.bookingEventKind,
        notify_booking_nb: triggerCondition.bookingOccurrence,
        smartlist_exclude: triggerCondition.excludedSmartlists,
        smartlist_include: triggerCondition.includedSmartlists,
      };
    }
    return 0; // Birthday
  };

  return { getTriggerConditionKind, getTriggerEventRules };
};
