import {
  BIRTHDAY_NOTIFICATION,
  BOOKING_CREATION_NOTIFICATION,
  PRIVATE_BOOKING_CREATION_NOTIFICATION,
} from "@bsport/store-cdp-marketing-notification";

import type { TriggerConditionStepProps } from "#src/components/MarketingNotificationEdition/Context/FormStepContext.context";
import type { BookingTemporality } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/types";
import { TimeUnitType } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Common/types";
import {
  APPOINTMENT_PASS_ACTIONS_MAP_TO_EVENT_KIND,
  CREDITS_LEFT_EVENTS_MAP_TO_EVENT_KIND,
  PASS_ACTION_CREDITS_LEFT,
  PAYMENT_PASS_ACTIONS_MAP_TO_EVENT_KIND,
} from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Pass/types";
import {
  PAYMENT_PACK_TYPE,
  PRIVATE_PASS_TYPE,
  PassTriggerConfigValidationFormData,
  PassesType,
} from "#src/utils/schemas/types";

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
    if (triggerCondition.type === "subscription") {
      return triggerCondition.subscriptionEventKind;
    }
    if (triggerCondition.type === PRIVATE_PASS_TYPE) {
      return APPOINTMENT_PASS_ACTIONS_MAP_TO_EVENT_KIND[
        triggerCondition?.passEventAction
      ];
    }
    if (triggerCondition.type === PAYMENT_PACK_TYPE) {
      return PAYMENT_PASS_ACTIONS_MAP_TO_EVENT_KIND[
        triggerCondition?.passEventAction
      ];
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

  const getPassesEventRules = ({
    triggerType,
    triggerCondition,
  }: {
    triggerType: PassesType;
    triggerCondition: PassTriggerConfigValidationFormData;
  }) => {
    const passIds = triggerCondition.passIds;
    const creditsLeft = triggerCondition.creditsLeft ?? 0;
    const daysLeft = triggerCondition.daysLeft ?? 0;
    const daysLeftRefined = triggerCondition.isPassExpirationCheck
      ? daysLeft * -1
      : daysLeft;

    const finerGrainParams =
      triggerType === PRIVATE_PASS_TYPE
        ? {
            private_pass_ids: passIds,
            contains_all_private_passes:
              triggerCondition.shouldContainAllPasses,
          }
        : {
            payment_pack_ids: passIds,
            contains_all_payment_packs: triggerCondition.shouldContainAllPasses,
          };

    const occurenceEventParams =
      triggerCondition.passEventAction === PASS_ACTION_CREDITS_LEFT
        ? {
            credits_left: creditsLeft,
            hours: triggerCondition.hours,
            kind: triggerCondition.creditsEventKind
              ? CREDITS_LEFT_EVENTS_MAP_TO_EVENT_KIND[
                  triggerCondition.creditsEventKind
                ]
              : null,
          }
        : { days_left: daysLeftRefined };
    return {
      ...occurenceEventParams,
      ...finerGrainParams,
      name: triggerCondition.name,
      disabled_if_in_contract: triggerCondition.disabledInContract,
      event_based: false,
      smartlist_exclude: triggerCondition.excludedSmartlists,
      smartlist_include: triggerCondition.includedSmartlists,
    };
  };

  const getTriggerEventRules = (
    triggerCondition: TriggerConditionStepProps,
  ) => {
    const triggerType = triggerCondition.type;
    if (triggerType === "booking") {
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
    if (triggerType === "appointment") {
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
    if (
      triggerType === PRIVATE_PASS_TYPE ||
      triggerType === PAYMENT_PACK_TYPE
    ) {
      return getPassesEventRules({ triggerType, triggerCondition });
    }
    return 0; // Birthday
  };

  return { getTriggerConditionKind, getTriggerEventRules };
};
