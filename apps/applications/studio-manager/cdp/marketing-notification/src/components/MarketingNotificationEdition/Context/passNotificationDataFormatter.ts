import { MarketingNotification } from "@bsport/store-cdp-marketing-notification";

import { getEventRuleKey } from "#src/utils/typeGuards";

import {
  CREDITS_LEFT_EVENT_KIND_MAP_TO_EVENT_VALUE,
  PASS_ACTION_CREDITS_LEFT,
  PASS_ACTION_DAYS_EXPIRED,
  PASS_ACTION_DAYS_LEFT,
} from "../NotificationTriggerForms/Pass/types";
import { PassTriggerCondition } from "./FormStepContext.context";
import {
  extractBaseFormData,
  extractSmartlistConfig,
} from "./commonDataFormattingUtils";

/**
 * Determines the pass event action based on days left value
 *
 * Business rules:
 * - If daysLeft is undefined → credits-based action
 * - If daysLeft > 0 → days remaining action
 * - If daysLeft <= 0 → days expired action
 */
const determinePassEventAction = (
  daysLeft: number | undefined,
):
  | typeof PASS_ACTION_CREDITS_LEFT
  | typeof PASS_ACTION_DAYS_LEFT
  | typeof PASS_ACTION_DAYS_EXPIRED => {
  const isCreditsBased = daysLeft === undefined;
  const isDaysRemaining = daysLeft !== undefined && daysLeft > 0;

  if (isCreditsBased) {
    return PASS_ACTION_CREDITS_LEFT;
  }

  if (isDaysRemaining) {
    return PASS_ACTION_DAYS_LEFT;
  }

  return PASS_ACTION_DAYS_EXPIRED;
};

/**
 * Extracts pass IDs from event rules based on pass type
 */
const extractPassIds = (
  eventRules: MarketingNotification["event_rules"],
): number[] => {
  if ("private_pass_ids" in eventRules) {
    return eventRules.private_pass_ids;
  }

  if ("payment_pack_ids" in eventRules) {
    return eventRules.payment_pack_ids;
  }

  return [];
};

/**
 * Extracts pass-specific fields from event rules
 */
const extractPassFields = (
  eventRules: MarketingNotification["event_rules"],
) => {
  const creditsEventKindRaw = getEventRuleKey<number>({
    key: "kind",
    eventRules,
  });
  return {
    name:
      getEventRuleKey<string>({
        key: "name",
        eventRules,
      }) || "",
    creditsLeft: getEventRuleKey<number>({
      key: "credits_left",
      eventRules,
    }),
    hours: getEventRuleKey<number>({
      key: "hours",
      eventRules,
    }),
    creditsEventKind: creditsEventKindRaw
      ? CREDITS_LEFT_EVENT_KIND_MAP_TO_EVENT_VALUE[creditsEventKindRaw]
      : undefined,
    disabledInContract:
      getEventRuleKey<boolean>({
        key: "disabled_if_in_contract",
        eventRules,
      }) || false,
    passIds: extractPassIds(eventRules),
  };
};

/**
 * Factory function for creating pass trigger conditions
 */
export const createPassTriggerCondition = (
  baseData: ReturnType<typeof extractBaseFormData>,
  triggerConditionFormType: "paymentPack" | "privatePass",
): PassTriggerCondition => {
  const { eventRules, shouldContainAllPasses } = baseData;
  const smartlistConfig = extractSmartlistConfig(eventRules);
  const passFields = extractPassFields(eventRules);

  const daysLeft = getEventRuleKey<number>({
    key: "days_left",
    eventRules,
  });
  const normalizedDaysLeft = daysLeft != null ? Math.abs(daysLeft) : undefined;

  return {
    type: triggerConditionFormType,
    passesType: triggerConditionFormType,
    passEventAction: determinePassEventAction(daysLeft),
    daysLeft: normalizedDaysLeft,
    isPassExpirationCheck: (daysLeft ?? 0) > 0,
    shouldContainAllPasses,
    ...passFields,
    ...smartlistConfig,
  };
};
