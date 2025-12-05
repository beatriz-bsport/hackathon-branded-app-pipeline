import { DATETIME_FORMATS } from "@bsport/datetime-formatting";

/**
 * Base type representing common fields between Session (Offer) creation and editing
 */
export type SessionBase = {
  allow_guest_offer: boolean;
  available_on_partnership: boolean;
  blacklist_tags: number[];
  broadcast_link: string;
  coach_payment_rule: number | null;
  coach: number;
  credits: number;
  description_override: string;
  duration_minute: number;
  effectif: number;
  establishment: number;
  level: number;
  manager_only: boolean;
  meta_activity?: number;
  name_override: string;
  partner_max_booking_count: number;
  room_blueprint?: number;
  sync_on_spivi?: boolean;
  waiting_list_max_size: number;
  wellhub_product_id?: number | null;
  whitelist_tags: number[];
};

/**
 * Type for creating a new session (offer)
 */
export type SessionCreate = SessionBase & {
  dates: number[];
  is_hybrid: boolean;
  recurrence_id?: string;
};

/**
 * Type for editing an existing session (offer)
 */
export type SessionEdit = SessionBase & {
  coach_override: number | null;
  credit_price_override?: number;
  custom_selection_ids: number[];
  custom_selection: boolean;
  date_start: typeof DATETIME_FORMATS.ISO_DATETIME_WITH_ZONE;
  id: number;
  meta_activity: number;
  modifyAllDates: boolean;
  notifyConsumers: boolean;
  propagate_coach_override_value: number;
};

export type SessionCreationFormData = Pick<
  SessionCreate,
  | "name_override"
  | "description_override"
  | "manager_only"
  | "credits"
  | "waiting_list_max_size"
  | "effectif"
  | "available_on_partnership"
  | "partner_max_booking_count"
> & {
  allowCustomNameAndDescription: boolean;
};
