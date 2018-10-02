// @flow
export type PerformanceCalculationRule = {
  pricePerOffer: number,
  pricePerAdditionalBooking: ?number,
  bookingThreshold: ?number,
  includeBonusOnOversizing: boolean,
  dateStart: Object,
  dateEnd: Object,
};

export type InvoiceFormData = {};

export type PaymentFormData = {
  status: boolean,
  paymentMethod: number,
  price: number,
  paymentInfoExtra: string,
};
