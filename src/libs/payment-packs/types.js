// @flow

export type ConsumerPaymentPackExtension = {
  note: string,
  date_created: string,
  nb_days: number,
  consumer_payment_pack: number,
  id: number,
};

export type PaymentPack = {
  id: number,
  unlimited: boolean,
  name: string,
  credits: number,
  base_price: number,
  tax: string,
  company: { name: string },
  max_bookings_per_week: number,
  max_bookings_per_month: number,
  validity_daterange: ?{ upper: string, lower: string },
  duration_days: ?number,
  duration_months: ?number,
  duration_years: ?number,
  metaActivities: Array<number>,
  establishments: Array<number>,
  credits: ?number,
  categories: Array<number>,
  price: number,
  base_price: number,
  validity_daterange: ?string,
  nb_consumer_payment_packs: number,
  disabled: boolean,
  manager_only: boolean,
  new_member_only: boolean,
};

export type ConsumerPaymentPack = {
  id: number,
  bookings_this_week: number,
  ending_date: string,
  starting_date: string,
  available_credits: number,
  date_bought: string,
  payment_pack_id: string,
};

export type PaymentPackState = {
  all: Array<PaymentPack>,
  updatingConsumerPacks: Array<ConsumerPaymentPack>,
  updatingPaymentPacks: Array<number>,
  createOrUpdatePending: boolean,
  loading: boolean,
  error: boolean,
  errorMsg: string,
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
