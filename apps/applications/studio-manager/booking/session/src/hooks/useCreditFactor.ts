import { useMemo } from "react";

import { dataAccessLayer } from "@bsport/sm-backbone";

import { useTranslation } from "#src/utils/i18n";

/**
 * Calculates the value of credits divided by the credit factor.
 */
const getCreditsDividedValue = (
  credits: number,
  creditFactor: number,
): number => {
  if (creditFactor === 0) {
    return credits || 0;
  }

  return (credits || 0) / creditFactor;
};

/**
 * Divides the given credits by the credit factor and formats the result based on the decimal precision.
 * Returns a string formatted based on its decimal precision:
 * - If the divided value is an integer, the value itself is returned.
 * - If the divided value has only one decimal, it is returned with one decimal place.
 * - If the divided value has two or more decimals, it is returned with two decimal places.
 */
const getCreditsDividedDisplay = (
  credits: number,
  creditFactor: number,
  locale: string = "en",
): string => {
  const valueDivided = getCreditsDividedValue(credits, creditFactor);

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(valueDivided);
};

/**
 * Hook that provides credit factor from company theme and utility functions for credit calculations.
 *
 * @returns An object containing:
 * - creditFactor: The credit factor as a number (defaults to 1 if not configured)
 * - getCreditsDividedValue: Function to calculate credits divided by the factor
 * - getCreditsDividedDisplay: Function to format credits with proper decimal precision
 */
export const useCreditFactor = () => {
  const { i18n } = useTranslation("sessionCreation");
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const creditFactor = companyTheme?.pass_credit_factor;

  const normalizedCreditFactor =
    !creditFactor || isNaN(creditFactor) ? 1 : creditFactor;

  return useMemo(
    () => ({
      creditFactor: normalizedCreditFactor,
      getCreditsDividedValue: (credits: number) =>
        getCreditsDividedValue(credits, normalizedCreditFactor),
      getCreditsDividedDisplay: (credits: number) =>
        getCreditsDividedDisplay(
          credits,
          normalizedCreditFactor,
          i18n?.language,
        ),
    }),
    [normalizedCreditFactor, i18n?.language],
  );
};
