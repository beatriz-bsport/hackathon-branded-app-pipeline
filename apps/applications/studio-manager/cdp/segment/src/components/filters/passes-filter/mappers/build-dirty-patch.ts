import type { FieldNamesMarkedBoolean } from "react-hook-form";

import { OWNERSHIP_OPTIONS } from "../constants";
import { REGISTERED_PASS_SUB_FILTERS } from "../sub-filters/registry";
import type { DirtyPatchPayload, PassesFilterFormValue } from "../types";

type PassesFilterDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<PassesFilterFormValue>>
>;

const isDirty = (entry: unknown): boolean => {
  if (entry === undefined || entry === null || entry === false) {
    return false;
  }
  if (Array.isArray(entry)) {
    return entry.length > 0;
  }
  return true;
};

/**
 * Builds a `PATCH /payment_pack/{id}/` payload from React Hook Form's
 * `dirtyFields` snapshot.
 *
 * Base fields and every registered sub-filter module append their own dirty
 * slices. Modules are responsible for only emitting keys that actually changed
 * relative to the dirty subtree they own.
 *
 * @param dirtyFields - Output of `formState.dirtyFields` for the form.
 * @param value - Current form value used to read the dirty leaves from.
 */
export const buildDirtyPatchPayload = (
  dirtyFields: PassesFilterDirtyFields,
  value: PassesFilterFormValue,
): DirtyPatchPayload => {
  const payload: DirtyPatchPayload = {};

  if (isDirty(dirtyFields.ownership)) {
    payload.has_pack = value.ownership === OWNERSHIP_OPTIONS.own;
  }
  if (isDirty(dirtyFields.selectAllPaymentPacks)) {
    payload.select_all_payment_packs = value.selectAllPaymentPacks;
  }
  if (isDirty(dirtyFields.selectedPaymentPackIds)) {
    payload.payment_packs = value.selectedPaymentPackIds;
  }

  for (const passSubFilterModule of REGISTERED_PASS_SUB_FILTERS) {
    Object.assign(
      payload,
      passSubFilterModule.appendDirtyPatchSlice(dirtyFields, value),
    );
  }

  return payload;
};
