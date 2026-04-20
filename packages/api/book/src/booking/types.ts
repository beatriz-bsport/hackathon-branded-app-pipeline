export enum BookingStatusCode {
  OK = 0,
  CANCELLED_BY_MANAGER = 1,
  CANCELLED_BY_CONSUMER = 2,
  CANCELLED_BY_SESSION = 3,
}

export enum BookingSource {
  APP = 0,
  MEMBER_AREA = 1,
  BACKOFFICE = 2,
  OTHER = 3,
  MIGRATION = 4,
  AGGREGATOR = 5,
  UNKNOWN = 6,
  QUICKSALE = 7,
  COMPANY_BRANDED_APP = 8,
  FRANCHISOR_BRANDED_APP = 9,
  BSPORT_GENERAL_APP = 10,
  DJANGO_ADMIN = 11,
}

export interface SpotInformation {
  name?: string | null;
  shape?: string | null;
  prefix?: string | null;
  suffix?: string | null;
  fill?: string | null;
  indexType?: string | number;
}

export enum BookingStaffActionIdentifier {
  BOOKING_CREATED_BY_STAFF = 10,
  BOOKING_CANCELLED_BY_STAFF = 11,
}
export type BookingStaffHistoryEntry = {
  staff_id: number;
  action_identifier: BookingStaffActionIdentifier;
  timestamp: number; // Unix timestamp (float)
};

export type BookingStaffHistory = BookingStaffHistoryEntry[];

export type Booking = {
  id: number;
  name: string;
  offer: number;
  offer_date_start: string;
  offer_duration_minute: number;
  consumer: number;
  consumer_payment_pack: number | null;
  member: number | null;
  source_member: number | null;
  recurrence_rule_booking: number | null;
  coach: number | null;
  coach_override: number | null;
  establishment: number | null;
  meta_activity: number | null;
  level: number | null;
  custom_level: number | null;
  source: BookingSource;
  booking_status_code: BookingStatusCode;
  rollcall_booking_status_code: BookingStatusCode;
  attendance: boolean;
  attendance_date_updated: string | null;
  roll_call_attendance: boolean | null;
  roll_call_attendance_date_updated: string | null;
  roll_call_needs_validation: boolean;
  date_roll_call_last_modified: string | null;
  is_discardable: boolean;
  is_deleted: boolean;
  is_no_show: boolean;
  no_show_penalty_applied: boolean;
  was_refunded: boolean;
  first_in_company: boolean;
  credit_consumed: number;
  date: string;
  date_canceled: string | null;
  date_no_show_registered: string | null;
  spot_id: number | null;
  spot_information: SpotInformation | null;
  staff_history: BookingStaffHistory;
  has_spivi_error: boolean | null;
};

export type BookingFilterParams = {
  activity__in?: string;
  available?: boolean;
  before_date_end?: boolean;
  after_date_end?: boolean;
  booking_status_code?: BookingStatusCode;
  booking_status_code__in?: string;
  offer?: number;
  offer_id?: number;
  offer_is_workshop?: boolean;
  coaches?: string;
  establishments?: string;
  establishment_group__in?: string;
  group_id__in?: string;
  metaActivities?: string;
  member?: number;
  in_offer?: number;
  id__in?: string;
  ids_in?: string;
  currently_broadcasted?: boolean;
  future_booking?: boolean;
  past_booking?: boolean;
  mine?: boolean;
  mine_as_consumer?: boolean;
  has_active_sub_teacher_request?: boolean;
  recurrence_rule_booking__isnull?: boolean;
  date__gte?: string;
  date__lte?: string;
  min_date?: string;
  max_date?: string;
  start_until_datetime?: string;
  attendance?: boolean;
  consumer_payment_pack?: number;
  was_refunded?: boolean;
  ordering?:
    | "offer__date_start"
    | "date_created"
    | "member_first_name"
    | "member_last_name"
    | "-offer__date_start"
    | "-date_created"
    | "-member_first_name"
    | "-member_last_name";
};

export type PaginatedParameters = {
  page?: number;
  page_size?: number;
  current_item_id?: number; // jump directly to the page containing this booking ID
};

export type PaginatedBookingFilterParams = BookingFilterParams &
  PaginatedParameters;

export type RecurrenceRuleBooking = {
  id: number;
  member: number;
  delay_week: number;
  day_of_week: number;
  hour: number;
  minute: number;
  meta_activity: number;
  establishment: number;
  notify_if_booked: boolean;
};

export type RecurrenceRuleBookingFilterParams = {
  member?: number;
  establishment?: number;
  meta_activity?: number;
} & PaginatedParameters;
export type CancelBookingParams = {
  force_notify?: boolean;
  force_refund?: boolean;
};

export type SetSpotParams = {
  spot_id: number;
};

export type CreateRecurrenceRuleBookingParams = Omit<
  RecurrenceRuleBooking,
  "id"
>;

export type UpdateRecurrenceRuleBookingParams =
  Partial<CreateRecurrenceRuleBookingParams>;

export type DeleteRecurrenceRuleBookingParams = {
  cancel_related_bookings?: boolean;
  notify_if_canceled?: boolean;
};

export type UpdateSessionWithCancelledBookingsToRetryParams = {
  offer_ids: number[];
};
