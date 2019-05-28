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
