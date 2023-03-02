import {
  REVERSE_ON_PAYMENT_METHOD,
  REVERSE_ON_DEBT,
  REVERSE_ON_NEW_PAYMENT_METHOD,
} from '@bsport/common/lib/master-data/payment-group';
import { PaymentItem } from './payment/types';
import { InvoiceItem } from './invoice-item/types';
import { UserRoleData } from '#libs/role/types';

export type Invoice<M = number> = {
  payments: Array<PaymentItem>;
  invoice_items: Array<InvoiceItem>;
  voucher: number;
  member: M;
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
  quickbooks_status: number;
  is_quick_invoice: boolean;
  invoice_type: number;
  reverse_invoices: Array<string>;
  is_v2: boolean;
  is_draft?: boolean;
  plannedinvoice: number;
  billing_plan: number;
  source_invoice: string;
  custom_footer: number;
  invoice_legal_identifier: string;
  establishment: number;
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
  error_recoverable_manually: boolean;
  recoverable_error_type: string;
  processing: boolean;
};

export type PaymentGroup = {
  id: number;
  member: number;
  invoice: string;
  basket: string;
  payment_method_identifier: number;
  client_secret: string;
  price_cts: number;
  currency: string;
  status: number;
};

export type BuyableItem = {
  buyable_item_id: number;
  buyable_item_identifier: number;
  voucher: number;
  price: number;
};

export type WithAuthor<T> = T & {
  author: UserRoleData;
};

export type InvoiceReverseMethod =
  | typeof REVERSE_ON_PAYMENT_METHOD
  | typeof REVERSE_ON_DEBT
  | typeof REVERSE_ON_NEW_PAYMENT_METHOD;

export type InvoiceAllowedReverseMethods = {
  [K in InvoiceReverseMethod]?: {
    allowed: boolean;
    error_code: number | null;
  };
};
