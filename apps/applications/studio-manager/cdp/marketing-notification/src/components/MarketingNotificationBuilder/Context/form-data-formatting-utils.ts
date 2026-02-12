import type { MetaActivity } from "@bsport/api-book";
import type { MarketingNotification } from "@bsport/store-cdp-marketing-notification";

import {
  BOOKING_OCCURENCE_ANY_BOOKING,
  BOOKING_OCCURENCE_SPECIFIC_AMOUNT,
} from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Booking/types";
import { getMarketingSelectableNotificationType } from "#src/utils/marketingNotification";
import {
  APPOINTMENT_PASS_TYPE,
  APPOINTMENT_TYPE,
  BIRTHDAY_TYPE,
  BOOKING_TYPE,
  type NotificationType,
  PASS_TYPE,
  SELECTABLE_NOTIFICATION_TYPE_TO_REFINED_TYPE,
  SUBSCRIPTION_TYPE,
} from "#src/utils/types";
import { isBookingEventRules } from "#src/utils/typesGuards";
import { isMarketingNotificationSubscriptionType } from "#src/utils/typesGuards";

import type {
  AppointmentTriggerCondition,
  BirthdayTriggerCondition,
  BookingTriggerCondition,
  NotificationMultiStepFormState,
  SubscriptionTriggerCondition,
  TriggerConditionStepProps,
} from "./FormStepContext.context";
import {
  extractBaseFormData,
  extractSmartlistConfig,
} from "./common-data-formatting-utils";
import { createPassTriggerCondition } from "./pass-notification-data-formatter";

/**
 * Extracts timing configuration from event rules
 */
export const extractTimingConfigIntoContextForm = (eventRules: {
  days?: number;
  hours?: number;
}) => {
  const extractedTimingValue = eventRules.days || eventRules.hours || 0;
  return {
    timingValue: Math.abs(extractedTimingValue),
    timingUnit: eventRules.days && eventRules.days !== 0 ? "day" : "hour",
    timingTemporality: extractedTimingValue > 0 ? "after" : "before",
  };
};

/**
 * Factory function for creating birthday trigger conditions
 */
const createBirthdayTriggerCondition = (
  baseData: ReturnType<typeof extractBaseFormData>,
): BirthdayTriggerCondition => {
  const { eventRules } = baseData;

  const smartlistConfig = extractSmartlistConfig(eventRules);

  return { type: BIRTHDAY_TYPE, ...smartlistConfig };
};

/**
 * Factory function for creating booking trigger conditions
 */
const createBookingTriggerCondition = (
  baseData: ReturnType<typeof extractBaseFormData>,
  notificationType: string,
  triggerType: typeof BOOKING_TYPE | typeof APPOINTMENT_TYPE,
): BookingTriggerCondition | AppointmentTriggerCondition => {
  const { eventRules, itemIds } = baseData;

  if (!isBookingEventRules(eventRules)) {
    throw new Error(`Invalid event rules for ${triggerType} trigger`);
  }

  const timingConfig = extractTimingConfigIntoContextForm(eventRules);
  const smartlistConfig = extractSmartlistConfig(eventRules);

  const commonCondition = {
    notificationType,
    bookingItemId: itemIds[0],
    bookingEventKind: eventRules.kind,
    bookingOccurrence: eventRules.notify_booking_nb,
    bookingOccurrenceType:
      eventRules.notify_booking_nb === 0
        ? BOOKING_OCCURENCE_ANY_BOOKING
        : BOOKING_OCCURENCE_SPECIFIC_AMOUNT,
    ...timingConfig,
    ...smartlistConfig,
  };

  return triggerType === BOOKING_TYPE
    ? ({ type: BOOKING_TYPE, ...commonCondition } as BookingTriggerCondition)
    : ({
        type: APPOINTMENT_TYPE,
        ...commonCondition,
      } as AppointmentTriggerCondition);
};

/**
 * Factory function for creating subscription trigger conditions
 */
const createSubscriptionTriggerCondition = (
  marketingNotification: MarketingNotification,
): SubscriptionTriggerCondition => {
  if (!isMarketingNotificationSubscriptionType(marketingNotification)) {
    throw new Error("Invalid marketing notification for subscription trigger");
  }

  const eventRules = marketingNotification.event_rules;
  const hasDays = eventRules.days != null;
  const timingValue = (hasDays ? eventRules.days : eventRules.hours) ?? 0;
  const smartlistConfig = extractSmartlistConfig(eventRules);

  return {
    type: SUBSCRIPTION_TYPE,
    contractId: eventRules.contract_id,
    subscriptionEventKind: marketingNotification.kind,
    timingValue,
    timingUnit: hasDays ? "day" : "hour",
    timingTemporality: timingValue > 0 ? "after" : "before",
    ...smartlistConfig,
  };
};

/**
 * Creates complete form data structure from trigger condition
 */
const createFormDataStructure = (
  baseData: ReturnType<typeof extractBaseFormData>,
  notificationType: NotificationType,
  triggerCondition: TriggerConditionStepProps,
): NotificationMultiStepFormState => {
  return {
    triggerType: {
      type: "triggerType",
      notificationType: notificationType,
      ...baseData.triggerType,
    },
    triggerCondition,
    content: {
      type: "content",
      ...baseData.content,
    },
  };
};

/**
 * Main function to extract form data from draft marketing notification
 * Refactored for better maintainability and readability
 */
export const initializeFormDataFromDraftMarketingNotification = (
  marketingNotification: MarketingNotification,
  availableGroupActivitiesById: Record<number, MetaActivity>,
): Partial<NotificationMultiStepFormState> => {
  try {
    // Extract notification type
    const marketingNotificationType = getMarketingSelectableNotificationType({
      availableGroupActivitiesById,
      kind: marketingNotification.kind,
      eventRules: marketingNotification.event_rules,
    });

    if (!marketingNotificationType) {
      console.warn("Unable to determine marketing notification type");
      return {};
    }

    // Extract base data shared across all trigger types
    const baseData = extractBaseFormData(marketingNotification);
    const triggerConditionFormType =
      SELECTABLE_NOTIFICATION_TYPE_TO_REFINED_TYPE[marketingNotificationType];

    // Create trigger condition based on type
    let triggerCondition: TriggerConditionStepProps;

    switch (triggerConditionFormType) {
      case BIRTHDAY_TYPE:
        triggerCondition = createBirthdayTriggerCondition(baseData);
        break;

      case BOOKING_TYPE:
      case APPOINTMENT_TYPE:
        triggerCondition = createBookingTriggerCondition(
          baseData,
          marketingNotificationType,
          triggerConditionFormType,
        );
        break;

      case SUBSCRIPTION_TYPE:
        triggerCondition = createSubscriptionTriggerCondition(
          marketingNotification,
        );
        break;

      case PASS_TYPE:
      case APPOINTMENT_PASS_TYPE:
        triggerCondition = createPassTriggerCondition(
          baseData,
          triggerConditionFormType,
        );
        break;

      default:
        console.warn(
          `Unsupported trigger condition type: ${triggerConditionFormType}`,
        );
        return {};
    }

    const formData = createFormDataStructure(
      baseData,
      marketingNotificationType,
      triggerCondition,
    );

    return formData;
  } catch (error) {
    console.error(
      "Error extracting form data from draft marketing notification:",
      error,
    );
    return {};
  }
};
