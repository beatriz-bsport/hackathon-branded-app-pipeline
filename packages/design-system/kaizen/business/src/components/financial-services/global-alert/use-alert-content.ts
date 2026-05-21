import type { GlobalAlertKind } from "#src/components/financial-services/global-alert/types";
import { i18nInstance, useTranslation } from "#src/i18n";

/** Returns the translated `title`, `description`, and `ctaLabel` strings for a given alert kind. */
export const useAlertContent = (kind: GlobalAlertKind) => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });
  const base = `globalAlertModal.${kind}` as const;
  return {
    title: t(`${base}.title`) as string,
    description: t(`${base}.description`) as string,
    ctaLabel: t(`${base}.ctaLabel`) as string,
  };
};
