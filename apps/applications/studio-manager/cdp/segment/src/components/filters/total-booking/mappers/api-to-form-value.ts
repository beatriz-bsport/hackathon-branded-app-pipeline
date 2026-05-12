import type { TotalBookingFilter } from "@bsport/api-cdp/smartlist";

import {
  TOTAL_BOOKING_NUMBER_TYPE,
  totalBookingNumberComparatorToTypeMap,
} from "../constants";
import type { TotalBookingNumberFilterFormValue } from "../types";

export const mapTotalBookingFilterToFormValue = (
  filter: TotalBookingFilter,
): TotalBookingNumberFilterFormValue => ({
  id: filter.id,
  smartlist: filter.smartlist,
  type:
    totalBookingNumberComparatorToTypeMap[filter.comparator] ??
    TOTAL_BOOKING_NUMBER_TYPE.greaterOrEqual,
  value: filter.value ?? 0,
  secondValue:
    filter.comparator === undefined ||
    totalBookingNumberComparatorToTypeMap[filter.comparator] !==
      TOTAL_BOOKING_NUMBER_TYPE.between
      ? null
      : (filter.value_second ?? null),
});
