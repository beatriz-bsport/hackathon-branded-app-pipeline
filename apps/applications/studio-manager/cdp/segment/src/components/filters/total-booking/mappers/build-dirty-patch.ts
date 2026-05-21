import type { FieldNamesMarkedBoolean } from "react-hook-form";

import { isDirtyFieldEntry } from "#src/components/filters/shared/dirty-fields";

import { totalBookingNumberTypeToComparatorMap } from "../constants";
import { REGISTERED_TOTAL_BOOKING_SUB_FILTERS } from "../sub-filters/registry";
import type {
  TotalBookingNumberDirtyPatchPayload,
  TotalBookingNumberFilterFormValue,
} from "../types";

type TotalBookingNumberDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<TotalBookingNumberFilterFormValue>>
>;

export const buildDirtyPatchPayload = (
  dirtyFields: TotalBookingNumberDirtyFields,
  value: TotalBookingNumberFilterFormValue,
): TotalBookingNumberDirtyPatchPayload => {
  const payload: TotalBookingNumberDirtyPatchPayload = {};

  if (
    isDirtyFieldEntry(dirtyFields.value) ||
    isDirtyFieldEntry(dirtyFields.type) ||
    isDirtyFieldEntry(dirtyFields.secondValue)
  ) {
    payload.comparator = totalBookingNumberTypeToComparatorMap[value.type];
    payload.value = value.value;
    payload.value_second =
      value.type === "between" ? (value.secondValue ?? value.value) : 0;
  }

  for (const subFilterModule of REGISTERED_TOTAL_BOOKING_SUB_FILTERS) {
    Object.assign(
      payload,
      subFilterModule.appendDirtyPatchSlice(dirtyFields, value),
    );
  }

  return payload;
};
