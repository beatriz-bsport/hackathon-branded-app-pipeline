import { IncompatibilityErrorCode } from "./constants";

export type PaginatedParams = {
  page?: number;
  page_size?: number;
  current_item_id?: number;
};

export type ConsumerPaymentPack = {
  id: number;
  payment_pack: number;
  payment_pack_id: string;
  consumer_payment_pack_source: number | null;
  bookings: number[];
  used_credits: number;
  available_credits: number;
  starting_date: string;
  ending_date: string;
  member_id: number;
  bookings_this_week: number;
  disabled: boolean;
  reverted: boolean;
  invoice: string | null;
  src_consumer_payment_pack: number | null;
  dst_consumer_payment_pack: number | null;
  track_modified_credit: boolean;
  penalty_disabled_from: string | null;
  penalty_disabled_until: string | null;
  linked_private_consumer_pass: number | null;
  is_universal_consumer_pass_source: boolean;
  date_bought: string | null;
  created_from_payment_pack_template_instance: number | null;
  company_source_name: string;
  company_source_primary_color: string;
  payment_pack_template_instance_disabled: boolean;
  manual_start_date: string | null;
  from_billing_plan: number | null;
  payment_combo_purchase: number | null;
};

export type RegisterBookingPayload = {
  /** Required. Single offer ID or array of offer IDs */
  offer: number | number[];
  /** Optional. Booking option ID (only used when a single offer is passed) */
  booking_option?: number;
  /** Optional. Assign a specific spot to the booking */
  spot_id?: number | null;
  /** Optional. Auto-assign a spot (default: false) */
  auto_assign_spot?: boolean;
  /** Manager only. Keep credits even when booking (default: false) */
  keep_credits?: boolean;
  /** Manager only. Notify the member after booking (default: false) */
  notify_member?: boolean;
};

export type ConsumerPaymentPackFilterParams = {
  member?: number; // filter by member PK (0 = current user's consumer)
  memberId?: number; // alias for member
  member_relation?: number; // filter by member relation PK
  id__in?: number[];
  consumer?: number; // FK to Consumer
  payment_pack?: number; // FK to PaymentPack
  company?: number; // filter by company PK
  payment_pack_template?: number; // filter by payment pack template ID
  mine?: boolean; // current user's passes with credits > 0
  current?: boolean; // currently active (started and not expired)
  is_expired?: boolean;
  is_valid_today?: boolean;
  has_credit_left?: boolean;
  is_universal?: boolean;
  reverted?: boolean;
  disabled?: boolean;
  without_active_link_in_relation_id?: number;
};

export type PaginatedConsumerPaymentPackFilterParams =
  ConsumerPaymentPackFilterParams & PaginatedParams;

export type CompatibleWithSessionParams = {
  member?: number;
  memberId?: number;
  id__in?: string;
  consumer?: number;
  payment_pack?: number;
  reverted?: boolean;
  disabled?: boolean;
  current?: boolean;
  is_expired?: boolean;
  is_valid_today?: boolean;
  has_credit_left?: boolean;
  is_universal?: boolean;
  with_relations?: boolean; // switches to ConsumerPaymentPackWithRelationsSerializer
};

export type MaxoutBookingData = {
  start_date: string;
  end_date: string;
  booking_available: number;
};

export type MaxoutBooking = {
  days: MaxoutBookingData[];
  weeks: MaxoutBookingData[];
  months: MaxoutBookingData[];
};

export type MaxoutBookingResponse = Record<string, MaxoutBooking>;

export type IncompatibilityErrorCodeListResponse = {
  // Key is the Python str([offerId, cppId]) representation, e.g. "[42, 17]" : [2002, 2003]
  incompatibilities_to_offer: Record<string, IncompatibilityErrorCode[]>;
};
