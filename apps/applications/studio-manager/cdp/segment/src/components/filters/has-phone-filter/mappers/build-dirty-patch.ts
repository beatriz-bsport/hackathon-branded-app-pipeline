import type { FieldNamesMarkedBoolean } from "react-hook-form";

import { isDirtyFieldEntry } from "#src/components/filters/shared/dirty-fields";

import type {
  HasPhoneFilterDirtyPatchPayload,
  HasPhoneFilterFormValue,
} from "../types";

type HasPhoneFilterDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<HasPhoneFilterFormValue>>
>;

/**
 * Builds a `PATCH /has_phone/{id}/` payload from React Hook Form's
 * `dirtyFields` snapshot.
 *
 * @param dirtyFields - Output of `formState.dirtyFields` for the form.
 * @param value - Current form value used to read the dirty leaves from.
 */
export const buildHasPhoneFilterDirtyPatch = (
  dirtyFields: HasPhoneFilterDirtyFields,
  value: HasPhoneFilterFormValue,
): HasPhoneFilterDirtyPatchPayload => {
  const payload: HasPhoneFilterDirtyPatchPayload = {};

  if (isDirtyFieldEntry(dirtyFields.value)) {
    payload.value = value.value;
  }

  return payload;
};
