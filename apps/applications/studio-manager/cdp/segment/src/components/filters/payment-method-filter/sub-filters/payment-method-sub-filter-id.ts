export const PAYMENT_METHOD_SUB_FILTER_IDS = {
  expirationDate: "expirationDate",
} as const;

export type PaymentMethodSubFilterId =
  (typeof PAYMENT_METHOD_SUB_FILTER_IDS)[keyof typeof PAYMENT_METHOD_SUB_FILTER_IDS];

export type PaymentMethodSubFilterField = "expirationDate";

export const paymentMethodSubFilterFieldMap: Record<
  PaymentMethodSubFilterId,
  PaymentMethodSubFilterField
> = {
  [PAYMENT_METHOD_SUB_FILTER_IDS.expirationDate]: "expirationDate",
};
