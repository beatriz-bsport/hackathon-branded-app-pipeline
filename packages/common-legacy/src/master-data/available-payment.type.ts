export type ConsumerPaymentPack<PP = number> = {
  id: number;
  used_credits: number;
  available_credits: number;
  payment_pack_id: string;
  bookings: string[];
  starting_date: string;
  ending_date: string;
  member_id: number;
  bookings_this_week: number;
  payment_pack: PP;
  disabled: boolean;
  reverted: boolean;
  invoice: string;
  src_consumer_payment_pack: number[];
  dst_consumer_payment_pack: number | null;
  track_modified_credit: number[][];
  penalty_disabled_from: string | null;
  penalty_disabled_until: string | null;
  date_bought: string;
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

export type EasyAccess = {
  id: number;
  lines: Array<string>;
  name: string;
};

export type Establishment = {
  id: number;
  title: string;
  cover: string;
  location: Location;
  specific_info: string;
  easy_access: EasyAccess;
  disabled: boolean;
  associatedestablishment_set: number[];
  tzname: string;
  establishment_billing_group_id: number | null;
};

export type MetaActivity = {
  id: number;
  name: string;
  cover_main: string;
  rating: string;
  SCT: number;
  parent_category: number;
  images: {
    id: number;
    image: string;
  }[];
  establishments: number[];
  next_slot: string;
  company: number;
  activities: number[];
  description: string;
  last_booking_minutes: number;
  last_discard_minutes: number;
  first_booking_minutes_until: number;

  is_workshop: boolean;
  is_broadcast: boolean;
  customer_enabled: boolean;
  color: string;
  on_booking_notification: number[];
  auto_discard_active: boolean;
  auto_discard_hours_before_start: number;
  auto_discard_min_bookings_nb: number;
};

export type Coach = {
  firstname: string;
  lastname: string;
  name: string;
  gender: string;
  rating: string;
  id: number;
  birthday: string;
  photo?: string;
  description: string;
  phone?: string;
  email?: string;
  associated_coach_id: number;
  default_payment_rule_id?: number;
  coach_payment_rule_id?: number;
  private_coach_payment_rule_id: number;
  workshop_coach_payment_rule_id: number;
  coach_payment_rule_group_id: number;
  facebook_url?: string;
  instagram_url?: string;
  disabled: boolean;
  associatedcoach_set: number[];
  private_slots_coach_payment_rules: Array<{
    private_slot: number;
    coach_payment_rule: number;
  }>;
};

export type Offer_FULL = Offer<Coach, Establishment, MetaActivity>;

export type OfferREST = {
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
  company: number;
  credit_price_override: number;
  credit_price: number;
  custom_level: number;
  date_roll_call_last_modified: string | null;
  date_start: string;
  duration_minute: number;
  effectif: number;
  establishment: number;
  full: boolean;
  group: number | null;
  has_spivi_booking_error: boolean;
  has_spivi_error: boolean;
  id: number;
  is_broadcast: boolean;
  level: number;
  manager_only: boolean;
  meta_activity_color: string | null;
  meta_activity: number;
  name_override: string | null;
  name: string;
  nb_attendant: number;
  nb_bookings: number;
  nb_non_attendant: number;
  nb_option: number;
  parent_category: number;
  partner_max_booking_count: number;
  roll_call_needs_validation: boolean;
  room_blueprint: number | null;
  source: number;
  sync_on_spivi: boolean;
  timezone_name: string;
  waiting_list_disabled: boolean;
  waiting_list_max_size: number;
  whitelist_tags: number[];
};

export type Offer<C = number, E = number, M = number, A = number> = {
  company: number;
  activity: A;
  available: boolean;
  title: string;
  id: number;
  activity_id: number;
  category: string;
  waiting_list_max_size: number;
  coach_override?: C;
  coach: C;
  cover_main: string;
  date_end: string;
  date_start: string;
  effectif: number;
  level: string;
  level_id: number;
  meta_activity_id: number;
  name: string;
  nb_option: number;
  nb_bookings: number;
  parent_category: number;
  price: number;
  price_coach: number;
  credit_price: number;
  is_full: boolean;
  establishment_override?: E;
  establishment: E;
  meta_activity: M;
  timezone_name: string;
  room_blueprint?: number;
};

export type OfferStatus = {
  offer_status: number;
  bookable_status: number;
  waiting_list_status: number;
  taken_spots: number[];
};

export type PaymentPack = {
  id: number;
  name: string;
  price: number;
  base_price: number;
  tax: string;
  credits: number | null;
  unlimited: boolean;
  nb_consumer_payment_packs: number;
  max_bookings_per_day: number | null;
  max_bookings_per_week: number | null;
  max_bookings_per_month: number | null;
  max_purchase_per_member: number | null;
  expiration_days_before_first_use: number;
  theorical_margin_value: number;
  validity_daterange?: string;
  duration_days?: number;
  duration_months?: number;
  duration_years?: number;
  disabled: boolean;
  start_date_method: number;
  manager_only: boolean;
  new_member_only: boolean;
  company: number;
  SCTS: Array<number>;
  metaActivities: Array<number>;

  editable: boolean;
  establishments: Array<number>;
  categories: Array<number>;
  barcode: string;
  onsite_payment_available: boolean;
  full_vod_access: boolean;
  only_vod_access: boolean;
  allow_guest_pass: boolean;

  penatly_active: boolean;
  penalty_nd_late_cancellations: number;
  penalty_nb_days: number;
  penalty_kind: number;
  penalty_days_blocked: number;
  penalty_account_value: number;
  start_on_first_user: boolean;
  notifications: Array<number>;
  whitelist_tags: Array<number>;
  blacklist_tags: Array<number>;
};

export type ContractWithPaymentPack = {
  id: number;
  company: number;
  name: string;
  description: string;
  contract: string;
  manage_only: boolean;
  auto_renewal: boolean;
  tax: string;
  flat_fee: number;
  recurrent_price: number;
  nb_interval: number;
  disabled: boolean;
  interval: 'month' | 'week';
  recurrence_basis: number;
  payment_pack?: PaymentPack;
  private_pass?: PrivatePass;
  payment_combo?: PaymentCombo;
  allPaymentPacks?: Array<PaymentPack>;
};

export type PaymentComboItem<T> = {
  id: number;
  price: number;
  name: string;
  quantity: number;
  data: T;
};

export type PrivatePass = {
  id: number;
  name: string;
  credits: number;
  price: number;
  tax: number;
  private_services: number[];
  manager_only: boolean;
  available: boolean;
  duration_days: number;
  duration_months: number;
  duration_years: number;
  available_payment_method_identifiers: number[];
  full_vod_access: boolean;
  editable: boolean;
  expiration_days_before_first_use: number;
  start_date_method: number;
  new_member_only: boolean;
  company: number;
};

export type ShopItem = {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  tva: number;
  price: number;
  cover: string;
  company: number;
  unlimited_provisions: boolean;
  subshop: number;
  marketplace_enabled: boolean;
  is_deliverable: boolean;
  onsite_payment_available: boolean;
};

export type PaymentCombo = {
  id: number;
  name: string;
  description: string;
  price: number;
  tax: number;
  company: number;
  available: boolean;
  manager_only: boolean;
  date_created: string;
  payment_packs: Array<PaymentComboItem<PaymentPack>>;
  shop_items: Array<PaymentComboItem<ShopItem>>;
  private_passes: Array<PaymentComboItem<PrivatePass>>;
  max_purchase_per_member: number | null;
  barcode: string;
  available_payment_method_identifier: Array<number>;
  new_member_only: boolean;
};

export type SelectedPack = {
  consumerPaymentPack?: ConsumerPaymentPack<PaymentPack> | null;
  paymentPackCombo?: PaymentCombo | null;
  paymentPack?: PaymentPack | null;
};

export type OfferConstraint = {
  credit: number;
  minDate?: string;
  maxDate?: string;
  mustAllowBookingForGuest?: boolean;
};

export type MaxoutInfo = null | {
  period: 'day' | 'week' | 'month';
  nb: number;
};

export type MaxoutData = {
  exceedsBookingMaxout: boolean;
  maxoutInfo: MaxoutInfo;
};

export type PaymentPackWithMaxoutData = PaymentPack & MaxoutData;

export type PaymentComboWithMaxoutData = PaymentCombo & MaxoutData;

export type ContractwithPaymentPackWithMaxoutData = ContractWithPaymentPack &
  MaxoutData;

export type ConsumerPaymentPackWithMaxoutData =
  ConsumerPaymentPack<PaymentPack> & MaxoutData;
