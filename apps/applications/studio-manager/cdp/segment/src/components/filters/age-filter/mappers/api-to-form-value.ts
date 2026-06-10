import type { AgeFilter } from "@bsport/api-cdp/smartlist";

import {
  AGE_FILTER_NUMBER_TYPE,
  ageFilterComparatorToTypeMap,
} from "../constants";
import type { AgeFilterFormValue } from "../types";

export const mapAgeFilterToFormValue = (
  filter: AgeFilter,
): AgeFilterFormValue => ({
  id: filter.id,
  smartlist: filter.smartlist,
  type:
    ageFilterComparatorToTypeMap[filter.comparator] ??
    AGE_FILTER_NUMBER_TYPE.greaterOrEqual,
  value: filter.value ?? 0,
  secondValue:
    ageFilterComparatorToTypeMap[filter.comparator] ===
    AGE_FILTER_NUMBER_TYPE.between
      ? (filter.value_second ?? null)
      : null,
});
