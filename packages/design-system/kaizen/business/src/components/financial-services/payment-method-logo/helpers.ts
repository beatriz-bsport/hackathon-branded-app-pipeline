import type { SavedPaymentMethod } from "@bsport/api-financial-services/payment-method";

import {
  PAYMENT_METHOD_LOGO_TYPES,
  type PaymentMethodLogoType,
} from "./payment-method-logo";

const PAYMENT_METHOD_LOGO_TYPE_SET = new Set<string>(PAYMENT_METHOD_LOGO_TYPES);

/** Type guard narrowing an arbitrary string to a supported logo identifier. */
export const isPaymentMethodLogoType = (
  value: string,
): value is PaymentMethodLogoType => PAYMENT_METHOD_LOGO_TYPE_SET.has(value);

/**
 * Maps an API saved payment method to the matching `PaymentMethodLogo` `type`.
 *
 * Card methods resolve via their (display) brand; SEPA/BACS resolve via their
 * method type. Returns `undefined` when no supported logo matches — callers
 * should omit the logo rather than render the wrong brand.
 */
export const getSavedPaymentMethodLogoType = (
  paymentMethod: SavedPaymentMethod,
): PaymentMethodLogoType | undefined => {
  switch (paymentMethod.type) {
    case "card": {
      const brand = (
        paymentMethod.display_brand ??
        paymentMethod.brand ??
        ""
      ).toLowerCase();

      return isPaymentMethodLogoType(brand) ? brand : undefined;
    }
    case "sepa_debit":
    case "bacs_debit":
      return paymentMethod.type;
    default:
      return undefined;
  }
};
