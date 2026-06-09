import { appointmentPassTotalAppointmentsSubFilterModule } from "./appointment-pass/module";
import { appointmentsTotalAppointmentsSubFilterModule } from "./appointments/module";
import { bookingDateTotalAppointmentsSubFilterModule } from "./booking-date/module";
import { bookingHourRangeTotalAppointmentsSubFilterModule } from "./booking-hour-range/module";
import { coachTotalAppointmentsSubFilterModule } from "./coach/module";
import { establishmentTotalAppointmentsSubFilterModule } from "./establishment/module";
import type { TotalAppointmentsSubFilterId } from "./total-appointments-sub-filter-id";
import type { TotalAppointmentsSubFilterModule } from "./total-appointments-sub-filter-module-contract";

export const REGISTERED_TOTAL_APPOINTMENTS_SUB_FILTERS = [
  bookingDateTotalAppointmentsSubFilterModule,
  bookingHourRangeTotalAppointmentsSubFilterModule,
  coachTotalAppointmentsSubFilterModule,
  establishmentTotalAppointmentsSubFilterModule,
  appointmentPassTotalAppointmentsSubFilterModule,
  appointmentsTotalAppointmentsSubFilterModule,
] as const satisfies readonly TotalAppointmentsSubFilterModule[];

export const REGISTERED_TOTAL_APPOINTMENTS_SUB_FILTERS_BY_ID =
  REGISTERED_TOTAL_APPOINTMENTS_SUB_FILTERS.reduce(
    (accumulator, subFilterModule) => {
      accumulator[subFilterModule.id] = subFilterModule;
      return accumulator;
    },
    {} as Record<
      TotalAppointmentsSubFilterId,
      TotalAppointmentsSubFilterModule
    >,
  );
