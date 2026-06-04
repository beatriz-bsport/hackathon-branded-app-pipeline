import type { ValueOf } from "#src/components/filters/shared/sub-filter-id";

export const TOTAL_APPOINTMENTS_SUB_FILTER_IDS = {
  bookingDate: "bookingDate",
  bookingHourRange: "bookingHourRange",
  coach: "coach",
  establishment: "establishment",
  appointmentPass: "appointmentPass",
  appointment: "appointment",
} as const;

export type TotalAppointmentsSubFilterId = ValueOf<
  typeof TOTAL_APPOINTMENTS_SUB_FILTER_IDS
>;

export const totalAppointmentsSubFilterFieldMap = {
  [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingDate]: "bookingDate",
  [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingHourRange]: "bookingHourRange",
  [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.coach]: "coach",
  [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.establishment]: "establishment",
  [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.appointmentPass]: "appointmentPass",
  [TOTAL_APPOINTMENTS_SUB_FILTER_IDS.appointment]: "appointment",
} as const;

export type TotalAppointmentsSubFilterField = ValueOf<
  typeof totalAppointmentsSubFilterFieldMap
>;
