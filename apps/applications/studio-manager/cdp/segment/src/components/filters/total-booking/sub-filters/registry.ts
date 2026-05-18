import { activityTotalBookingSubFilterModule } from "./activity/activity.module";
import type { TotalBookingSubFilterModule } from "./total-booking-sub-filter-module-contract";

export const REGISTERED_TOTAL_BOOKING_SUB_FILTERS = [
  activityTotalBookingSubFilterModule,
] as const satisfies readonly TotalBookingSubFilterModule[];
