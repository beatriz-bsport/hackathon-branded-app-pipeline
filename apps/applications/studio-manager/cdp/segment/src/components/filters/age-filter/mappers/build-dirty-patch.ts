import type { FieldNamesMarkedBoolean } from "@bsport/form";

import { isDirtyFieldEntry } from "#src/components/filters/shared/dirty-fields";

import {
  AGE_FILTER_NUMBER_TYPE,
  ageFilterNumberTypeToComparatorMap,
} from "../constants";
import type { AgeFilterDirtyPatchPayload, AgeFilterFormValue } from "../types";

export type AgeFilterDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<AgeFilterFormValue>>
>;

export const buildAgeFilterDirtyPatch = (
  dirtyFields: AgeFilterDirtyFields,
  value: AgeFilterFormValue,
): AgeFilterDirtyPatchPayload => {
  const payload: AgeFilterDirtyPatchPayload = {};

  if (
    isDirtyFieldEntry(dirtyFields.value) ||
    isDirtyFieldEntry(dirtyFields.type) ||
    isDirtyFieldEntry(dirtyFields.secondValue)
  ) {
    payload.comparator = ageFilterNumberTypeToComparatorMap[value.type];
    payload.value = value.value;
    payload.value_second =
      value.type === AGE_FILTER_NUMBER_TYPE.between
        ? (value.secondValue ?? value.value)
        : 0;
  }

  return payload;
};
