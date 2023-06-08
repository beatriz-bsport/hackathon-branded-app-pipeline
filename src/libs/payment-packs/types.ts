// @ts-nocheck
import Immutable from 'seamless-immutable';
import { Moment } from 'moment-timezone';
import { ErrorAndLoading } from '../../state/types';
import { Company } from '../company/types';
import type { CompatiblePrivateService } from '#libs/private-service/types';

export type ConsumerPaymentPackExtension = {
  note: string;
  date_created: string;
  nb_days: number;
  consumer_payment_pack: number;
  id: number;
};

export type PaymentPackFilters<FilterValue = boolean> = {
  is_expired?: FilterValue;
  is_valid_today?: FilterValue;
  reverted?: FilterValue;
  has_credit_left?: FilterValue;
};

export type PaymentPackFiltersOpener = {
  expiration?: boolean;
  reverted?: boolean;
  credit_left?: boolean;
};

export type PaymentPack<LPP = number | null, PPCategories = Array<number>> = {
  id: number;
  name: string;
  description?: string;
  price: number;
  base_price: number;
  tax: number;
  credits: number | null;
  unlimited: boolean;
  nb_consumer_payment_packs: number;
  max_bookings_per_day: number | null;
  max_bookings_per_week: number | null;
  max_bookings_per_month: number | null;
  max_purchase_per_member: number | null;
  expiration_days_before_first_use: number;
  theorical_margin_value: number;
  validity_daterange?: {
    upper: string;
    lower: string;
  };
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
  category: number;
  ordering_in_category: number;

  editable: boolean;
  establishments: Array<number>;
  categories: PPCategories;
  barcode: string;
  onsite_payment_available: boolean;
  full_vod_access: boolean;
  only_vod_access: boolean;

  penalty_active: boolean;
  penalty_nb_late_cancellations: number;
  penalty_nb_days: number;
  penalty_kind: number;
  penalty_days_blocked: number;
  penalty_account_value: number;

  no_show_penalty_active: boolean;
  no_show_penalty_threshold: number;
  no_show_penalty_time_window_days: number;
  no_show_penalty_kind: number;
  no_show_penalty_days_blocked: number;
  no_show_penalty_amount: number;

  start_on_first_user: boolean;
  notifications: Array<number>;
  whitelist_tags: Array<number>;
  blacklist_tags: Array<number>;
  template_instance: number;
  linked_private_pass: LPP;
  allow_guest_pass?: boolean;
  is_universal_pass: boolean;
  is_usable_by_staff: boolean;

  applies_for_payroll: boolean;
};

export type ConsumerPaymentPack = {
  id: number;
  bookings_this_week: number;
  ending_date: string;
  starting_date: string;
  available_credits: number;
  date_bought: string;
  payment_pack_id: string;
  linked_private_consumer_pass: number | null;
};

export type PaymentPackTemplateInstance = {
  tax: number | null;
  id: number;
  price: number | null;
  disabled: boolean;
  company: number;
  payment_pack: number;
  theorical_margin_value: number;
  payment_pack_template: number;
};

export type PaymentPackTemplateAPI = {
  id: number;
  name: string;
  manager_only: boolean;
  credits: number;
  duration_days: number;
  duration_months: number;
  duration_years: number;
  validity_daterange: null | {
    upper: string;
    lower: string;
  };
  disabled: boolean;
  tax: string;
  price: number;
  franchisor: number | null;
  payment_pack_template_instances: Array<PaymentPackTemplateInstance>;
  theorical_margin_value: number;
  start_date_method: number;
  expiration_days_before_first_use: number;
  unlimited: boolean;
  max_bookings_per_day: null | number;
  max_bookings_per_week: null | number;
  max_bookings_per_month: null | number;
  max_purchase_per_member: null | number;
  only_vod_access: boolean;
  full_vod_access: boolean;
  is_usable_by_staff: boolean;
};

export type PaymentPackTemplate = PaymentPackTemplateAPI & {
  companies: Array<Company>;
};

export type PaymentPackCategory = {
  id: number;
  name: string;
  company_id: number;
  category_ordering: number;
};

export type PaymentPackState = Immutable.Immutable<{
  updatingConsumerPacks: Array<ConsumerPaymentPack>;
  updatingPaymentPacks: Array<number>;
  createOrUpdatePending: boolean;
  loading: boolean;
  error: boolean;
  errorMsg: string;
  archivationWarning: { [id: number]: { used_in_combo: boolean } };
  paymentPackTemplate: {
    allIds: Array<number>;
    byId: { [id: number]: PaymentPackTemplateAPI };
    loading: boolean;
    error: null | Error;
  };
  byActivity: ErrorAndLoading & {
    allIds: Array<number>;
    page: number;
    count: number;
  };
  forBooking: ErrorAndLoading & {
    allIds: Array<number>;
  };
  scaleCredit: ErrorAndLoading;
  byId: { [id: number]: PaymentPack };
  allIds: Array<number>;
  compatible: ErrorAndLoading & {
    allIds: Array<number>;
  };
  paymentPackCategory: ErrorAndLoading & {
    byId: { [id: number]: PaymentPackCategory };
    allIds: Array<number>;
    upsert: ErrorAndLoading;
  };
}>;

export const actionTypes = {
  HAS_FETCHED_ALL_PAYMENT_PACKS: 'HAS_FETCHED_ALL_PAYMENT_PACKS_SUCCESS',
  START_FETCH_ALL_PAYMENT_PACKS: 'START_FETCH_ALL_PAYMENT_PACKS',
  ERROR_FETCHING_ALL_PAYMENT_PACKS: 'ERROR_FETCHING_ALL_PAYMENT_PACKS_ERROR',

  UPDATING_CONSUMER_PACK_CREDIT: 'UPDATING_CONSUMER_PACK_CREDIT',
  UPDATE_CONSUMER_PACK_CREDIT_DONE: 'UPDATE_CONSUMER_PACK_CREDIT_DONE_SUCCESS',
  UPDATE_CONSUMER_PACK_CREDIT_FAILED:
    'UPDATE_CONSUMER_PACK_CREDIT_FAILED_ERROR',

  PAYMENT_PACK_PATCH_START: 'PAYMENT_PACK_PATCH_START',
  PAYMENT_PACK_PATCH_SUCCESS: 'PAYMENT_PACK_PATCH_SUCCESS',
  PAYMENT_PACK_PATCH_ERROR: 'PAYMENT_PACK_PATCH_ERROR',

  PAYMENT_PACK_CREATEORUPDATE_START: 'PAYMENT_PACK_CREATEORUPDATE_START',
  PAYMENT_PACK_CREATEORUPDATE_SUCCESS: 'PAYMENT_PACK_CREATEORUPDATE_SUCCESS',
  PAYMENT_PACK_CREATEORUPDATE_FAIL: 'PAYMENT_PACK_CREATEORUPDATE_FAIL_ERROR',

  START_FETCH_ACTIVITY_COMPATIBLE_PAYMENT_PACKS:
    'FETCH_ACTIVITY_COMPATIBLE_PAYMENT_PACKS_START',
  ERROR_FETCHING_ACTIVITY_COMPATIBLE_PAYMENT_PACKS:
    'ERROR_FETCHING_ACTIVITY_COMPATIBLE_PAYMENT_PACKS_ERROR',
  HAS_FETCHED_ACTIVITY_COMPATIBLE_PAYMENT_PACKS:
    'HAS_FETCHED_ACTIVITY_COMPATIBLE_PAYMENT_PACKS_SUCCESS',
  RESET_ACTIVITY_COMPATIBLE_PAYMENT_PACKS:
    'RESET_ACTIVITY_COMPATIBLE_PAYMENT_PACKS',
};

export type PaymentPackCategoryWithPacks<PP = PaymentPack> =
  PaymentPackCategory & {
    packs: Array<PP>;
  };

export type PaymentPackFormValues<LPP = number> = {
  id?: number;
  name?: string | null;
  category?: number;
  price?: number;
  tax?: number;
  credit_number?: 'limited' | 'unlimited';
  credits?: number;
  theorical_margin_value?: number;
  apply_penalties?: boolean;
  penalty_active?: boolean;
  no_show_penalty_active?: boolean;
  validity?: 'givenNumber' | 'slot';
  lower_date?: string;
  upper_date?: string;
  validity_daterange?: {
    lower?: string;
    upper?: string;
  };
  duration_days?: number;
  duration_months?: number;
  duration_years?: number;
  start_date_method?: 'billing' | 'booking' | 'attendance' | number;
  expiration_days_before_first_use?: number;
  penalty_nb_late_cancellations?: number;
  penalty_nb_days?: number;
  penalty_kind?: 'block' | 'account' | number;
  penalty_days_blocked?: number;
  penalty_account_value?: number;
  no_show_penalty_threshold?: number;
  no_show_penalty_time_window_days?: number;
  no_show_penalty_kind?: 'block' | 'account' | number;
  no_show_penalty_days_blocked?: number;
  no_show_penalty_amount?: number;
  max_bookings_per_day?: number;
  max_bookings_per_week?: number;
  max_bookings_per_month?: number;
  max_purchase_per_member?: number;
  new_member_only?: boolean;
  manager_only?: boolean;
  onsite_payment_available?: boolean;
  categories?: Array<number>;
  establishments?: Array<number>;
  metaActivities?: Array<number>;
  full_vod_access?: boolean;
  only_vod_access?: boolean;
  whitelist_tags?: Array<number>;
  blacklist_tags?: Array<number>;
  is_universal_pass: boolean;
  linked_private_pass?: LPP;
  linked_private_pass_compatibility: Array<CompatiblePrivateService>;
  allow_guest_pass?: boolean;
  unusable_by_staff?: boolean;
  expiration_date: string;
  off_peak_schedule: OffPeakSchedule[];
};

export type OffPeakIsoWeekdays = {
  '1': boolean;
  '2': boolean;
  '3': boolean;
  '4': boolean;
  '5': boolean;
  '6': boolean;
  '7': boolean;
};

export type OffPeakSchedule = {
  timeSlots: Moment[][];
  recurrenceWeekDay?: OffPeakIsoWeekdays;
  slotDurationChoice: string;
};
// TODO: HARMONIZE PP and PPT FORM VALUES
export type PaymentPackTemplateFormValues = {
  id?: number;
  name?: string | null;
  price?: number;
  tax?: number;
  credit_number?: 'limited' | 'unlimited';
  credits?: number;
  theorical_margin_value?: number;
  apply_penalties?: boolean;
  penalty_active?: boolean;
  no_show_penalty_active?: boolean;
  validity?: 'givenNumber' | 'slot';
  lower_date?: string;
  upper_date?: string;
  validity_daterange?: {
    lower?: string;
    upper?: string;
  };
  duration_days?: number;
  duration_months?: number;
  duration_years?: number;
  start_date_method?: 'billing' | 'booking' | 'attendance' | number;
  expiration_days_before_first_use?: number;
  penalty_nb_late_cancellations?: number;
  penalty_nb_days?: number;
  penalty_kind?: 'block' | 'account' | number;
  penalty_days_blocked?: number;
  penalty_account_value?: number;
  penalty_mode_franchisor: number;
  no_show_penalty_threshold?: number;
  no_show_penalty_time_window_days?: number;
  no_show_penalty_kind?: 'block' | 'account' | number;
  no_show_penalty_days_blocked?: number;
  no_show_penalty_amount?: number;
  no_show_penalty_mode_franchisor: number;
  max_bookings_per_day?: number;
  max_bookings_per_week?: number;
  max_bookings_per_month?: number;
  max_purchase_per_member?: number;
  new_member_only?: boolean;
  manager_only?: boolean;
  onsite_payment_available?: boolean;
  categories?: Array<number>;
  establishments?: Array<number>;
  metaActivities?: Array<number>;
  full_vod_access?: boolean;
  only_vod_access?: boolean;
  whitelist_tags?: Array<number>;
  blacklist_tags?: Array<number>;
  is_universal_pass: boolean;
  linked_private_pass_compatibility: Array<CompatiblePrivateService>;
  allow_guest_pass?: boolean;
  unusable_by_staff?: boolean;
};
export type MaxoutData = {
  exceedsBookingMaxout: boolean;
  maxoutInfo: null | {
    period: 'day' | 'week' | 'month';
    nb: number;
  };
};
