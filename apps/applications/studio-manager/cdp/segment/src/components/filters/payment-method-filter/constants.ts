/**
 * Radio `value` strings for the owns-payment-method field (Kaizen FormRadioGroup).
 */
export const OWNS_PAYMENT_METHOD = {
  has: "has",
  doesNotHave: "doesNotHave",
} as const;

export type OwnsPaymentMethodOption =
  (typeof OWNS_PAYMENT_METHOD)[keyof typeof OWNS_PAYMENT_METHOD];

/**
 * Maps the UI radio option to the API `owns_payment_method` boolean.
 */
export const ownsPaymentMethodToApi = (
  option: OwnsPaymentMethodOption,
): boolean => option === OWNS_PAYMENT_METHOD.has;

/**
 * Maps the API boolean to the UI radio option.
 */
export const ownsPaymentMethodFromApi = (
  ownsPaymentMethod: boolean,
): OwnsPaymentMethodOption =>
  ownsPaymentMethod ? OWNS_PAYMENT_METHOD.has : OWNS_PAYMENT_METHOD.doesNotHave;
