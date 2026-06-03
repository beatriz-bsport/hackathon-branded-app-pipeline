import type { FieldNamesMarkedBoolean } from "@bsport/form";

import { isDirtyFieldEntry } from "#src/components/filters/shared/dirty-fields";

import { firstPurchaseStatusToApi } from "../constants";
import { REGISTERED_FIRST_PURCHASE_SUB_FILTERS } from "../sub-filters/registry";
import type { DirtyPatchPayload, FirstPurchaseFilterFormValue } from "../types";

type FirstPurchaseFilterDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<FirstPurchaseFilterFormValue>>
>;

/**
 * Builds a `PATCH /first_purchase/{id}/` payload from React Hook Form dirty fields.
 */
export const buildDirtyPatchPayload = (
  dirtyFields: FirstPurchaseFilterDirtyFields,
  value: FirstPurchaseFilterFormValue,
): DirtyPatchPayload => {
  const payload: DirtyPatchPayload = {};

  if (isDirtyFieldEntry(dirtyFields.firstPurchaseStatus)) {
    payload.first_payment_is_done = firstPurchaseStatusToApi(
      value.firstPurchaseStatus,
    );
  }

  for (const subFilterModule of REGISTERED_FIRST_PURCHASE_SUB_FILTERS) {
    Object.assign(
      payload,
      subFilterModule.appendDirtyPatchSlice(dirtyFields, value),
    );
  }

  return payload;
};
