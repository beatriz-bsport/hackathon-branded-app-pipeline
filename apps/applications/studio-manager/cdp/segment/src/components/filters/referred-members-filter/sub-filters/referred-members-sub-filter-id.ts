export const REFERRED_MEMBERS_SUB_FILTER_IDS = {
  moneyObtained: "moneyObtained",
} as const;

export type ReferredMembersSubFilterId =
  (typeof REFERRED_MEMBERS_SUB_FILTER_IDS)[keyof typeof REFERRED_MEMBERS_SUB_FILTER_IDS];

export type ReferredMembersSubFilterField = "moneyObtained";

export const referredMembersSubFilterFieldMap: Record<
  ReferredMembersSubFilterId,
  ReferredMembersSubFilterField
> = {
  [REFERRED_MEMBERS_SUB_FILTER_IDS.moneyObtained]: "moneyObtained",
};
