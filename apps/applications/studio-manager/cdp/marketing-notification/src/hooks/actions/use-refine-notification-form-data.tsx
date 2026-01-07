import {
  BIRTHDAY_NOTIFICATION,
  BOOKING_CREATION_NOTIFICATION,
  PRIVATE_BOOKING_CREATION_NOTIFICATION,
} from "@bsport/store-cdp-marketing-notification";

import type { TriggerConditionStepProps } from "#src/components/MarketingNotificationEdition/Context/FormStepContext.context";
import type { BookingTemporality } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/types";
import { TimeUnitType } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Common/types";

const TIME_OPTION_NOT_SELECTED = null;

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
    if (triggerCondition.type === "subscription") {
      return triggerCondition.subscriptionEventKind;
    }
    return BIRTHDAY_NOTIFICATION;
  };

  const getTimingValue = ({
    timingTemporality,
    timingValue,
  }: {
    timingTemporality: BookingTemporality;
    timingValue: number;
  }) => {
    return timingTemporality === "before" ? -1 * timingValue : timingValue;
  };

  const getEventRuleDaysAndHours = ({
    timingUnit,
    timingTemporality,
    timingValue,
  }: {
    timingUnit: TimeUnitType;
    timingTemporality: BookingTemporality;
    timingValue: number;
  }) => {
    const timingValueByTemporality = getTimingValue({
      timingTemporality,
      timingValue,
    });
    return {
      days:
        timingUnit === "day"
          ? timingValueByTemporality
          : TIME_OPTION_NOT_SELECTED,
      hours:
        timingUnit === "hour"
          ? timingValueByTemporality
          : TIME_OPTION_NOT_SELECTED,
    };
  };

  const getTriggerEventRules = (
    triggerCondition: TriggerConditionStepProps,
  ) => {
    if (triggerCondition.type === "booking") {
      const eventRulesTiming = getEventRuleDaysAndHours({
        timingTemporality: triggerCondition.timingTemporality,
        timingUnit: triggerCondition.timingUnit,
        timingValue: triggerCondition.timingValue,
      });
      return {
        days: eventRulesTiming.days,
        hours: eventRulesTiming.hours,
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
    if (triggerCondition.type === "appointment") {
      const eventRulesTiming = getEventRuleDaysAndHours({
        timingTemporality: triggerCondition.timingTemporality,
        timingUnit: triggerCondition.timingUnit,
        timingValue: triggerCondition.timingValue,
      });
      return {
        days: eventRulesTiming.days,
        hours: eventRulesTiming.hours,
        private_service_id: triggerCondition.bookingItemId,
        event_based: true,
        kind: triggerCondition.bookingEventKind,
        notify_booking_nb: triggerCondition.bookingOccurrence,
        smartlist_exclude: triggerCondition.excludedSmartlists,
        smartlist_include: triggerCondition.includedSmartlists,
      };
    }
    if (triggerCondition.type === "subscription") {
      const eventRulesTiming = getEventRuleDaysAndHours({
        timingTemporality: triggerCondition.timingTemporality,
        timingUnit: triggerCondition.timingUnit,
        timingValue: triggerCondition.timingValue,
      });
      return {
        contract_id: triggerCondition.contractId,
        days: eventRulesTiming.days,
        hours: eventRulesTiming.hours,
        smartlist_exclude: triggerCondition.excludedSmartlists,
        smartlist_include: triggerCondition.includedSmartlists,
      };
    }
    return 0; // Birthday
  };

  return { getTriggerConditionKind, getTriggerEventRules };
};
