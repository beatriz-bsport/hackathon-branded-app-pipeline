export type ReferralProgramFormData = {
  basketMinimalAmount: string;
  amountReferringReward: string;
  maxReferringUsage: number;
  referringRewardType: ReferringRewardOptionType;
  referringRewardPercentage: number;
  referringRewardAmount: string;
  applicationTimeLimitInterval: number;
  applicationTimeLimitUnit: TimeUnit;
  toggleTagReferredMember: boolean;
  tagReferredMember: number | null;
  toggleLinkRedirection: boolean;
  redirectLink: string | null;
};

export const timeUnits = ["days", "weeks", "months"] as const;
export type TimeUnit = (typeof timeUnits)[number];

export const referringRewardTypeValues = {
  amount: "amount_off",
  percentage: "percent_off",
} as const;

export const referringRewardOptionTypeMap = [
  referringRewardTypeValues.amount,
  referringRewardTypeValues.percentage,
] as const;
export type ReferringRewardOptionType =
  (typeof referringRewardOptionTypeMap)[number];
