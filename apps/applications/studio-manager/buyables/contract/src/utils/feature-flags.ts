import { makeFeatureFlags } from "@bsport/sm-backbone";

export const { flags: NavFlags, useFlag: useNavFlag } = makeFeatureFlags({
  REVAMPED_CONTRACT: "new-subscription-contracts",
} as const);
