import { makeFeatureFlags } from "@bsport/sm-backbone";

export const { flags: NavFlags, useFlag: useNavFlag } = makeFeatureFlags({
  HOMEPAGE: "homepage",
  PACKS: "revamp_packs_page",
  GIFTCARDS: "revamp_giftcards_page",
  TOGGLE_APPCUES: "toggle_appcues",
  CLASSES_MERGED_VIEW: "booking_classes_merged_view",
  SETTINGS_AGGREGATORS: "settings_aggregators_view",
  SETTINGS_TEACHER_VIEW: "settings_teacher_view",
  SETTINGS_STAFF_PAGE: "revamp_settings_staff_page",
  SETTINGS_ROLE_PAGE: "revamp_settings_role_page",
} as const);
