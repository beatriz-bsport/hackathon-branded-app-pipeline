import type { Session } from "@bsport/api-book";

import type { Series } from "#src/types";

export type SeriesDuplicateSeries = Pick<
  Series,
  | "allow_booking_after_start"
  | "full_booking_only"
  | "level"
  | "manager_only"
  | "meta_activity"
  | "name"
  | "sync_on_spivi"
>;

export type SeriesDuplicateClass = Pick<
  Session,
  | "allow_guest_offer"
  | "available_on_partnership"
  | "blacklist_tags"
  | "broadcast_link"
  | "coach"
  | "coach_override"
  | "coach_payment_rule_id"
  | "credit_price"
  | "date_start"
  | "description_override"
  | "duration_minute"
  | "effectif"
  | "establishment"
  | "linked_hybrid_offer_id"
  | "name_override"
  | "partner_max_booking_count"
  | "partner_spot_capping_strategy"
  | "room_blueprint"
  | "waiting_list_max_size"
  | "whitelist_tags"
>;
