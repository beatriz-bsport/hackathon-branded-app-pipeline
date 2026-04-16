/**
 * PrivateBooking type based on the legacy `private_service/private_booking/` endpoint response.
 * Endpoint: `book/v1/private_service/private_booking/`
 */
export type PrivateBooking = {
  id: number;
  date_start: string;
  date_end: string;
  private_consumer_pass: number | null;
  member: number;
  name: string;
  private_slot: number;
  private_service: number;
  address: string;
  booking_status_code: number;
  is_discardable: boolean;
  associated_coach: number;
  associated_establishment: number;
  coach: number;
  establishment: number;
  date_created: string;
  source: number;
  first_in_company: boolean;
  was_refunded: boolean;
  timezone_name: string;
  date_canceled: string | null;
  is_unpaid: boolean;
  is_at_home: boolean;
  recurrence_rule_private_booking: number | null;
  staff_history: Record<string, unknown>[];
  internal_note?: string;
};

export enum PrivateBookingStatusCode {
  OK = 0,
  CANCELLED_BY_MANAGER = 1,
  CANCELLED_BY_CONSUMER = 2,
  CANCELLED_BY_SESSION = 3,
}

export type PrivateBookingFilterParams = {
  before_date_end?: boolean;
  booking_status_code__in?: number[];
  coach?: number;
  company?: number;
  date_start__gte?: string;
  date_start__lte?: string;
  establishment?: number;
  strictly_future_booking?: boolean;
  id__in?: number[];
  is_recurrent?: boolean;
  is_unpaid?: boolean;
  member?: number;
  only_mine?: boolean;
  page_size?: number;
  page?: number;
  strictly_past_booking?: boolean;
  was_refunded?: boolean;
  ordering?: "date_start" | "-date_start";
  future_booking?: boolean;
  past_booking?: boolean;
};

/**
 * Minimal PrivateConsumerPass type for enrichment.
 * The full legacy type has many more fields; we only need pass name.
 * Endpoint: `book/v1/private_service/private_consumer_pass/`
 */
export type PrivateConsumerPass = {
  id: number;
  private_pass: {
    id: number;
    name: string;
  };
  consumer: number;
  member: number;
  used_credits: number;
  reverted: boolean;
};

export type PrivateConsumerPassFilterParams = {
  id__in?: number[];
  member?: number;
  page_size?: number;
  page?: number;
};
