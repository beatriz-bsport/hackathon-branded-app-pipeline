import type { FieldNamesMarkedBoolean } from "react-hook-form";

import { isDirtyFieldEntry } from "#src/components/filters/shared/dirty-fields";

import type {
  HasPasswordFilterDirtyPatchPayload,
  HasPasswordFilterFormValue,
} from "../types";

type HasPasswordFilterDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<HasPasswordFilterFormValue>>
>;

/**
 * Builds a `PATCH /has_password/{id}/` payload from React Hook Form's
 * `dirtyFields` snapshot.
 *
 * @param dirtyFields - Output of `formState.dirtyFields` for the form.
 * @param value - Current form value used to read the dirty leaves from.
 */
export const buildHasPasswordFilterDirtyPatch = (
  dirtyFields: HasPasswordFilterDirtyFields,
  value: HasPasswordFilterFormValue,
): HasPasswordFilterDirtyPatchPayload => {
  const payload: HasPasswordFilterDirtyPatchPayload = {};

  if (isDirtyFieldEntry(dirtyFields.value)) {
    payload.value = value.value;
  }

  return payload;
};
