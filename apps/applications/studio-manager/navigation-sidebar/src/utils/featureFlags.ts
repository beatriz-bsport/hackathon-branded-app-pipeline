import { makeFeatureFlags } from "@bsport/sm-backbone";

export const { flags: NavFlags, useFlag: useNavFlag } = makeFeatureFlags({
  INSIGHTS_PAGE: "insights_page",
  HOMEPAGE: "homepage",
} as const);
