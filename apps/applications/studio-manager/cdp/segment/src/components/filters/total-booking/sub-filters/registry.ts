import { activityTotalBookingSubFilterModule } from "./activity/activity.module";
import { coachTotalBookingSubFilterModule } from "./coach/coach.module";
import { establishmentTotalBookingSubFilterModule } from "./establishment/establishment.module";
import type { TotalBookingSubFilterModule } from "./total-booking-sub-filter-module-contract";

export const REGISTERED_TOTAL_BOOKING_SUB_FILTERS = [
  activityTotalBookingSubFilterModule,
  establishmentTotalBookingSubFilterModule,
  coachTotalBookingSubFilterModule,
] as const satisfies readonly TotalBookingSubFilterModule[];
