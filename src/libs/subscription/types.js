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
  memberName: string,
  nb_interval: number,
  trial_nb: number,
  recurrent_price: number,
  recurrent_voucher: number,
  canceled_at: string,
  has_ended: boolean,
  interval: 'month' | 'week',
  date_created: string,
  planned_invoices: Array<PlannedInvoice>,
  payment_method: number,
  pauses: Array<SubscriptionPause>,
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
  first_billing_timestamp: number,
};

export type SubscriptionPause = {
  days: number,
  date_created: string,
  billing_plan: number,
  name: string,
};

export type SubscriptionState = {
  byId: { [number]: Subscription },
  createOrUpdate: { loading: boolean, error: ?Error },
  stop: {
    loading: boolean,
    error: ?Error,
  },
  detail: {
    loading: boolean,
    error: ?Error,
  },
  list: {
    loading: boolean,
    error: ?Error,
    allIds: Array<number>,
  },
  byMember: {
    loading: boolean,
    error: ?Error,
    allIds: Array<number>,
  },
  contract: {
    loading: boolean,
    error: ?Error,
    byId: { [number]: Contract },
    allIds: Array<number>,
    createOrUpdate: {
      loading: boolean,
      error: ?Error,
    },
    forBooking: {
      loading: boolean,
      error: null,
      allIds: Array<number>,
    },
    byMarketplace: {
      loading: boolean,
      error: ?Error,
      allIds: Array<number>,
    },
  },
};
