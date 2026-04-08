/**
 * Normalizes the company theme `pass_credit_factor` to a safe divisor (defaults to 1).
 */
export const normalizePassCreditFactor = (
  raw: number | undefined | null,
): number => {
  if (raw == null || isNaN(raw)) {
    return 1;
  }
  return raw;
};

/**
 * Calculates the value of credits divided by the credit factor.
 */
export const getCreditsDividedValue = (
  credits: number,
  creditFactor: number,
): number => {
  if (creditFactor === 0) {
    return credits || 0;
  }

  return (credits || 0) / creditFactor;
};

/**
 * Divides the given credits by the credit factor and formats the result based on decimal precision.
 * Returns a string formatted based on its decimal precision:
 * - If the divided value is an integer, the value itself is returned.
 * - If the divided value has only one decimal, it is returned with one decimal place.
 * - If the divided value has two or more decimals, it is returned with two decimal places.
 */
export const getCreditsDividedDisplay = (
  credits: number,
  creditFactor: number,
  locale: string = "en",
): string => {
  const valueDivided = getCreditsDividedValue(credits, creditFactor);

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(valueDivided);
};
