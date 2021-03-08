export type PaymentMethod = {
  type: string;
  id: string;
  readable_identifier: string;
  brand: string;
  payment_backend_identifier: number;
  additional_info: string;
};

export type Payout = {
  date_created: string;
  status: number;
  payments: Array<any>;
  amount_cts: number;
  company: number;
  id: number;
  readable_identifier: string;
};
