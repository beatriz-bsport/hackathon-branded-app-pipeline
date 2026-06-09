import type { FieldNamesMarkedBoolean } from "@bsport/form";

import { OWNERSHIP_OPTIONS } from "#src/components/filters/passes-filter/constants";
import { REGISTERED_PASS_SUB_FILTERS } from "#src/components/filters/passes-filter/sub-filters/registry";
import { isDirtyFieldEntry } from "#src/components/filters/shared/dirty-fields";

import type {
  AppointmentPassDirtyPatchPayload,
  AppointmentPassFilterFormValue,
} from "../types";

type AppointmentPassFilterDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<AppointmentPassFilterFormValue>>
>;

/**
 * Builds a `PATCH /private_pass/{id}/` payload from React Hook Form dirty fields.
 */
export const buildAppointmentPassDirtyPatchPayload = (
  dirtyFields: AppointmentPassFilterDirtyFields,
  value: AppointmentPassFilterFormValue,
): AppointmentPassDirtyPatchPayload => {
  const payload: AppointmentPassDirtyPatchPayload = {};

  if (isDirtyFieldEntry(dirtyFields.ownership)) {
    payload.has_pack = value.ownership === OWNERSHIP_OPTIONS.own;
  }
  if (isDirtyFieldEntry(dirtyFields.selectAllPaymentPacks)) {
    payload.select_all_private_passes = value.selectAllPaymentPacks;
  }
  if (
    isDirtyFieldEntry(dirtyFields.selectedPaymentPackIds) ||
    (Array.isArray(dirtyFields.selectedPaymentPackIds) &&
      dirtyFields.selectedPaymentPackIds.length === 0)
  ) {
    payload.private_passes = value.selectedPaymentPackIds;
  }

  for (const passSubFilterModule of REGISTERED_PASS_SUB_FILTERS) {
    Object.assign(
      payload,
      passSubFilterModule.appendDirtyPatchSlice(dirtyFields, value),
    );
  }

  return payload;
};
