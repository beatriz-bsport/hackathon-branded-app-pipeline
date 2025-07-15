export type ReferralProgramFormData = {
  basketMinimalAmount: string;
  amountReferringReward: string;
  maxReferringUsage: number;
  referringRewardType: ReferringRewardOptionType;
  referringRewardPercentage: number;
  referringRewardAmount: string;
  applicationTimeLimitInterval: number;
  applicationTimeLimitUnit: string;
  toggleTagReferredMember: boolean;
  tagReferredMember: number | null;
  toggleLinkRedirection: boolean;
  redirectLink: string | null;
};

// Map first letter of units to full unit string to allow reverse search (translations -> unit)
export const unitMap: Record<string, "day" | "week" | "month"> = {
  d: "day",
  w: "week",
  m: "month",
};

export const timeUnits = ["day", "week", "month"] as const;
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
