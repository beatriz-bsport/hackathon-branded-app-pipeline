import { BOOKING_MILESTONE_MIN_VALUE } from "#src/components/filters/booking-milestone/constants";
import type { BookingMilestoneFilterFormValue } from "#src/components/filters/booking-milestone/types";
import { createDefaultTotalBookingNumberFilter } from "#src/components/filters/total-booking/default-value";

/**
 * Builds the default form value for a new milestone filter card. Reuses the
 * total-booking defaults for sub-filter slices (since the shapes are identical)
 * and pins the milestone index `value` to its minimum (`1`).
 */
export const createDefaultBookingMilestoneFilter = (
  smartlistId: number,
): BookingMilestoneFilterFormValue => ({
  ...createDefaultTotalBookingNumberFilter(smartlistId),
  value: BOOKING_MILESTONE_MIN_VALUE,
});
