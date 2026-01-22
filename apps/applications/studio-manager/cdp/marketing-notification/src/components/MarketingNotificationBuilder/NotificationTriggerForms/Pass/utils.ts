import type {
  PassTriggerCondition,
  TriggerConditionStepProps,
} from "#src/components/MarketingNotificationBuilder/Context/FormStepContext.context";
import { APPOINTMENT_PASS_TYPE, PASS_TYPE } from "#src/utils/types";

import {
  PASS_ACTION_CREDITS_LEFT,
  PASS_ACTION_DAYS_EXPIRED,
  PASS_ACTION_DAYS_LEFT,
  PASS_CREDITS_LEFT_BOOKING_COMPLETED,
  PASS_CREDITS_LEFT_SESSION_END,
  PASS_SUBSCRIPTION_FILTERING_IN,
  PASS_SUBSCRIPTION_FILTERING_OUT,
  type PassAction,
  type PassCreditsLeftEventKind,
  type PassSubscriptionFilteringType,
} from "./types";

export function isValidPassAction(action: string): action is PassAction {
  return (
    action === PASS_ACTION_CREDITS_LEFT ||
    action === PASS_ACTION_DAYS_LEFT ||
    action === PASS_ACTION_DAYS_EXPIRED
  );
}

export function isValidPassSubscriptionFiltering(
  filter: string,
): filter is PassSubscriptionFilteringType {
  return (
    filter === PASS_SUBSCRIPTION_FILTERING_IN ||
    filter === PASS_SUBSCRIPTION_FILTERING_OUT
  );
}

export function isValidPassCreditsLeftAction(
  eventKind: string,
): eventKind is PassCreditsLeftEventKind {
  return (
    eventKind === PASS_CREDITS_LEFT_BOOKING_COMPLETED ||
    eventKind === PASS_CREDITS_LEFT_SESSION_END
  );
}

export const getPassFormData = (
  formData?: TriggerConditionStepProps,
): PassTriggerCondition | undefined => {
  return formData?.type === PASS_TYPE ||
    formData?.type === APPOINTMENT_PASS_TYPE
    ? formData
    : undefined;
};
