// @flow
export type BonusRule = {
  threshold: number,
  fixedBonus: number,
  variableBonus: number,
  id: number,
};

export type PerformanceCalculationRule = {
  pricePerOffer: number,
  dateStart: Object,
  dateEnd: Object,
  bonusRules: Array<BonusRule>,
};

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
