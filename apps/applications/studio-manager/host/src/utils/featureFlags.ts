import { makeFeatureFlags } from "@bsport/sm-backbone";

export const { flags: NavFlags, useFlag: useNavFlag } = makeFeatureFlags({
  HOMEPAGE: "homepage",
  PACKS: "revamp_packs_page",
} as const);
