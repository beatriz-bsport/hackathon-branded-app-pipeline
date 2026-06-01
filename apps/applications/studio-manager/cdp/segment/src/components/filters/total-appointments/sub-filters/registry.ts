import { bookingDateTotalAppointmentsSubFilterModule } from "./booking-date/module";
import { bookingHourRangeTotalAppointmentsSubFilterModule } from "./booking-hour-range/module";
import { coachTotalAppointmentsSubFilterModule } from "./coach/module";
import { establishmentTotalAppointmentsSubFilterModule } from "./establishment/module";
import type { TotalAppointmentsSubFilterModule } from "./total-appointments-sub-filter-module-contract";

export const REGISTERED_TOTAL_APPOINTMENTS_SUB_FILTERS = [
  bookingDateTotalAppointmentsSubFilterModule,
  bookingHourRangeTotalAppointmentsSubFilterModule,
  coachTotalAppointmentsSubFilterModule,
  establishmentTotalAppointmentsSubFilterModule,
] as const satisfies readonly TotalAppointmentsSubFilterModule[];
