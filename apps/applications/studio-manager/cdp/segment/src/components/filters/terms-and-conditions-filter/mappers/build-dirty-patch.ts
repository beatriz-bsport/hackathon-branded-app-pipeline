import type { FieldNamesMarkedBoolean } from "react-hook-form";

import { isDirtyFieldEntry } from "#src/components/filters/shared/dirty-fields";

import type {
  TermsAndConditionsFilterDirtyPatchPayload,
  TermsAndConditionsFilterFormValue,
} from "../types";

type TermsAndConditionsFilterDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<TermsAndConditionsFilterFormValue>>
>;

/**
 * Builds a `PATCH /terms_and_conditions/{id}/` payload from React Hook Form's
 * `dirtyFields` snapshot.
 *
 * @param dirtyFields - Output of `formState.dirtyFields` for the form.
 * @param value - Current form value used to read the dirty leaves from.
 */
export const buildTermsAndConditionsFilterDirtyPatch = (
  dirtyFields: TermsAndConditionsFilterDirtyFields,
  value: TermsAndConditionsFilterFormValue,
): TermsAndConditionsFilterDirtyPatchPayload => {
  const payload: TermsAndConditionsFilterDirtyPatchPayload = {};

  if (isDirtyFieldEntry(dirtyFields.value)) {
    payload.value = value.value;
  }

  return payload;
};
