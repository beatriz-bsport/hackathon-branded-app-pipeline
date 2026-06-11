import type { FieldNamesMarkedBoolean } from "@bsport/form";

import { isDirtyFieldEntry } from "#src/components/filters/shared/dirty-fields";

import { ownsPaymentMethodToApi } from "../constants";
import { REGISTERED_PAYMENT_METHOD_SUB_FILTERS } from "../sub-filters/registry";
import type { DirtyPatchPayload, PaymentMethodFilterFormValue } from "../types";

type PaymentMethodFilterDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<PaymentMethodFilterFormValue>>
>;

const KIND_FILTER_CLEARED_SLICE: Pick<
  DirtyPatchPayload,
  "payment_method_kind_filter_active" | "kind_value"
> = {
  payment_method_kind_filter_active: false,
  kind_value: null,
};

/**
 * Builds a `PATCH /payment_method/{id}/` payload from React Hook Form dirty fields.
 */
export const buildDirtyPatchPayload = (
  dirtyFields: PaymentMethodFilterDirtyFields,
  value: PaymentMethodFilterFormValue,
): DirtyPatchPayload => {
  const payload: DirtyPatchPayload = {};

  if (isDirtyFieldEntry(dirtyFields.ownsPaymentMethod)) {
    payload.owns_payment_method = ownsPaymentMethodToApi(
      value.ownsPaymentMethod,
    );
    if (!ownsPaymentMethodToApi(value.ownsPaymentMethod)) {
      payload.date_filter_active = false;
    }
  }

  for (const subFilterModule of REGISTERED_PAYMENT_METHOD_SUB_FILTERS) {
    Object.assign(
      payload,
      subFilterModule.appendDirtyPatchSlice(dirtyFields, value),
    );
  }

  if (Object.keys(payload).length === 0) {
    return payload;
  }

  return {
    ...payload,
    ...KIND_FILTER_CLEARED_SLICE,
  };
};
