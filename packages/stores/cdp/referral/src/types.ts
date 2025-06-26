export type ReferralSettings = {
  id: number;
  name: string;
  company: number;
  minimum_basket_amount: string;
  maximum_referral_uses: number;
  amount_off_referred: string;
  percent_off_referred: number;
  referred_voucher_type: ReferredVoucherType;
  application_time_limit_intervals: number;
  application_time_limit_unit: TimeLimitIntervalUnits;
  amount_reward_referring: string;
  redirect_link: string | null;
  tag_referred_member: number | null;
};

export type TimeLimitIntervalUnits = "days" | "weeks" | "months";

export type ReferredVoucherType = "amount_off" | "percent_off";

export type UpdateReferralProgramSettingsPayload = ReferralSettings;
