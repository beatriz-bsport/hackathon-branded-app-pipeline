// @flow

export type PaymentPack = {
  id: number,
  unlimited: boolean,
  name: string,
  credits: number,
  base_price: number,
  tax: string,
  company: { name: string },
  max_bookings_per_week: number,
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
