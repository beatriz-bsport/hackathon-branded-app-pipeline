import type { FieldNamesMarkedBoolean } from "react-hook-form";

import { isDirtyFieldEntry } from "#src/components/filters/shared/dirty-fields";

import {
  TOTAL_APPOINTMENTS_NUMBER_TYPE,
  totalAppointmentsNumberTypeToComparatorMap,
} from "../constants";
import type {
  TotalAppointmentsNumberDirtyPatchPayload,
  TotalAppointmentsNumberFilterFormValue,
} from "../types";

type TotalAppointmentsNumberDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<TotalAppointmentsNumberFilterFormValue>>
>;

/**
 * Builds a PATCH payload containing only dirty numeric comparator fields.
 */
export const buildDirtyPatchPayload = (
  dirtyFields: TotalAppointmentsNumberDirtyFields,
  value: TotalAppointmentsNumberFilterFormValue,
): TotalAppointmentsNumberDirtyPatchPayload => {
  const payload: TotalAppointmentsNumberDirtyPatchPayload = {};

  if (
    isDirtyFieldEntry(dirtyFields.value) ||
    isDirtyFieldEntry(dirtyFields.type) ||
    isDirtyFieldEntry(dirtyFields.secondValue)
  ) {
    payload.comparator = totalAppointmentsNumberTypeToComparatorMap[value.type];
    payload.value = value.value;
    payload.value_second =
      value.type === TOTAL_APPOINTMENTS_NUMBER_TYPE.between
        ? (value.secondValue ?? value.value)
        : 0;
  }

  return payload;
};
