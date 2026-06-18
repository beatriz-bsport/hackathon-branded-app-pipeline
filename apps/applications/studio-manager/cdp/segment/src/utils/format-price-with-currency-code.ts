import { getCurrencyCode } from "@bsport/currency";

/**
 * Uppercase ISO currency code for the current studio (e.g. "EUR").
 */
export const getCurrencyCodeSuffix = (): string =>
  getCurrencyCode().toUpperCase();
