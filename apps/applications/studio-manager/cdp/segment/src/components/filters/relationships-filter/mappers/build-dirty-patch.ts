import type { FieldNamesMarkedBoolean } from "@bsport/form";

import { isDirtyFieldEntry } from "#src/components/filters/shared/dirty-fields";

import type {
  RelationshipsFilterDirtyPatchPayload,
  RelationshipsFilterFormValue,
} from "../types";

export type RelationshipsFilterDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<RelationshipsFilterFormValue>>
>;

/**
 * Builds a PATCH body with dirty primary fields only.
 */
export const buildRelationshipsFilterDirtyPatch = (
  dirtyFields: RelationshipsFilterDirtyFields,
  value: RelationshipsFilterFormValue,
): RelationshipsFilterDirtyPatchPayload => {
  const payload: RelationshipsFilterDirtyPatchPayload = {};

  if (isDirtyFieldEntry(dirtyFields.comparator_number_relations)) {
    payload.comparator_number_relations = value.comparator_number_relations;
  }

  if (isDirtyFieldEntry(dirtyFields.value_number_relations)) {
    payload.value_number_relations = value.value_number_relations;
  }

  if (isDirtyFieldEntry(dirtyFields.value_number_relations_second)) {
    payload.value_number_relations_second = value.value_number_relations_second;
  }

  return payload;
};
