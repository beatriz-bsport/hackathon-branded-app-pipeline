export type ReferralProgramFormData = {
  basketMinimalAmount: string;
  amountReferringReward: string;
  maxReferringUsage: number;
  referringRewardType: string;
  referringRewardPercentage: number;
  referringRewardAmount: string;
  applicationTimeLimitInterval: number;
  applicationTimeLimitUnit: string;
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
  amount: "amount-off",
  percentage: "percent-off",
} as const;

export const referrinRewardOptionTypeMap = [
  referringRewardTypeValues.amount,
  referringRewardTypeValues.percentage,
] as const;
export type ReferrinRewardOptionType =
  (typeof referrinRewardOptionTypeMap)[number];
