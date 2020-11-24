// @flow

export type ConsumerPaymentPackExtension = {
  note: string,
  date_created: string,
  nb_days: number,
  consumer_payment_pack: number,
  id: number,
};

export type ConsumerPaymentPack = {
  id: number,
  bookings_this_week: number,
  bookings_this_month: number,
  ending_date: string,
  starting_date: string,
  available_credits: number,
  date_bought: string,
  payment_pack_id: string,
  disabled: boolean,
  penalty_disabled_from: string | null,
  penalty_disabled_until: string | null,
};

export type ConsumerPaymentPackPenalty = {
  id: number,
  date_created: string,
  penalty_kind: number,
};
