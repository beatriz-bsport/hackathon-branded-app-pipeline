// @flow

export type Alerting = {
  company: number,
  silenced_at: ?string,
  id: number,
  alert_kind: number,
  data: {},
};

export type UnevenInvoiceAlerting = {
  ...Alerting,
  data: {
    uuid: string,
    price_payed: string,
    price_due: string,
    date_invoice: string,
    actions: ['equilibrate'],
  },
};

export type NewOrderAlerting = {
  ...Alerting,
  data: {
    order: string,
    price: string,
    member: number,
    name: string,
    actions: ['finalize'],
  },
};
