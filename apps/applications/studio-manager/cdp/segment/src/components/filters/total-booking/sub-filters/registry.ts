import { activityTotalBookingSubFilterModule } from "./activity/activity.module";
import { bookingDateTotalBookingSubFilterModule } from "./booking-date/booking-date.module";
import { bookingHourRangeTotalBookingSubFilterModule } from "./booking-hour-range/booking-hour-range.module";
import { coachTotalBookingSubFilterModule } from "./coach/coach.module";
import { establishmentTotalBookingSubFilterModule } from "./establishment/establishment.module";
import { levelTotalBookingSubFilterModule } from "./level/level.module";
import { paymentPackTotalBookingSubFilterModule } from "./payment-pack/payment-pack.module";
import type { TotalBookingSubFilterModule } from "./total-booking-sub-filter-module-contract";

export const REGISTERED_TOTAL_BOOKING_SUB_FILTERS = [
  activityTotalBookingSubFilterModule,
  establishmentTotalBookingSubFilterModule,
  coachTotalBookingSubFilterModule,
  paymentPackTotalBookingSubFilterModule,
  bookingDateTotalBookingSubFilterModule,
  bookingHourRangeTotalBookingSubFilterModule,
  levelTotalBookingSubFilterModule,
] as const satisfies readonly TotalBookingSubFilterModule[];
