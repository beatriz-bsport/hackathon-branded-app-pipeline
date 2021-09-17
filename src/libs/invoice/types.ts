import { Payment } from './payment/types';
import { InvoiceItem } from './invoice-item/types';

export type Invoice = {
  payments: Array<Payment>;
  invoice_items: Array<InvoiceItem>;
  voucher: number;
  member: number;
  memberName: string;
  date: string;
  uuid: string;
  is_finalized: boolean;
  stripe_invoice_pdf?: string;
  fully_payed: string;
  price_due: string;
  price_payed: string;
  reverted: boolean;
  amount_due_cts: string;
  amount_paid_cts: string;
};

export type PlannedPaymentEvent = {
  id: number;
  date_created: string;
  future_date: string;
  invoice: string;
  amount_cts: string;
  payment_engine: number;
  payment_method_identifier: number;
  _payment_backend_method_id: string;
  status: number;
};

export type PaymentGroup = {
  id: number;
  member: number;
  basket: string;
  payment_method_identifier: number;
  client_secret: string;
  price_cts: number;
  currency: string;
  status: number;
};
