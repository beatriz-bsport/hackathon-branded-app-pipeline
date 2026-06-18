// TODO: replace with imports from @bsport/api-buyables/billing-plan-pause once
// that API module is re-introduced and the package is rebuilt.
export type PauseBillingPlanParams = {
  action_pack_kind?: number;
  billing_plan_id: number;
  days: number;
  from_date: string;
  name: string;
  pause_id?: number;
};

export type CancelBillingPlanPauseParams = {
  billing_plan_id: number;
  pause_id: number;
};
