import { mutationOptions } from "@tanstack/react-query";

import { type Fetch } from "@bsport/store-base";

import type { BillingPlan, SetBillingPlanPaymentMethodParams } from "./types";

export const setBillingPlanPaymentMethodAPI = async (
  _fetch: Fetch<BillingPlan>,
  _params: SetBillingPlanPaymentMethodParams,
): Promise<BillingPlan> => {
  // TODO: replace this stub once the backend exposes a dedicated endpoint.
  // Legacy shape for reference:
  // POST /subscription/billing-plan/{id}/switch_payment_provider/
  // body: { payment_method_identifier, source, payment_method_id }
  throw new Error(
    "Setting a billing plan payment method is blocked until the backend endpoint is available.",
  );
};

export const setBillingPlanPaymentMethodMutationOptions = (
  fetch: Fetch<BillingPlan>,
) =>
  mutationOptions({
    mutationFn: (params: SetBillingPlanPaymentMethodParams) =>
      setBillingPlanPaymentMethodAPI(fetch, params),
  });
