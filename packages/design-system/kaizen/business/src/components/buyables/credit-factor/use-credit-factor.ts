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
  getCreditsDividedMessage: (credits: number) => string;
  creditsFieldLabel: string;
  creditsNotPriceWarningText: string;
};

/**
 * Credit factor from company theme (`pass_credit_factor`) with helpers for
 * numeric display, form copy, and warnings. Uses embedded `buyables` translations.
 *
 * @param passCreditFactor — Value from company theme (e.g. `useCompanyTheme()?.pass_credit_factor`).
 * @returns {UseCreditFactorResult}
 * - creditFactor: Effective credit factor (from theme, or 1).
 * - getCreditsDividedValue: Callback to get the effective amount of credits.
 * - getCreditsDividedDisplay: Callback to get the localized display of the divided value (e.g. 0.1 vs 0,1)
 * - getCreditsDividedMessage: Callback to get the localized display with credits (e.g. "0,1 credits")
 * - fielcreditsFieldLabeldLabel: Localized "Credits"
 * - creditsNotPriceWarningText: Localized alert that it's a credit input, not price input
 */
export const useCreditFactor = (
  passCreditFactor: number | undefined | null,
): UseCreditFactorResult => {
  const { t, i18n } = useTranslation("buyables", { i18n: i18nInstance });

  const creditFactor = normalizePassCreditFactor(passCreditFactor);

  return useMemo(() => {
    const dividedDisplay = (credits: number) =>
      getCreditsDividedDisplay(credits, creditFactor, i18n.language);

    const dividedMessage = (credits: number) =>
      t("creditFactor.nbOfCredits", {
        count: getCreditsDividedValue(credits, creditFactor),
        countDisplay: getCreditsDividedDisplay(
          credits,
          creditFactor,
          i18n.language,
        ),
      });

    return {
      creditFactor,
      getCreditsDividedValue: (credits: number) =>
        getCreditsDividedValue(credits, creditFactor),
      getCreditsDividedDisplay: dividedDisplay,
      getCreditsDividedMessage: dividedMessage,
      creditsFieldLabel: t("creditFactor.fieldLabel"),
      creditsNotPriceWarningText: t("creditFactor.notPriceWarning"),
    };
  }, [creditFactor, i18n.language]);
};
