/**
 * Re-exports of the total-booking sub-filter ids so the booking milestone
 * filter (id 21) can reuse the exact same sub-filter implementations as the
 * total bookings filter (id 22). See total-booking/sub-filters/ for the
 * canonical definitions.
 */
export {
  TOTAL_BOOKING_SUB_FILTER_IDS as BOOKING_MILESTONE_SUB_FILTER_IDS,
  totalBookingSubFilterFieldMap as bookingMilestoneSubFilterFieldMap,
} from "#src/components/filters/total-booking/sub-filters/total-booking-sub-filter-id";
export type {
  TotalBookingSubFilterField as BookingMilestoneSubFilterField,
  TotalBookingSubFilterId as BookingMilestoneSubFilterId,
} from "#src/components/filters/total-booking/sub-filters/total-booking-sub-filter-id";
