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
  ending_date: string,
  starting_date: string,
  available_credits: number,
  date_bought: string,
  payment_pack_id: string,
};
