export const BILLING_PLAN_FINAL_STATUS = {
  VALID: "valid",
  CANCELED: "canceled",
  ENDED: "ended",
  PAUSED: "paused",
} as const;

export type BillingPlanFinalStatus =
  (typeof BILLING_PLAN_FINAL_STATUS)[keyof typeof BILLING_PLAN_FINAL_STATUS];
