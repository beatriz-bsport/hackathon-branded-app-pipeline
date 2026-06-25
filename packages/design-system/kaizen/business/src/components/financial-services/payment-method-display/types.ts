import type { PaymentMethodLogoType } from "#src/components/financial-services/payment-method-logo";

/**
 * i18n keys (under the `financial-services` namespace) for a saved payment
 * method's type label. Returned as a key — never a translated string — so the
 * helpers stay pure and the consuming app owns translation.
 */
export type SavedPaymentMethodTypeLabelKey =
  | "paymentMethod.card"
  | "paymentMethod.sepaDebit"
  | "paymentMethod.bacsDebit";

/**
 * Normalized, presentation-ready view of a saved payment method.
 * Aggregates every derived value a UI needs to render a method (logo, masked
 * identifier, expiry, type label) so consumers stop re-deriving them ad hoc.
 */
export type SavedPaymentMethodDisplay = {
  /** Logo asset to render, when the method maps to a supported one. */
  logoType?: PaymentMethodLogoType;
  /**
   * Masked identifier (`****1234`) when digits are available, otherwise the
   * raw `readable_identifier`.
   */
  maskedIdentifier: string;
  /** `true` when `maskedIdentifier` is an actual `****XXXX` mask (vs. raw fallback). */
  hasMaskedDigits: boolean;
  /** Normalized `MM/YY` expiry for card methods, otherwise `undefined`. */
  expiry?: string;
  /** i18n key for the method's type label. */
  typeLabelKey: SavedPaymentMethodTypeLabelKey;
};
