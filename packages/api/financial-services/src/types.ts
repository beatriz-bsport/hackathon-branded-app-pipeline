/**
 * Supported payment method identifiers (e.g. from Stripe or balance transaction APIs).
 * Use this type when you need to type a payment method key.
 */
export type PaymentMethodType =
  | "card"
  | "sepa_debit"
  | "bacs_debit"
  | "twint"
  | "apple_pay"
  | "google_pay"
  | "bancontact"
  | "ideal";
