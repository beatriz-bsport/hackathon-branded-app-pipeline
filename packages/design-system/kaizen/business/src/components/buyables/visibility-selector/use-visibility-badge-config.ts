import type { BadgeProps } from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";

/**
 * Return the badge config to inject into the Header of your page
 * @param isVisible Whether your item is "visible"
 */
export const useVisibilityBadgeConfig = (isVisible: boolean): BadgeProps => {
  const { t } = useTranslation("buyables", { i18n: i18nInstance });

  return {
    color: isVisible ? "main" : "default",
    size: "lg",
    text: isVisible
      ? t("visibilitySelector.optionVisible.label")
      : t("visibilitySelector.optionHidden.label"),
  };
};
