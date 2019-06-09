// @flow
//
import type { Payment } from './payment/types';
import type { InvoiceItem } from './invoice-item/types';

export type Invoice = {
  payments: Array<Payment>,
  invoice_items: Array<InvoiceItem>,
  voucher: number,
  member: number,
  memberName: string,
  date: string,
  uuid: string,
  is_finalized: boolean,
  stripe_invoice_pdf: ?string,
  fully_payed: string,
  price_due: string,
  price_payed: string,
  reverted: boolean,
  memberName: string,
};

export type InvoiceDataFront = {
  paymentItems: Array<PaymentItemData>,
  offerIds: Array<number>,
  paymentPackIds: Array<number>,
  voucher: ?number,
  date: string,
};
