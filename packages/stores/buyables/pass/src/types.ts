export type Pass = {
  id: number;
  name: string;
  price:
    | {
        source: string;
        parsedValue: number;
      }
    | number;
  base_price: string;
  tax: string;
  credits: number | null;
  unlimited: boolean;
  nb_consumer_payment_packs: number; // Will be -1 if count_consumer_payment_packs query param is set to False
  max_bookings_per_day: number | null;
  max_bookings_per_week: number | null;
  max_bookings_per_month: number | null;
  max_purchase_per_member: number | null;
  expiration_days_before_first_use: number;
  theorical_margin_value: string;
  validity_daterange: null | string;
  duration_days: number | null;
  duration_months: number | null;
  duration_years: number | null;
  disabled: boolean;
  start_date_method: number;
  manager_only: boolean;
  new_member_only: boolean;
  company: number;
  SCTs: number[];
  metaActivities: number[];
  editable: boolean;
  establishments: number[];
  categories: number[];
  barcode: string;
  onsite_payment_available: boolean;
  full_vod_access: boolean;
  only_vod_access: boolean;
  penalty_active: boolean;
  penalty_nb_late_cancellations: number;
  penalty_nb_days: number;
  penalty_kind: number;
  penalty_days_blocked: number;
  penalty_account_value: string;
  category: number | null;
  whitelist_tags: number[];
  blacklist_tags: number[];
  tags_on_consumer_item_creation: number[];
  ordering_in_category: number;
  template_instance: number | null;
  notifications: number[];
  linked_private_pass: number | null;
  allow_guest_pass: boolean;
  is_usable_by_staff: boolean;
  expiration_date: Date | null;
  off_peak_schedule: { [key: string]: Array<string[]> };
  no_show_penalty_kind: number;
  no_show_penalty_active: boolean;
  no_show_penalty_threshold: number;
  no_show_penalty_amount: string;
  no_show_penalty_days_blocked: number;
  no_show_penalty_time_window_days: number;
  applies_for_payroll: boolean;
  description: null | string;
  highlighted_as_recommended: boolean;
  bookkeeping_account: null;
  member_relation_auto_share: boolean;
  grants_door_access: boolean;
};

export type PassCategory = {
  id: number;
  name: string;
  company_id: number;
  category_ordering: number;
};
