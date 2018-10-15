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

export type InvoiceFormData = {};

export type PaymentFormData = {
  status: boolean,
  paymentMethod: number,
  price: number,
  paymentInfoExtra: string,
};
