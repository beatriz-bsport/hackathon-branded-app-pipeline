import { toast } from "@bsport/kaizen-primitive-core";
import type { ReferralSettings } from "@bsport/store-cdp-referral";

import { usePatchReferralProgram } from "#src/hooks/api/use-patch-referral-program";
import { useTranslation } from "#src/utils/i18n";
import type { ReferralProgramFormData, TimeUnit } from "#src/utils/types";

type UseUpdateReferralProgramParams = {
  onSuccess?: (data: ReferralSettings) => void;
  onFailure?: () => void;
};

export const useUpdateReferralProgram = ({
  onSuccess,
  onFailure,
}: UseUpdateReferralProgramParams) => {
  const { t } = useTranslation("settings");
  const { patchReferralProgram } = usePatchReferralProgram({
    onSuccess: (referralProgramSettings: ReferralSettings) => {
      toast({
        icon: "save",
        title: t("active.form.saveSettings.onSuccess.title"),
        status: "positive",
        buttonIcon: "x-close",
      });

      onSuccess?.(referralProgramSettings);
    },
    onFailure: () => {
      onFailure?.();
      toast({
        icon: "alert-circle",
        title: t("active.form.saveSettings.onFailure.title"),
        status: "critical",
        buttonIcon: "x-close",
      });
    },
  });

  const getFormattedTimeUnit = (
    timeLimitUnit: TimeUnit,
  ): ReferralSettings["application_time_limit_unit"] => {
    switch (timeLimitUnit) {
      case "day":
        return "days";
      case "week":
        return "weeks";
      case "month":
        return "months";
    }
    return "days";
  };

  const updateReferralProgram = ({
    data,
    referralProgramId,
    companyId,
  }: {
    data: ReferralProgramFormData;
    companyId: number;
    referralProgramId: number;
  }): void => {
    const formattedData: ReferralSettings = {
      id: referralProgramId,
      name: `referral_program_${companyId}`,
      company: companyId,
      minimum_basket_amount: data.basketMinimalAmount,
      maximum_referral_uses: data.maxReferringUsage,
      amount_off_referred: data.referringRewardAmount,
      percent_off_referred: data.referringRewardPercentage,
      referred_voucher_type:
        data.referringRewardType as ReferralSettings["referred_voucher_type"],
      application_time_limit_intervals: data.applicationTimeLimitInterval,
      application_time_limit_unit: getFormattedTimeUnit(
        data.applicationTimeLimitUnit as TimeUnit,
      ),
      amount_reward_referring: data.amountReferringReward,
      tag_referred_member: data.tagReferredMember,
      redirect_link: data.redirectLink,
    };
    console.log("Formatted Data for Referral Program Update:", formattedData);
    patchReferralProgram(formattedData);
  };

  return {
    updateReferralProgram,
  };
};
