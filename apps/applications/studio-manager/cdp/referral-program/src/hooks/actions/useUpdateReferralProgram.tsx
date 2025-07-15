import { toast } from "@bsport/kaizen-primitive-core";
import type { ReferralSettings } from "@bsport/store-cdp-referral";

import { usePatchReferralProgram } from "#src/hooks/api/use-patch-referral-program";
import { useTranslation } from "#src/utils/i18n";
import type { ReferralProgramFormData } from "#src/utils/types";

type UseUpdateReferralProgramParams = {
  onSuccess?: (data: ReferralSettings) => void;
  onFailure?: () => void;
};

function getFormattedTimeUnit(
  timeLimitUnit: string,
): ReferralSettings["application_time_limit_unit"] | null {
  if (!timeLimitUnit) {
    return null;
  }
  if (timeLimitUnit.includes("day")) {
    return "days";
  } else if (timeLimitUnit.includes("week")) {
    return "weeks";
  } else if (timeLimitUnit.includes("month")) {
    return "months";
  }

  return null;
}

function getVoucherType(
  voucher: string,
): ReferralSettings["referred_voucher_type"] | null {
  if (!voucher) {
    return null;
  }
  if (voucher === "amount_off" || voucher === "percent_off") {
    return voucher;
  }
  return null;
}

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

  const updateReferralProgram = ({
    data,
    referralProgramId,
    companyId,
  }: {
    data: ReferralProgramFormData;
    companyId: number;
    referralProgramId: number;
  }): void => {
    const timeUnit = getFormattedTimeUnit(data.applicationTimeLimitUnit);
    const voucherType = getVoucherType(data.referringRewardType);

    if (!timeUnit) {
      toast({
        icon: "alert-circle",
        title: t("active.form.saveSettings.errors.invalidTimeUnit"),
        status: "critical",
        buttonIcon: "x-close",
      });
      return;
    } else if (!voucherType) {
      toast({
        icon: "alert-circle",
        title: t("active.form.saveSettings.errors.invalidVoucherType"),
        status: "critical",
        buttonIcon: "x-close",
      });
      return;
    }
    const formattedData: ReferralSettings = {
      id: referralProgramId,
      name: `referral_program_${companyId}`,
      company: companyId,
      minimum_basket_amount: data.basketMinimalAmount,
      maximum_referral_uses: data.maxReferringUsage,
      amount_off_referred: data.referringRewardAmount,
      percent_off_referred: data.referringRewardPercentage,
      referred_voucher_type: voucherType,
      application_time_limit_intervals: data.applicationTimeLimitInterval,
      application_time_limit_unit: timeUnit,
      amount_reward_referring: data.amountReferringReward,
      tag_referred_member: data.tagReferredMember,
      redirect_link: data.redirectLink,
    };
    patchReferralProgram(formattedData);
  };

  return {
    updateReferralProgram,
  };
};
