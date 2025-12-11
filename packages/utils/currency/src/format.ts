import { getCurrencyDisplay } from "#src/storage";

/**
 * Formats a price with the given currency symbol.
 * Handles negative values and symbol placement for various currencies.
 *
 * @param price - The price to format.
 * @param symbol - The currency symbol to use (e.g., "€", "$").
 * @param isNegative - Optional flag to force negative formatting.
 * @returns The formatted price string (e.g., "12.50 €" or "$12.50").
 */
export const formatPriceWithCurrency = (
  price: number,
  symbol: string,
  isNegative = false,
): string => {
  const absolutePrice = Math.abs(price).toFixed(2);
  const negativeSign = price < 0 || isNegative ? "-" : "";

  // Special case for CHF: symbol before price with a space
  if (symbol === "CHF") {
    return `${negativeSign}${symbol}\u00A0${absolutePrice}`;
  }

  // List of symbols that should appear after the price
  const symbolAfter = ["€", "kr.", "sek", "nok", "dkk", "лв.", "RON"].includes(
    symbol,
  );

  return symbolAfter
    ? `${negativeSign}${absolutePrice}\u00A0${symbol}`
    : `${negativeSign}${symbol}${absolutePrice}`;
};

/**
 * Formats a price using the stored currency display symbol.
 * Handles negative values and symbol placement.
 *
 * @param price - The price to format.
 * @param isNegative - Optional flag to force negative formatting.
 * @returns The formatted price string with the stored currency symbol.
 */
export const getCurrencyDisplayWithPrice = (
  price: number,
  isNegative = false,
): string => {
  const display = getCurrencyDisplay();
  return formatPriceWithCurrency(price, display, isNegative);
};
