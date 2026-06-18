import type { BillingPlanPause } from "@bsport/api-buyables/billing-plan";

import type {
  CancelBillingPlanPauseParams,
  PauseBillingPlanParams,
} from "./billing-plan-pause-types";

const toDateOnly = (value: string) => value.split("T")[0] ?? value;

const addDays = (value: string, days: number) => {
  const [year, month, day] = toDateOnly(value).split("-").map(Number);
  const date = new Date(year, month - 1, day + days);

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

export const getMockBillingPlanPause = ({
  billing_plan_id,
  days,
  from_date,
  name,
  pause_id,
}: PauseBillingPlanParams): BillingPlanPause => ({
  billing_plan: billing_plan_id,
  contract_pause: null,
  creator_staff_name: "Mock staff",
  date_created: new Date().toISOString(),
  date_ended: "",
  days,
  first_paused_planned_invoice: 0,
  from_date: toDateOnly(from_date),
  id: pause_id ?? Date.now(),
  name,
  until_date: addDays(from_date, days - 1),
  version: "mock",
});

export const mockPauseBillingPlan = (
  params: PauseBillingPlanParams,
): Promise<BillingPlanPause> =>
  Promise.resolve(getMockBillingPlanPause(params));

export const mockCancelBillingPlanPause = (
  _params: CancelBillingPlanPauseParams,
): Promise<void> => Promise.resolve();
