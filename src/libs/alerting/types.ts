export type AlertGroup = {
  results: Array<Alerting>;
  loading: boolean;
  error?: Error;
  next?: number;
  count: number;
  alert_kind: number;
};

export type Alerting = {
  company: number;
  silenced_at?: string;
  id: number;
  alert_kind: number;
  data: any;
};

export type UnevenInvoiceAlerting = Alerting & {
  data: {
    uuid: string,
    price_payed: string,
    price_due: string,
    date_invoice: string,
    actions: ['equilibrate'],
  },
};

export type NewOrderAlerting = Alerting &{
  data: {
    order: string,
    price: string,
    member: number,
    name: string,
    actions: ['finalize'],
  },
};

// TODO TYPES
export type AlertingState = {
  items_by_kind: any, // TODO CHECK THIS
  items_processing: any[], // TODO CHECK THIS
  loading: boolean,
  error?: Error,
}
