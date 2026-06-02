import { bookingDateTotalAppointmentsSubFilterModule } from "./booking-date/module";
import { bookingHourRangeTotalAppointmentsSubFilterModule } from "./booking-hour-range/module";
import { coachTotalAppointmentsSubFilterModule } from "./coach/module";
import { establishmentTotalAppointmentsSubFilterModule } from "./establishment/module";
import { privatePassTotalAppointmentsSubFilterModule } from "./private-pass/module";
import type { TotalAppointmentsSubFilterModule } from "./total-appointments-sub-filter-module-contract";

export const REGISTERED_TOTAL_APPOINTMENTS_SUB_FILTERS = [
  bookingDateTotalAppointmentsSubFilterModule,
  bookingHourRangeTotalAppointmentsSubFilterModule,
  coachTotalAppointmentsSubFilterModule,
  establishmentTotalAppointmentsSubFilterModule,
  privatePassTotalAppointmentsSubFilterModule,
] as const satisfies readonly TotalAppointmentsSubFilterModule[];
