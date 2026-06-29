import type { SavedPaymentMethod } from "@bsport/api-financial-services/payment-method";

import { getSavedPaymentMethodLogoType } from "#src/components/financial-services/payment-method-logo";

import type {
  SavedPaymentMethodDisplay,
  SavedPaymentMethodTypeLabelKey,
} from "./types";

/**
 * Returns the canonical masked identifier for a saved payment method.
 * Strips all non-digit characters first, then masks with the last 4 digits.
 * Cards use the full PAN mask `**** **** **** XXXX`; other methods use `****XXXX`.
 * Falls back to the raw `readable_identifier` when no digits are present.
 */
export const getMaskedPaymentMethodIdentifier = (
  paymentMethod: SavedPaymentMethod,
): string => {
  const identifier = paymentMethod.readable_identifier.trim();
  const identifierDigits = identifier.replace(/[^0-9]/g, "");

  if (!identifierDigits) return identifier;

  const lastFour = identifierDigits.slice(-4);

  return paymentMethod.type === "card"
    ? `**** **** **** ${lastFour}`
    : `****${lastFour}`;
};

/**
 * Normalizes and returns the expiration date for a card payment method.
 * Formats raw `additional_info` into `MM/YY`. Returns `undefined` for
 * non-card methods or when the value is absent.
 */
export const getPaymentMethodExpiry = (
  paymentMethod: SavedPaymentMethod,
): string | undefined => {
  if (paymentMethod.type !== "card") return undefined;

  const value = paymentMethod.additional_info.trim();
  if (!value) return undefined;

  const match = value.match(/^(\d{1,2})\s*\/\s*(\d{2}|\d{4})$/);
  if (!match) return value;

  const [, month, year] = match;
  const normalizedMonth = month.padStart(2, "0");
  const normalizedYear = year.length === 4 ? year.slice(-2) : year;

  return `${normalizedMonth}/${normalizedYear}`;
};

/** Resolves the i18n label key for a saved payment method's type. */
export const getSavedPaymentMethodTypeLabelKey = (
  paymentMethod: SavedPaymentMethod,
): SavedPaymentMethodTypeLabelKey => {
  switch (paymentMethod.type) {
    case "card":
      return "paymentMethod.card";
    case "sepa_debit":
      return "paymentMethod.sepaDebit";
    case "bacs_debit":
      return "paymentMethod.bacsDebit";
  }
};

/**
 * Builds the full presentation model for a saved payment method.
 *
 * Single entry point for UIs (selector rows, summary cards, …) so each consumer
 * renders from one normalized object instead of re-deriving logo/identifier/
 * expiry/label independently. Translation stays caller-side via `typeLabelKey`.
 */
export const getSavedPaymentMethodDisplay = (
  paymentMethod: SavedPaymentMethod,
): SavedPaymentMethodDisplay => {
  const maskedIdentifier = getMaskedPaymentMethodIdentifier(paymentMethod);

  return {
    logoType: getSavedPaymentMethodLogoType(paymentMethod),
    maskedIdentifier,
    hasMaskedDigits:
      /^\*{4}\d{4}$/.test(maskedIdentifier) ||
      /^(\*{4} ){3}\d{4}$/.test(maskedIdentifier),
    expiry: getPaymentMethodExpiry(paymentMethod),
    typeLabelKey: getSavedPaymentMethodTypeLabelKey(paymentMethod),
  };
};
