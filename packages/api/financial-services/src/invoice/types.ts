import { BUYABLE_IDENTIFIERS, INVOICE_STATUSES } from "./constants";

export type BuyableItemIdentifier =
  (typeof BUYABLE_IDENTIFIERS)[keyof typeof BUYABLE_IDENTIFIERS];

export type InvoiceStatus =
  (typeof INVOICE_STATUSES)[keyof typeof INVOICE_STATUSES];

type InvoiceDetailsPayment = {
  uuid: string;
  id: number;
  price: string;
  payment_received: boolean;
  payment_method: number;
  payment_note: string;
  invoice: string;
  invoice_public_identifier: string;
  stripe_charge_id: string;
  date: string;
  reverted: boolean;
  is_method_editable: boolean;
  is_returnable: boolean;
  transaction_fee: string;
  payment_engine: number;
  is_v2: boolean;
  is_processing: boolean;
  returned_amount: string;
};

type InvoiceDetailsInvoiceItem = {
  id: number;
  price: string;
  total_price_notax: string;
  total_price: string;
  invoice: string;
  voucher: string;
  object_id: number;
  content_type: number;
  subtitle: string;
  name: string;
  reverted: boolean;
  incremental_consumer_giftcard_identifier?: string | null;
  consumer_giftcard_kind?: string | null;
  voucher_reasons?: string[];
};

export type FetchInvoiceResponse = {
  uuid: string;
  invoice_legal_identifier: string | null;
  invoice_type: number;
  date: string;
  member: number;
  voucher: string;
  price_due: string;
  price_payed: string;
  fully_payed: boolean;
  payments: InvoiceDetailsPayment[];
  invoice_items: InvoiceDetailsInvoiceItem[];
  is_finalized: boolean;
  stripe_invoice_pdf: string | null;
  reverted: boolean;
  plannedinvoice: number;
  billing_plan: number | null;
  is_v2: boolean;
  is_draft: boolean;
  amount_due_cts: number;
  amount_paid_cts: number;
  reverse_invoices: string[];
  source_invoice: string | null;
  custom_footer: string;
  establishment: number | null;
  establishment_billing_group: number | null;
  quickbooks_metadata: object;
  is_quick_invoice: boolean | null;
};

export type ApplyGiftcardOnInvoiceRequest = {
  invoiceId: string;
  consumer_giftcard_id: number;
  amount: number;
};

export type ScheduleInvoicePaymentRequest = {
  invoiceId: string;
  interval: string;
  nb_interval: number;
  recurrence_basis: number;
  anchor_date?: string;
  payment_method: number;
  payment_method_id: string | null;
  payment_method_identifier: number;
};

export type ScheduleInvoicePaymentResponse = {
  id: number;
  date_created: string;
  future_date: string;
  invoice: string;
  amount_cts: string;
  payment_engine: number;
  payment_method_identifier: number;
  _payment_backend_method_id: string;
  status: number;
  error_recoverable_manually: boolean;
  recoverable_error_type: string | null;
  processing: boolean;
  next_retry_date: string | null;
  nb_retries: number;
};
