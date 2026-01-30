/**
 * Parses tax percentage from various possible formats in API responses.
 * Handles:
 * - String values (e.g., "20.4" -> 20.4)
 * - Number values (used directly)
 * - Objects with parsedValue property
 * - Multiple field names (tax, tva, tax_calculation)
 *
 * @param taxValue - The tax value from the API (string, number, or object with parsedValue)
 * @returns The tax percentage as a number, or 0 if invalid/missing
 */
export const parseTaxPercent = (
  taxValue: string | number | { parsedValue?: number } | null | undefined,
): number => {
  if (taxValue == null) {
    return 0;
  }

  // Handle number directly
  if (typeof taxValue === "number") {
    return Number.isFinite(taxValue) ? taxValue : 0;
  }

  // Handle object with parsedValue
  if (
    typeof taxValue === "object" &&
    taxValue.parsedValue != null &&
    typeof taxValue.parsedValue === "number"
  ) {
    return Number.isFinite(taxValue.parsedValue) ? taxValue.parsedValue : 0;
  }

  // Handle string
  if (typeof taxValue === "string") {
    const parsed = parseFloat(taxValue);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

/**
 * Parses tax percentage for pack items, which may have tax_calculation or tax fields.
 *
 * @param item - Pack item with potential tax_calculation and tax fields
 * @returns The tax percentage as a number, or 0 if invalid/missing
 */
export const parsePackTaxPercent = (item: {
  tax_calculation?: string | number | { parsedValue?: number } | null;
  tax?: string | null;
}): number => {
  // For packs, prefer tax_calculation if available
  if (item.tax_calculation != null) {
    const parsed = parseTaxPercent(item.tax_calculation);
    if (parsed > 0) {
      return parsed;
    }
  }

  // Fall back to tax field
  return parseTaxPercent(item.tax);
};
