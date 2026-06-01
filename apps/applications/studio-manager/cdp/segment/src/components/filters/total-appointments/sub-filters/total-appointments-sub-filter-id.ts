import type { ValueOf } from "#src/components/filters/shared/sub-filter-id";

export const TOTAL_APPOINTMENTS_SUB_FILTER_IDS = {
  bookingDate: "bookingDate",
  bookingHourRange: "bookingHourRange",
  coach: "coach",
} as const;

export type TotalAppointmentsSubFilterId = ValueOf<
  typeof TOTAL_APPOINTMENTS_SUB_FILTER_IDS
>;

export const totalAppointmentsSubFilterFieldMap = {
  [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingDate]: "bookingDate",
  [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingHourRange]: "bookingHourRange",
  [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.coach]: "coach",
} as const;

export type TotalAppointmentsSubFilterField = ValueOf<
  typeof totalAppointmentsSubFilterFieldMap
>;
