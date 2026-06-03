import { activityTotalBookingSubFilterModule } from "./activity/module";
import { attendanceModeTotalBookingSubFilterModule } from "./attendance-mode/module";
import { bookingDateTotalBookingSubFilterModule } from "./booking-date/module";
import { bookingHourRangeTotalBookingSubFilterModule } from "./booking-hour-range/module";
import { coachTotalBookingSubFilterModule } from "./coach/module";
import { establishmentTotalBookingSubFilterModule } from "./establishment/module";
import { levelTotalBookingSubFilterModule } from "./level/module";
import { paymentPackTotalBookingSubFilterModule } from "./payment-pack/module";
import type { TotalBookingSubFilterModule } from "./total-booking-sub-filter-module-contract";

export const REGISTERED_TOTAL_BOOKING_SUB_FILTERS = [
  activityTotalBookingSubFilterModule,
  attendanceModeTotalBookingSubFilterModule,
  establishmentTotalBookingSubFilterModule,
  coachTotalBookingSubFilterModule,
  paymentPackTotalBookingSubFilterModule,
  bookingDateTotalBookingSubFilterModule,
  bookingHourRangeTotalBookingSubFilterModule,
  levelTotalBookingSubFilterModule,
] as const satisfies readonly TotalBookingSubFilterModule[];
