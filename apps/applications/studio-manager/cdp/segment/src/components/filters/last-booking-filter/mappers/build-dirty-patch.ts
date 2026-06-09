import type { FieldNamesMarkedBoolean } from "react-hook-form";

import { isDirtyFieldEntry } from "#src/components/filters/shared/dirty-fields";

import type {
  LastBookingFilterDirtyPatchPayload,
  LastBookingFilterFormValue,
} from "../types";

type LastBookingFilterDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<LastBookingFilterFormValue>>
>;

/**
 * Builds a `PATCH /last_booking/{id}/` payload from React Hook Form's
 * `dirtyFields` snapshot.
 *
 * @param dirtyFields - Output of `formState.dirtyFields` for the form.
 * @param value - Current form value used to read the dirty leaves from.
 */
export const buildLastBookingFilterDirtyPatch = (
  dirtyFields: LastBookingFilterDirtyFields,
  value: LastBookingFilterFormValue,
): LastBookingFilterDirtyPatchPayload => {
  const payload: LastBookingFilterDirtyPatchPayload = {};

  if (isDirtyFieldEntry(dirtyFields.value) && value.value !== null) {
    payload.value = value.value;
  }

  return payload;
};
