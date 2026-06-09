import type { FieldNamesMarkedBoolean } from "@bsport/form";

import { isDirtyFieldEntry } from "#src/components/filters/shared/dirty-fields";

import { mapNoteTypeToApi } from "../constants";
import { REGISTERED_INTERNAL_NOTES_SUB_FILTERS } from "../sub-filters/registry";
import type {
  InternalNotesFilterDirtyPatchPayload,
  InternalNotesFilterFormValue,
} from "../types";

type InternalNotesFilterDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<InternalNotesFilterFormValue>>
>;

/**
 * Builds a `PATCH /notes/{id}/` payload from React Hook Form dirty fields.
 */
export const buildInternalNotesFilterDirtyPatch = (
  dirtyFields: InternalNotesFilterDirtyFields,
  value: InternalNotesFilterFormValue,
): InternalNotesFilterDirtyPatchPayload => {
  const payload: InternalNotesFilterDirtyPatchPayload = {};

  if (isDirtyFieldEntry(dirtyFields.noteType)) {
    payload.note_condition = mapNoteTypeToApi(value.noteType);
  }

  for (const subFilterModule of REGISTERED_INTERNAL_NOTES_SUB_FILTERS) {
    Object.assign(
      payload,
      subFilterModule.appendDirtyPatchSlice(dirtyFields, value),
    );
  }

  return payload;
};
