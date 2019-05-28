// @flow

export type PaymentItemData = {
  price: number,
  payment_method: number,
  payment_note: ?string,
  payment_received: boolean,
  stripe_charge_id: ?string,
};

export type PaymentItem = {
  uuid: string,
  price: string,
  payment_method: number,
  payment_received: boolean,
  payment_note: string,
  invoice: string,
  stripe_charge_id: ?string,
  date: string,
  reverted: boolean,
  is_method_editable: boolean,
};

export type InvoiceDataFront = {
  paymentItems: Array<PaymentItemData>,
  offerIds: Array<number>,
  paymentPackIds: Array<number>,
  voucher: ?number,
  date: string,
};
