import { useMemo } from "react";

import { i18nInstance, useTranslation } from "#src/i18n";

import {
  getCreditsDividedDisplay,
  getCreditsDividedValue,
  normalizePassCreditFactor,
} from "./utils";

export type UseCreditFactorResult = {
  /** Effective credit factor (from theme, or 1). */
  creditFactor: number;
  getCreditsDividedValue: (credits: number) => number;
  getCreditsDividedDisplay: (credits: number) => string;
  getCreditsFieldLabel: () => string;
  getCreditsNotPriceWarningText: () => string;
};

/**
 * Credit factor from company theme (`pass_credit_factor`) with helpers for
 * numeric display, form copy, and warnings. Uses embedded `buyables` translations.
 *
 * @param passCreditFactor — Value from company theme (e.g. `useCompanyTheme()?.pass_credit_factor`).
 */
export const useCreditFactor = (
  passCreditFactor: number | undefined | null,
): UseCreditFactorResult => {
  const { t, i18n } = useTranslation("buyables", { i18n: i18nInstance });

  const creditFactor = normalizePassCreditFactor(passCreditFactor);

  return useMemo(() => {
    const dividedDisplay = (credits: number) =>
      getCreditsDividedDisplay(credits, creditFactor, i18n.language);

    return {
      creditFactor,
      getCreditsDividedValue: (credits: number) =>
        getCreditsDividedValue(credits, creditFactor),
      getCreditsDividedDisplay: dividedDisplay,
      getCreditsFieldLabel: () => t("creditFactor.fieldLabel"),
      getCreditsNotPriceWarningText: () => t("creditFactor.notPriceWarning"),
    };
  }, [creditFactor, i18n.language]);
};
