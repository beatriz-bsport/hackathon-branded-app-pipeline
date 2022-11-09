export type PaymentMethod = {
  type: string;
  id: string;
  readable_identifier: string;
  brand: string;
  payment_backend_identifier: number;
  additional_info: string;
};

export type PaymentConfigData = {
  payment_method: number;
  payment_method_id: string | null;
};

export type Payout = {
  date_created: string;
  status: number;
  payments: Array<any>;
  amount_cts: number;
  company: number;
  id: number;
  readable_identifier: string;
  amount_cts_from_previous_included_payouts: number;
  is_included_in_payout?: {
    id: number;
    date_created: string;
    readable_identifier: string;
  };
};

export type PaymentInstalmentData = {
  nb_interval: number;
  recurrence_basis: number;
  interval: string;
  anchor_date: string;
};

export type IntervalType = 'month' | 'week' | 'year' | 'day';

export type StripeSetupIntentResponse = {
  setupIntent: {
    payment_method_id: string;
  };
};
