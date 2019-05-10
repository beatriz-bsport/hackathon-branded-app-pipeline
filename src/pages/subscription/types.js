// @flow

export type PlannedInvoice = {
  date: number,
  status: number,
  price: number,
  voucher: number,
  uuid: ?string,
};

export type Subscription = {
  id: number,
  name: string,
  member: number,
  nb_interval: number,
  trial_nb: number,
  recurrent_price: number,
  recurrent_voucher: number,
  canceled_at: string,
  has_ended: boolean,
  interval: 'month' | 'week',
  planned_invoices: Array<PlannedInvoice>,
};

export type SubscriptionData = {
  name: string,
  member: number,
  nb_interval: number,
  recurrent_price: number,
  trial_nb: number,
  interval: 'month' | 'week',
  recurrent_voucher: number,
  payment_pack: number,
};

export type SubscriptionState = {
  items: { [number]: Subscription },
  stop: {
    loading: boolean,
    error: ?Error,
  },
  detail: {
    loading: boolean,
    error: ?Error,
  },
};
