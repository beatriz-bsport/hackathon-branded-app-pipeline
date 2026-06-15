import type { PaymentMethodFilter } from "@bsport/api-cdp/smartlist";

import { createDefaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";

import { ownsPaymentMethodFromApi } from "../constants";
import { REGISTERED_PAYMENT_METHOD_SUB_FILTERS } from "../sub-filters/registry";
import type { PaymentMethodFilterFormValue } from "../types";

/**
 * Converts a server-side `PaymentMethodFilter` payload into the UI form value.
 */
export const mapPaymentMethodFilterToFormValue = (
  filter: PaymentMethodFilter,
): PaymentMethodFilterFormValue => {
  const subFilters: PaymentMethodFilterFormValue["subFilters"] = [];
  const partialForm: Partial<PaymentMethodFilterFormValue> = {};

  for (const subFilterModule of REGISTERED_PAYMENT_METHOD_SUB_FILTERS) {
    const readResult = subFilterModule.readFromApi(filter);
    if (readResult.isActive) {
      subFilters.push(subFilterModule.id);
    }
    Object.assign(partialForm, readResult.partial);
  }

  return {
    id: filter.id,
    smartlist: filter.smartlist,
    ownsPaymentMethod: ownsPaymentMethodFromApi(filter.owns_payment_method),
    subFilters,
    expirationDate:
      partialForm.expirationDate ?? createDefaultDateFilterValue(),
  };
};
