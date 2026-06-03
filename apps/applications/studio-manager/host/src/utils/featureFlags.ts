import { makeFeatureFlags } from "@bsport/sm-backbone";

export const { flags: NavFlags, useFlag: useNavFlag } = makeFeatureFlags({
  HOMEPAGE: "homepage",
  PACKS: "revamp_packs_page",
  GIFTCARDS: "revamp_giftcards_page",
  CONTRACTS: "revamp_contracts_page",
  INBOX: "unified_inbox",
  TOGGLE_APPCUES: "toggle_appcues",
  CLASSES_MERGED_VIEW: "booking_classes_merged_view",
  SETTINGS_AGGREGATORS: "settings_aggregators_view",
  SETTINGS_TEACHER_VIEW: "settings_teacher_view",
  BOOKING_WIDGETS_SETTINGS_PAGE: "booking_widgets_settings_page",
  SETTINGS_STAFF_PAGE: "revamp_settings_staff_page",
  SETTINGS_ROLE_PAGE: "revamp_settings_role_page",
  BOOKING_VENUES_PAGE: "booking_venues_page",
} as const);
