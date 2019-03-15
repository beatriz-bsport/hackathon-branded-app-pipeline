// @flow

export type PaymentItemData = {
  price: number,
  payment_method: number,
  payment_note: ?string,
  payment_received: boolean,
  stripe_charge_id: ?string,
};

export type InvoiceDataFront = {
  paymentItems: Array<PaymentItemData>,
  offerIds: Array<number>,
  paymentPackIds: Array<number>,
  voucher: ?number,
};
