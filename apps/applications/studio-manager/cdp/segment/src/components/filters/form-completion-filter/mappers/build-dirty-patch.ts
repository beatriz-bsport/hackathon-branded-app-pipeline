import type { FieldNamesMarkedBoolean } from "@bsport/form";

import { isDirtyFieldEntry } from "#src/components/filters/shared/dirty-fields";

import type {
  FormCompletionFilterDirtyPatchPayload,
  FormCompletionFilterFormValue,
} from "../types";

export type FormCompletionFilterDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<FormCompletionFilterFormValue>>
>;

/**
 * Builds a PATCH body with dirty primary fields only.
 * Sends the full `custom_forms` array when the selection changes.
 */
export const buildFormCompletionFilterDirtyPatch = (
  dirtyFields: FormCompletionFilterDirtyFields,
  value: FormCompletionFilterFormValue,
): FormCompletionFilterDirtyPatchPayload => {
  const payload: FormCompletionFilterDirtyPatchPayload = {};

  if (isDirtyFieldEntry(dirtyFields.all_selected_must_fulfill_condition_v2)) {
    payload.is_v2 = true;
    payload.all_selected_must_fulfill_condition_v2 =
      value.all_selected_must_fulfill_condition_v2;
  }

  if (isDirtyFieldEntry(dirtyFields.custom_forms)) {
    payload.custom_forms = value.custom_forms;
  }

  return payload;
};
