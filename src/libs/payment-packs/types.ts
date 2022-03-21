import Immutable from 'seamless-immutable';
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

export type PaymentPack<LPP = number | null> = {
  id: number;
  name: string;
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
  categories: Array<number>;
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
  start_on_first_user: boolean;
  notifications: Array<number>;
  whitelist_tags: Array<number>;
  blacklist_tags: Array<number>;
  template_instance: number;
  linked_private_pass: LPP;
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
  notification: ErrorAndLoading & {
    itemsById: { [id: number]: any }; // deprecate anyway
    loading: false;
    error: null;
    create: ErrorAndLoading;
    delete: ErrorAndLoading;
    update: {
      id: null | number;
      error: Error | null;
    };
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

export type PaymentPackCategoryWithPacks = PaymentPackCategory & {
  packs: Array<PaymentPack>;
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
  penalty_active?: boolean;
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
};
