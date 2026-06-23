// TODO: replace with imports from @bsport/api-buyables/billing-plan-cancel once
// that API module is introduced and the package is rebuilt.
export type CancelBillingPlanParams = {
  billing_plan_id: number;
  // null = cancel at the end of the current period (no chosen upcoming invoice).
  from_invoice_id: number | null;
  reason: string;
};
