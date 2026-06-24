import type {
  PartnerSpotCappingStrategy,
  PartnershipOffer,
} from "#src/partnership/types";

export type GroupSessionStatus = "scheduled" | "past" | "cancelled";

export type GroupSessionParams = {
  /** Filter groups that allow booking after the first offer starts. */
  allow_booking_after_start?: boolean;

  /** Filter by whether the group session is available. */
  available?: boolean;

  /** Filter by company ID. */
  company?: number;

  /** Jump to the page containing this group session when page is absent. */
  current_item_id?: number;

  /** Filter by a list of group session IDs. */
  id__in?: number[];

  /** Filter groups that require booking the full group. */
  full_booking_only?: boolean;

  /** Filter by a list of level IDs. */
  level__in?: number[];

  /** Maximum first offer date, inclusive. Format: YYYY-MM-DD. */
  max_date?: string;

  /** Filter by a list of meta activity IDs. */
  meta_activity__in?: number[];

  /** Minimum first offer date, inclusive. Format: YYYY-MM-DD. */
  min_date?: string;

  /** Order results, for example "name" for alphabetical order. */
  ordering?: string;

  /** Filter by lifecycle status. */
  status?: GroupSessionStatus;
};

export type PaginatedGroupSessionParams = GroupSessionParams & {
  /** Number of items per page*/
  page_size?: number;

  /** Page number of the results*/
  page?: number;
};

export type SearchGroupSessionParams = PaginatedGroupSessionParams & {
  /** Required fuzzy search query. */
  q: string;
};

export enum GroupSessionRecurrenceType {
  WEEKLY = 0,
  MONTHLY = 1,
  YEARLY = 2,
}

export type RecurrenceRuleGroupSession = {
  count?: number | null;
  frequence?: GroupSessionRecurrenceType;
  interval?: number | null;
  until?: number | null;
};

export type GroupSession = {
  id: number;
  company: number;
  meta_activity: number;
  offers: number[];
  level: number;
  full_booking_only: boolean;
  allow_booking_after_start: boolean;
  available: boolean;
  recurrence_id: string | null;
  name: string;
  recurrence_rule: RecurrenceRuleGroupSession;
  manager_only: boolean;
  recurrence_index: number | null;
  first_offer_date: string;
  last_offer_date: string | null;
  sync_on_spivi?: boolean;
};

export type UpdateGroupSessionPayload = {
  allow_booking_after_start?: boolean;
  blacklist_tags?: number[];
  full_booking_only?: boolean;
  level?: number;
  manager_only?: boolean;
  name?: string;
  sync_on_spivi?: boolean;
  whitelist_tags?: number[];
};

export type UpdateGroupSessionParams = {
  groupSessionId: number;
  payload: UpdateGroupSessionPayload;
};

export type DeleteGroupSessionPayload = {
  notify_if_cancelled: boolean;
  similar_group_ids: number[];
};

export type DeleteGroupSessionParams = {
  groupSessionId: number;
  payload: DeleteGroupSessionPayload;
};

export type GroupSessionCreationGroupData = {
  allow_booking_after_start: boolean;
  available: boolean;
  full_booking_only: boolean;
  level: number;
  manager_only: boolean;
  meta_activity: number;
  name: string;
  sync_on_spivi?: boolean;
};

export type GroupSessionCreationRecurrenceRule = {
  count: number | null;
  frequence: GroupSessionRecurrenceType | null;
  interval?: number | null;
  until: number | null;
};

export type GroupSessionOfferPayload = {
  allow_guest_offer?: boolean;
  available?: boolean;
  available_on_partnership: boolean;
  blacklist_tags: number[];
  broadcast_link: string;
  coach: number;
  /**
   * Preview and regular offer write field. Convert to coach_payment_rule_id
   * before final grouped-offer creation.
   */
  coach_payment_rule?: number | null;
  /**
   * Final grouped-offer creation field. null means no explicit coach payment
   * rule.
   */
  coach_payment_rule_id?: number | null;
  credits: number;
  date_start: number | string;
  description_override?: string;
  duration_minute: number;
  effectif: number;
  establishment: number;
  id?: number;
  is_hybrid?: boolean;
  level: number;
  manager_only: boolean;
  meta_activity?: number;
  name_override?: string;
  partner_max_booking_count: number | null;
  partner_spot_capping_strategy?: PartnerSpotCappingStrategy;
  partnership_offers?: PartnershipOffer[];
  recurrence_id?: string;
  room_blueprint?: number | null;
  sync_on_spivi?: boolean;
  waiting_list_max_size: number;
  wellhub_product_id?: number | null;
  whitelist_tags: number[];
};

export type GroupSessionCreateGroupPayload = GroupSessionCreationGroupData & {
  company?: number;
  first_offer_date?: string;
  id?: number;
  offers?: number[];
  recurrence_id?: string | null;
  recurrence_index?: number | null;
  recurrence_rule?:
    | GroupSessionCreationRecurrenceRule
    | RecurrenceRuleGroupSession
    | null;
};

export type PrepareGroupSessionsCreationPayload = {
  group_data: GroupSessionCreationGroupData;
  recurrence_rule: GroupSessionCreationRecurrenceRule | null;
  offers_data: GroupSessionOfferPayload[];
};

export type GroupSessionWithOffers = {
  group: GroupSessionCreateGroupPayload;
  offers_data: GroupSessionOfferPayload[];
};

export type PrepareGroupSessionsCreationResponse = Record<
  number,
  GroupSessionWithOffers
>;

export type CreateGroupSessionsPayload = {
  group_data_with_offers: Record<number, GroupSessionWithOffers>;
};
