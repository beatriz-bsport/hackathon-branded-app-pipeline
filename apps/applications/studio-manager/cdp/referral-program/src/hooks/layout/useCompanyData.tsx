import { useEffect, useState } from "react";

import type { BadgeProps } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useTranslation } from "#src/utils/i18n";

export const useCompanyData = () => {
  const { t } = useTranslation("settings");
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const [isReferralProgramActivated, setIsReferralProgramActivated] = useState<
    boolean | null
  >(null);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [companyCurrency, setCompanyCurrency] = useState<string | null>(null);

  const headerBadgeConfiguration: BadgeProps = {
    text: isReferralProgramActivated
      ? t("active.header.chip")
      : t("inactive.header.chip"),
    color: isReferralProgramActivated ? "main" : "default",
    size: "sm",
  };

  useEffect(() => {
    if (companyTheme) {
      setIsReferralProgramActivated(
        companyTheme?.is_referral_program_activated ?? null,
      );
      setCompanyId(companyTheme?.company ?? null);
      setCompanyCurrency(companyTheme?.currency?.toUpperCase() ?? null);
    }
  }, [companyTheme]);

  return {
    companyCurrency,
    companyId,
    isReferralProgramActivated,
    headerBadgeConfiguration,
    setIsReferralProgramActivated,
  };
};
