import type { PrivateBookingsFilter } from "@bsport/api-cdp/smartlist";

import {
  TOTAL_APPOINTMENTS_NUMBER_TYPE,
  totalAppointmentsNumberComparatorToTypeMap,
} from "../constants";
import type { TotalAppointmentsNumberFilterFormValue } from "../types";

/**
 * Maps a hydrated private bookings API filter to the total appointments form value.
 */
export const mapTotalAppointmentsFilterToFormValue = (
  filter: PrivateBookingsFilter,
): TotalAppointmentsNumberFilterFormValue => ({
  id: filter.id,
  smartlist: filter.smartlist,
  type:
    totalAppointmentsNumberComparatorToTypeMap[filter.comparator] ??
    TOTAL_APPOINTMENTS_NUMBER_TYPE.greaterOrEqual,
  value: filter.value ?? 0,
  secondValue:
    totalAppointmentsNumberComparatorToTypeMap[filter.comparator] ===
    TOTAL_APPOINTMENTS_NUMBER_TYPE.between
      ? (filter.value_second ?? null)
      : null,
});
