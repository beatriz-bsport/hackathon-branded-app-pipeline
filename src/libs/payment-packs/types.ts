export type ConsumerPaymentPackExtension = {
  note: string;
  date_created: string;
  nb_days: number;
  consumer_payment_pack: number;
  id: number;
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

  editable: boolean;
  establishments: Array<number>;
  categories: Array<number>;
  barcode: string;
  onsite_payment_available: boolean;
  full_vod_access: boolean;
  only_vod_access: boolean;

  penatly_active: boolean;
  penalty_nd_late_cancellations: number;
  penalty_nb_days: number;
  penalty_kind: number;
  penalty_days_blocked: number;
  penalty_account_value: number;
  start_on_first_user: boolean;
  notifications: Array<number>;
};

export type ConsumerPaymentPack = {
  id: number;
  bookings_this_week: number;
  ending_date: string;
  starting_date: string;
  available_credits: number;
  date_bought: string;
  payment_pack_id: string;
};

export type PaymentPackState = {
  all: Array<PaymentPack>;
  updatingConsumerPacks: Array<ConsumerPaymentPack>;
  updatingPaymentPacks: Array<number>;
  createOrUpdatePending: boolean;
  loading: boolean;
  error: boolean;
  errorMsg: string;
};

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

export type PaymentPackCategory = {
  id: number;
  name: string;
  company_id: number;
};

export type PaymentPackCategoryWithPacks = {
  id: number;
  name: string;
  company_id: number;
  publicPacks: Array<PaymentPack>;
  managerPacks: Array<PaymentPack>;
};
