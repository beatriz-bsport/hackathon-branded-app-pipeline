import { makeFeatureFlags } from "@bsport/sm-backbone";

export const { flags: NavFlags, useFlag: useNavFlag } = makeFeatureFlags({
  HOMEPAGE: "homepage",
  PACKS: "revamp_packs_page",
  GIFTCARDS: "revamp_giftcards_page",
  TOGGLE_APPCUES: "toggle_appcues",
  CLASSES_MERGED_VIEW: "booking_classes_merged_view",
} as const);
