import type {
  SmartlistDateFilterType,
  SmartlistFilterPayload,
} from "../../shared/types";

/**
 * Smartlist booking milestone filter (N-th OK booking per consumer).
 * Endpoint family: `/customer-data-platform/v1/smartlist/bookings_number/`.
 *
 * Shares the reservation scoping / date / time / attendance sub-filter shape
 * with {@link TotalBookingFilter} (id 22), but the value field is the milestone
 * index (`value >= 1`) instead of a count comparator and there is no
 * `comparator` or `value_second`. `is_v2` stays on the model for backend parity
 * but is not exposed in the UI.
 */
export type BookingMilestoneFilter = SmartlistFilterPayload & {
  company_id: number;
  value: number;
  is_v2: boolean;
  select_all_activities: boolean;
  activity_filter_active: boolean;
  meta_activities: number[];
  select_all_establishments: boolean;
  establishment_filter_active: boolean;
  establishments: number[];
  select_all_payment_packs: boolean;
  payment_pack_filter_active: boolean;
  payment_packs: number[];
  select_all_coaches: boolean;
  coach_filter_active: boolean;
  coaches: number[];
  level_filter_active: boolean;
  level: number[];
  date_filter_active: boolean;
  date_filter_type: SmartlistDateFilterType;
  date: string | null;
  date_second: string | null;
  duration: number | null;
  duration_second: number | null;
  hour_filter_active: boolean | null;
  hour: string | null;
  hour_second: string | null;
  attendance_filter_active: boolean | null;
  attendance: boolean | null;
};

export type CreateBookingMilestoneFilterPayload = Omit<
  BookingMilestoneFilter,
  "id" | "company_id" | "filter_identifier"
>;

export type UpdateBookingMilestoneFilterPayload = Partial<
  Omit<
    BookingMilestoneFilter,
    "id" | "company_id" | "smartlist" | "filter_identifier"
  >
>;
