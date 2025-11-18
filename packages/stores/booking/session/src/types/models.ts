/**
 * Model: Offer
 * Serializer: Partial OfferCompleteSerializer (see as_manager endpoint)
 * A partial representation of a Session, specifically used for the manager view
 */
export type ManagerSession = {
  activity: number;
  allow_guest_offer: boolean;
  available_on_partnership: boolean;
  available: boolean;
  blacklist_tags: number[];
  broadcast_link: string;
  category: number;
  coach_override: number | null;
  coach_payment_rule_id: number | null;
  coach: number;
  credit_price_override: number;
  credit_price: number;
  custom_level: number;
  date_roll_call_last_modified: string | null;
  date_start: string;
  description_override: string;
  duration_minute: number;
  effectif: number;
  establishment_override: number | null;
  establishment: number;
  full: boolean;
  group: number | null;
  has_spivi_booking_error: boolean;
  has_spivi_error: boolean;
  id: number;
  is_broadcast: boolean;
  level: number;
  linked_hybrid_offer_id?: number | null;
  manager_only: boolean;
  meta_activity_color: string;
  meta_activity: number;
  name_override: string;
  name: string;
  nb_attendant: number;
  nb_bookings: number;
  nb_non_attendant: number;
  nb_option: number;
  parent_category: number;
  partner_max_booking_count: number;
  recurrence_id: string;
  roll_call_needs_validation: boolean;
  room_blueprint: number | null;
  source: number;
  sync_on_spivi: boolean;
  timezone_name: string;
  waiting_list_disabled: boolean;
  waiting_list_max_size: number;
  wellhub_product_id: number | null;
  whitelist_tags: number[];
};

/**
 * Model: Offer
 * Serializer: Partial OfferCompleteSerializer (see as_manager endpoint)
 * A partial representation of a Session, specifically used for the session list page,
 * with some additional processed fields.
 * Here name is the final name of the session (taking into account name_override)
 */

export type ProcessedManagerSession = Omit<ManagerSession, "name_override"> & {
  color: string;
};
