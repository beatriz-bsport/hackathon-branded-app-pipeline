import type { FieldNamesMarkedBoolean } from "react-hook-form";

import { isDirtyFieldEntry } from "#src/components/filters/shared/dirty-fields";

import type {
  GenderFilterDirtyPatchPayload,
  GenderFilterFormValue,
} from "../types";

type GenderFilterDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<GenderFilterFormValue>>
>;

/**
 * Builds a `PATCH /gender_filter/{id}/` payload from React Hook Form's
 * `dirtyFields` snapshot.
 *
 * @param dirtyFields - Output of `formState.dirtyFields` for the form.
 * @param value - Current form value used to read the dirty leaves from.
 */
export const buildDirtyPatchPayload = (
  dirtyFields: GenderFilterDirtyFields,
  value: GenderFilterFormValue,
): GenderFilterDirtyPatchPayload => {
  const payload: GenderFilterDirtyPatchPayload = {};

  if (isDirtyFieldEntry(dirtyFields.value)) {
    payload.value = value.value;
  }

  return payload;
};
