export type PaymentMethod = {
  type: string;
  id: string;
  readable_identifier: string;
  brand: string;
  payment_backend_identifier: number;
  additional_info: string;
  is_default: boolean;
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
  automatic: boolean;
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

export type Payment = {
  uuid: string;
  price: number;
  id: number;
  payment_received: boolean;
  payment_method: number;
  payment_note: string;
  invoice: number;
  stripe_charge_id: string;
  date: string;
  reverted: boolean;
  is_method_editable: boolean;
  is_returnable: boolean;
  transaction_fee: number;
  payment_engine: number;
  is_v2: boolean;
  is_processing: boolean;
  returned_amount: number;
};

export enum TermsAndConditionType {
  GENERAL_TERMS_OF_USE = 'generalTermsOfUse',
  TERMS_AND_CONDITIONS = 'theTermsAndConditions',
  WAIVER = 'waiver',
}

export type PaymentGroup = {
  id: number;
  member: number;
  invoice: number | null;
  basket: number | null;
  payment_method_identifier: number;
  client_secret: string;
  price_cts: number;
  currency: string;
  status: number;
};
