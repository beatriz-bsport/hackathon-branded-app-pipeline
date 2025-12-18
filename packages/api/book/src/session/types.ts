export type FetchSessionsParams = {
  /** Minimum session date (inclusive). Format: YYYY-MM-DD. */
  min_date?: string;

  /** Maximum session date (exclusive). Format: YYYY-MM-DD. */
  max_date?: string;

  /** Filter by a list of exact dates (YYYY-MM-DD). */
  dates?: string[];

  /** Filter by a specific date (YYYY-MM-DD). */
  date?: string;

  /** Filter by meta activity ID. */
  meta_activity?: number;

  /** Filter by activity ID. */
  activity?: number;

  /** Alias for meta_activity (legacy). */
  metaActivities?: number;

  /** Filter by company ID. */
  company?: number;

  /** Filter by franchise ID. */
  franchise?: number;

  /** Filter by coach ID (0 = current coach). */
  coach?: number;

  /** Return only future sessions (>= now - 12h). */
  only_future?: boolean;

  /** Return only strictly future sessions (>= now). */
  only_future_strict?: boolean;

  /** Filter by whether the session is available on aggregators. */
  available_on_partnership?: boolean;

  /** Filter by whether the session is manager only.*/
  manager_only?: boolean;

  /** Filter by establishment ID. */
  establishment?: number;

  /** Filter by a list of establishment IDs. */
  establishment__in?: number[];

  /** Alias for establishment__in. */
  establishments?: number[];

  /** Filter by a list of establishment group IDs. */
  establishment_group__in?: number[];

  /** Filter by a list of coach IDs. */
  coach__in?: number[];

  /** Alias for coach__in. */
  coaches?: number[];

  /** Filter by a list of activity IDs. */
  activity__in?: number[];

  /** Filter by a list of level IDs. */
  level__in?: number[];

  /** Alias for level__in. */
  levels?: number[];

  /** Filter by a list of session IDs. */
  id__in?: number[];

  /** Filter sessions whose activity’s meta_activity is a workshop. */
  is_workshop?: boolean;

  /** Filter sessions whose activity’s meta_activity is broadcasted (online). */
  is_online?: boolean;

  /** Filter by availability. */
  available?: boolean;

  /** Filter sessions containing any of these tag IDs (whitelist or blacklist). */
  tags_ids__in?: number[];

  /** Filter sessions with whitelist tag IDs. */
  whitelist_tags_id__in?: number[];

  /** Filter sessions with blacklist tag IDs. */
  blacklist_tags_id__in?: number[];

  /** Whether to include grouped sessions. */
  with_group?: boolean;

  /** Filter by a list of group IDs. */
  group_id__in?: number[];

  /** If true, only return one session per group (unique). */
  with_unique_offer_by_group?: boolean;

  /** Filter by coach override ID. */
  coach_override?: number;

  /** Whether coach_override is null. */
  coach_override__isnull?: boolean;

  /** Filter by a list of category IDs (activity__SCT_id). */
  category__in?: number[];

  /** Filter sessions that require roll call validation. */
  roll_call_needs_validation?: boolean;

  /** Filter sessions that have an active sub-teacher request. */
  has_active_sub_teacher_request?: boolean;
};

export type PaginatedFetchSessionsParams = FetchSessionsParams & {
  /** Number of items per page*/
  page_size?: number;

  /** Page number of the results*/
  page?: number;
};

export type ListSessionsWithPendingReplacementRequestIdsParams = {
  offer_id_list: number[];
};

export declare type ManagerSession = {
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
