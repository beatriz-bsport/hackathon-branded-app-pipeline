import {
  AGE_FILTER_NUMBER_TYPE,
  ageFilterNumberTypeToComparatorMap,
} from "../constants";
import type { AgeFilterCreatePayload, AgeFilterFormValue } from "../types";

export const toCreatePayload = (
  value: AgeFilterFormValue,
): AgeFilterCreatePayload => ({
  smartlist: value.smartlist,
  comparator: ageFilterNumberTypeToComparatorMap[value.type],
  value: value.value,
  value_second:
    value.type === AGE_FILTER_NUMBER_TYPE.between
      ? (value.secondValue ?? value.value)
      : 0,
});
