import { bookingDateTotalAppointmentsSubFilterModule } from "./booking-date/booking-date.module";
import { bookingHourRangeTotalAppointmentsSubFilterModule } from "./booking-hour-range/booking-hour-range.module";
import { coachTotalAppointmentsSubFilterModule } from "./coach/coach.module";
import type { TotalAppointmentsSubFilterModule } from "./total-appointments-sub-filter-module-contract";

export const REGISTERED_TOTAL_APPOINTMENTS_SUB_FILTERS = [
  bookingDateTotalAppointmentsSubFilterModule,
  bookingHourRangeTotalAppointmentsSubFilterModule,
  coachTotalAppointmentsSubFilterModule,
] as const satisfies readonly TotalAppointmentsSubFilterModule[];
