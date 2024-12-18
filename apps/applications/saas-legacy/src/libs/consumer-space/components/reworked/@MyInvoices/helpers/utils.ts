/**
 * Converts a price from base unit (cents) to standard unit (dollars, euros) and formats it to two decimal places.
 * @param priceCts The price value in cents to be converted.
 * @returns A string representation of the converted price in the standard unit.
 */
export const convertCtsToFullPrice = (priceCts: number) =>
  Math.max((priceCts || 0) / 100, 0).toFixed(2);
