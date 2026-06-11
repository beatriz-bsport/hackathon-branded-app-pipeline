import { SmartlistDateFilterType } from "@bsport/api-cdp/smartlist";

import { ownsPaymentMethodToApi } from "../constants";
import { REGISTERED_PAYMENT_METHOD_SUB_FILTERS } from "../sub-filters/registry";
import type {
  PaymentMethodFilterCreatePayload,
  PaymentMethodFilterFormValue,
} from "../types";

/**
 * Builds the `POST /payment_method/` payload from a form value.
 */
export const createPaymentMethodFilterPayload = (
  value: PaymentMethodFilterFormValue,
): PaymentMethodFilterCreatePayload => {
  const subFilterSlices = REGISTERED_PAYMENT_METHOD_SUB_FILTERS.reduce<
    Partial<PaymentMethodFilterCreatePayload>
  >(
    (accumulator, subFilterModule) => ({
      ...accumulator,
      ...subFilterModule.appendCreatePayloadSlice(value),
    }),
    {},
  );

  return {
    smartlist: value.smartlist,
    owns_payment_method: ownsPaymentMethodToApi(value.ownsPaymentMethod),
    date_filter_active: false,
    date_filter_type: SmartlistDateFilterType.DATE_BEFORE,
    date: null,
    date_second: null,
    duration: 0,
    duration_second: 0,
    payment_method_kind_filter_active: false,
    kind_value: null,
    ...subFilterSlices,
  };
};
