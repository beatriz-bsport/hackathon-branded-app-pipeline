import type { FieldNamesMarkedBoolean } from "@bsport/form";

import { isDirtyFieldEntry } from "#src/components/filters/shared/dirty-fields";

import type {
  ReferrerFilterDirtyPatchPayload,
  ReferrerFilterFormValue,
} from "../types";

export type ReferrerFilterDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<ReferrerFilterFormValue>>
>;

/**
 * Builds a PATCH body with dirty primary-section fields only.
 * Sub-filter fields are preserved on the server when not included.
 */
export const buildReferrerFilterDirtyPatch = (
  dirtyFields: ReferrerFilterDirtyFields,
  value: ReferrerFilterFormValue,
): ReferrerFilterDirtyPatchPayload => {
  const payload: ReferrerFilterDirtyPatchPayload = {};

  if (
    isDirtyFieldEntry(dirtyFields.comparator_referred) ||
    isDirtyFieldEntry(dirtyFields.value_referred) ||
    isDirtyFieldEntry(dirtyFields.value_second_referred)
  ) {
    payload.comparator_referred = value.comparator_referred;
    payload.value_referred = value.value_referred;
    payload.value_second_referred = value.value_second_referred;
  }

  return payload;
};
