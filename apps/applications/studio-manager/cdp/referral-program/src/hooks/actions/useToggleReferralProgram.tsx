import { toast } from "@bsport/kaizen-primitive-core";
import { CompanyTheme } from "@bsport/store-core-data-company-theme";

import { useTranslation } from "#src/utils/i18n";

import { useUpdateCompanyTheme } from "../api/use-update-company-theme";

export type ToggleReferralProgramPayload = {
  is_referral_program_activated: boolean;
};

type UseToggleReferralProgramParams = {
  isProgramActivated: boolean;
  companyId: number;
  onSuccess?: (data: Partial<CompanyTheme>) => void;
  onFailure?: () => void;
};

export const useToggleReferralProgram = ({
  isProgramActivated,
  companyId,
  onSuccess,
  onFailure,
}: UseToggleReferralProgramParams) => {
  const { t } = useTranslation("settings");
  const { updateCompanyTheme } = useUpdateCompanyTheme({
    onSuccess: (updatedCompanyTheme: Partial<CompanyTheme>) => {
      onSuccess?.(updatedCompanyTheme);
    },
    onFailure: () => {
      onFailure?.();
      toast({
        icon: "alert-circle",
        title: isProgramActivated
          ? t("referralProgramHelper.button.deactivated.errors.couldNotToggle")
          : t("referralProgramHelper.button.activated.errors.couldNotToggle"),
        status: "critical",
        buttonIcon: "x-close",
      });
    },
  });

  const toggleReferralProgram = (data: ToggleReferralProgramPayload): void => {
    updateCompanyTheme({ companyId, data });
  };

  return {
    toggleReferralProgram,
  };
};
