import {
  BIRTHDAY_NOTIFICATION,
  BOOKING_CREATION_NOTIFICATION,
  PRIVATE_BOOKING_CREATION_NOTIFICATION,
} from "@bsport/store-cdp-marketing-notification";

import type { TriggerConditionStepProps } from "#src/components/MarketingNotificationBuilder/Context/FormStepContext.context";
import type { BookingTemporality } from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Booking/types";
import { TimeUnitType } from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Common/types";
import {
  APPOINTMENT_PASS_ACTIONS_MAP_TO_EVENT_KIND,
  CREDITS_LEFT_EVENTS_MAP_TO_EVENT_KIND,
  PASS_ACTION_CREDITS_LEFT,
  PAYMENT_PASS_ACTIONS_MAP_TO_EVENT_KIND,
} from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Pass/types";
import { PassTriggerConfigValidationFormData } from "#src/utils/schemas/types";
import {
  APPOINTMENT_PASS_TYPE,
  APPOINTMENT_TYPE,
  BOOKING_TYPE,
  ESTABLISHMENT_TYPE,
  GROUP_ACTIVITY_TYPE,
  LOCATION_TYPE,
  PASS_TYPE,
  type PassesType,
  SUBSCRIPTION_TYPE,
  WORKSHOP_TYPE,
} from "#src/utils/types";

const TIME_OPTION_NOT_SELECTED = 0;

export const useRefineNotificationFormData = () => {
  const getTriggerConditionKind = (
    triggerCondition: TriggerConditionStepProps,
  ) => {
    if (triggerCondition.type === BOOKING_TYPE) {
      return BOOKING_CREATION_NOTIFICATION;
    }
    if (triggerCondition.type === APPOINTMENT_TYPE) {
      return PRIVATE_BOOKING_CREATION_NOTIFICATION;
    }
    if (triggerCondition.type === SUBSCRIPTION_TYPE) {
      return triggerCondition.subscriptionEventKind;
    }
    if (triggerCondition.type === APPOINTMENT_PASS_TYPE) {
      return APPOINTMENT_PASS_ACTIONS_MAP_TO_EVENT_KIND[
        triggerCondition?.passEventAction
      ];
    }
    if (triggerCondition.type === PASS_TYPE) {
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
      triggerType === APPOINTMENT_PASS_TYPE
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
    if (triggerType === BOOKING_TYPE) {
      const eventRulesTiming = getEventRuleDaysAndHours({
        timingTemporality: triggerCondition.timingTemporality,
        timingUnit: triggerCondition.timingUnit,
        timingValue: triggerCondition.timingValue,
      });
      return {
        days: eventRulesTiming.days,
        hours: eventRulesTiming.hours,
        establishment_id:
          triggerCondition.notificationType === LOCATION_TYPE
            ? triggerCondition.bookingItemId
            : null,
        establishment_group_id:
          triggerCondition.notificationType === ESTABLISHMENT_TYPE
            ? triggerCondition.bookingItemId
            : null,
        meta_activity_id:
          triggerCondition.notificationType === WORKSHOP_TYPE ||
          triggerCondition.notificationType === GROUP_ACTIVITY_TYPE
            ? triggerCondition.bookingItemId
            : null,
        event_based: true,
        kind: triggerCondition.bookingEventKind,
        notify_booking_nb: triggerCondition.bookingOccurrence,
        smartlist_exclude: triggerCondition.excludedSmartlists,
        smartlist_include: triggerCondition.includedSmartlists,
      };
    }
    if (triggerType === APPOINTMENT_TYPE) {
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
    if (triggerCondition.type === SUBSCRIPTION_TYPE) {
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
    if (triggerType === APPOINTMENT_PASS_TYPE || triggerType === PASS_TYPE) {
      return getPassesEventRules({ triggerType, triggerCondition });
    }
    return {
      smartlist_exclude: triggerCondition.excludedSmartlists,
      smartlist_include: triggerCondition.includedSmartlists,
    };
  };

  return { getTriggerConditionKind, getTriggerEventRules };
};
