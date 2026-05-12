import type { Appearance } from "@stripe/stripe-js";
import { useMemo } from "react";

const getCssVariableValue = (variableName: string): string =>
  typeof window !== "undefined"
    ? getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim()
    : "";

/**
 * Builds Stripe Elements appearance from Kaizen design tokens and active theme.
 */
export const useStripeAppearance = (isDarkMode: boolean): Appearance => {
  const stripeAppearanceTheme = isDarkMode ? "night" : "stripe";

  return useMemo(() => {
    const colorBackground = getCssVariableValue("--kz-color-surface-default");
    const colorText = getCssVariableValue("--kz-color-onsurface-weak");
    const colorTextPlaceholder = getCssVariableValue(
      "--kz-color-onsurface-weak",
    );
    const borderBoxShadow = getCssVariableValue(
      "--kz-shadow-border-thin-default",
    );
    const focusBoxShadow = getCssVariableValue("--kz-shadow-focused");
    const invalidBorderBoxShadow = getCssVariableValue(
      "--kz-shadow-border-thin-critical",
    );
    const invalidTextColor = getCssVariableValue(
      "--kz-color-onsurface-status-critical-strong",
    );

    return {
      theme: stripeAppearanceTheme,
      variables: {
        colorBackground,
        colorText,
        colorTextPlaceholder,
      },
      rules: {
        ".Input": {
          borderWidth: "0px",
          boxShadow: borderBoxShadow,
        },
        ".Input:focus": {
          borderWidth: "0px",
          boxShadow: focusBoxShadow,
        },
        ".Input--invalid": {
          borderWidth: "0px",
          boxShadow: invalidBorderBoxShadow,
          color: invalidTextColor,
        },
        ".Input--invalid:focus": {
          borderWidth: "0px",
          boxShadow: invalidBorderBoxShadow,
          color: invalidTextColor,
        },
      },
    };
  }, [stripeAppearanceTheme]);
};
