import {
  BILLING_PLAN_STATUSES,
  type BillingPlan,
} from "@bsport/api-buyables/billing-plan";
import { isPast } from "@bsport/datetime-manipulation";

import { i18nInstance, useTranslation } from "#src/i18n";

import {
  BILLING_PLAN_FINAL_STATUS,
  type BillingPlanFinalStatus,
} from "./constants";

/**
 * Given a list of pauses, infers whether today's within a pause
 */
export function isPaused(
  pauses?: Array<{ from_date: string; until_date: string }>,
) {
  if (!pauses?.length) return false;
  return pauses.reduce(
    (acc, p) => acc || (isPast(p.from_date, false) && !isPast(p.until_date)),
    false,
  );
}

/**
 * Infered from a BillingPlan data its final status client-facing.
 * Return one of: valid, canceled, ended, paused
 */
export function getBillingPlanStatus(
  billingPlan: BillingPlan,
): BillingPlanFinalStatus {
  if (billingPlan.canceled_at) {
    return BILLING_PLAN_FINAL_STATUS.CANCELED;
  }
  if (
    billingPlan.has_ended ||
    billingPlan.status === BILLING_PLAN_STATUSES.ENDED
  ) {
    return BILLING_PLAN_FINAL_STATUS.ENDED;
  }
  if (
    isPaused(billingPlan.pauses) ||
    billingPlan.status === BILLING_PLAN_STATUSES.PAUSED
  ) {
    return BILLING_PLAN_FINAL_STATUS.PAUSED;
  }
  return BILLING_PLAN_FINAL_STATUS.VALID;
}

/**
 * Returned business translations for the different client-facing statuses.
 */
export const useBillingPlanStatusTranslations = () => {
  const { t } = useTranslation("buyables", { i18n: i18nInstance });
  return {
    valid: t("billingPlanStatus.valid"),
    canceled: t("billingPlanStatus.canceled"),
    ended: t("billingPlanStatus.ended"),
    paused: t("billingPlanStatus.paused"),
  } satisfies Record<BillingPlanFinalStatus, string>;
};
