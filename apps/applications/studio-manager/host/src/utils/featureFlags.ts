import { makeFeatureFlags } from "@bsport/sm-backbone";

export const { flags: NavFlags, useFlag: useNavFlag } = makeFeatureFlags({
  HOMEPAGE: "homepage",
} as const);
