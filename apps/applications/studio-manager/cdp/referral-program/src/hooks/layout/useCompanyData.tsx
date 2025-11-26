import { getCurrencyCode } from "@bsport/currency";
import type { BadgeProps } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useTranslation } from "#src/utils/i18n";

export const useCompanyData = () => {
  const { t } = useTranslation("settings");
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const companyCurrency = getCurrencyCode()?.toUpperCase() ?? "";
  const companyId = companyTheme?.company;
  const isReferralProgramActivated =
    companyTheme?.is_referral_program_activated;

  const headerBadgeConfiguration: BadgeProps = {
    text: isReferralProgramActivated
      ? t("active.header.chip")
      : t("inactive.header.chip"),
    color: isReferralProgramActivated ? "main" : "default",
    size: "sm",
  };

  return {
    companyCurrency,
    companyId,
    isReferralProgramActivated,
    headerBadgeConfiguration,
  };
};
