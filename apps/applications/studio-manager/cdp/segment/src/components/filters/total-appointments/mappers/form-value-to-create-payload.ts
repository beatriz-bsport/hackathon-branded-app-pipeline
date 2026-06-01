import {
  TOTAL_APPOINTMENTS_NUMBER_TYPE,
  totalAppointmentsNumberTypeToComparatorMap,
} from "../constants";
import { REGISTERED_TOTAL_APPOINTMENTS_SUB_FILTERS } from "../sub-filters/registry";
import type {
  TotalAppointmentsFilterCreatePayload,
  TotalAppointmentsNumberFilterFormValue,
} from "../types";

/**
 * Builds the POST payload for a new total appointments filter with inactive scope sections.
 */
export const createTotalAppointmentsPayload = (
  value: TotalAppointmentsNumberFilterFormValue,
): TotalAppointmentsFilterCreatePayload => {
  const payload: TotalAppointmentsFilterCreatePayload = {
    smartlist: value.smartlist,
    comparator: totalAppointmentsNumberTypeToComparatorMap[value.type],
    value: value.value,
    value_second:
      value.type === TOTAL_APPOINTMENTS_NUMBER_TYPE.between
        ? (value.secondValue ?? value.value)
        : 0,
    establishment_filter_active: false,
    select_all_establishments: false,
    establishments: [],
    at_home: false,
    private_service_filter_active: false,
    select_all_private_services: false,
    private_services: [],
    private_pass_filter_active: false,
    select_all_private_passes: false,
    private_passes: [],
    coach_filter_active: false,
    select_all_coaches: false,
    coaches: [],
    date_filter_active: false,
    date_filter_type: 3,
    date: null,
    date_second: null,
    duration: null,
    duration_second: null,
    hour_filter_active: false,
    hour: null,
    hour_second: null,
  };

  for (const subFilterModule of REGISTERED_TOTAL_APPOINTMENTS_SUB_FILTERS) {
    Object.assign(payload, subFilterModule.appendCreatePayloadSlice(value));
  }

  return payload;
};
