import type { FieldNamesMarkedBoolean } from "react-hook-form";

import { isDirtyFieldEntry } from "#src/components/filters/shared/dirty-fields";

import type {
  LiabilityWaiverFilterDirtyPatchPayload,
  LiabilityWaiverFilterFormValue,
} from "../types";

type LiabilityWaiverFilterDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<LiabilityWaiverFilterFormValue>>
>;

/**
 * Builds a `PATCH /waiver/{id}/` payload from React Hook Form's
 * `dirtyFields` snapshot.
 *
 * @param dirtyFields - Output of `formState.dirtyFields` for the form.
 * @param value - Current form value used to read the dirty leaves from.
 */
export const buildLiabilityWaiverFilterDirtyPatch = (
  dirtyFields: LiabilityWaiverFilterDirtyFields,
  value: LiabilityWaiverFilterFormValue,
): LiabilityWaiverFilterDirtyPatchPayload => {
  const payload: LiabilityWaiverFilterDirtyPatchPayload = {};

  if (isDirtyFieldEntry(dirtyFields.value)) {
    payload.value = value.value;
  }

  return payload;
};
