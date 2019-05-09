// @flow

export type ScheduledInvoice = {
  date: number,
  status: 'pending' | 'succeeded' | 'failed' | 'cancelled',
  price: number,
  invoice_items: Array<{ content_object: { id: number } }>,
};

export type Subscription = {
  id: number,
  member: number,
  name: string,
  nb_interval: number,
  billing_anchor: number,
  recurrent_price: number,
  interval: 'month' | 'week',
  invoices: Array<string>,
};

export type SubscriptionData = {
  member: number,
  name: string,
  nb_interval: number,
  billing_anchor: number,
  recurrent_price: number,
  interval: 'month' | 'week',
};
