import { totalBookingNumberTypeToComparatorMap } from "../constants";
import { REGISTERED_TOTAL_BOOKING_SUB_FILTERS } from "../sub-filters/registry";
import type {
  TotalBookingFilterCreatePayload,
  TotalBookingNumberFilterFormValue,
} from "../types";

export const createTotalBookingPayload = (
  value: TotalBookingNumberFilterFormValue,
): TotalBookingFilterCreatePayload => {
  const payload: TotalBookingFilterCreatePayload = {
    smartlist: value.smartlist,
    comparator: totalBookingNumberTypeToComparatorMap[value.type],
    value: value.value,
    value_second:
      value.type === "between" ? (value.secondValue ?? value.value) : 0,
    activity_filter_active: false,
    coach_filter_active: false,
    date_filter_active: false,
    establishment_filter_active: false,
    level_filter_active: false,
    payment_pack_filter_active: false,
    select_all_activities: true,
    select_all_coaches: true,
    select_all_establishments: true,
    select_all_payment_packs: true,
    attendance_filter_active: null,
    attendance: null,
    hour_filter_active: null,
    hour: null,
    hour_second: null,
    date_filter_type: 3,
    date: null,
    date_second: null,
    duration: null,
    duration_second: null,
    meta_activities: [],
    establishments: [],
    payment_packs: [],
    coaches: [],
    level: [],
  };

  for (const subFilterModule of REGISTERED_TOTAL_BOOKING_SUB_FILTERS) {
    Object.assign(payload, subFilterModule.appendCreatePayloadSlice(value));
  }

  return payload;
};
