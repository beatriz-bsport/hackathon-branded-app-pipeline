import { makeFeatureFlags } from "@bsport/sm-backbone";

export const { flags: NavFlags, useFlag: useNavFlag } = makeFeatureFlags({
  INSIGHTS_PAGE: "insights_page",
  HOMEPAGE: "homepage",
  // Pages always present in the legacy with a revamp version
  CALENDAR_REVAMP: "booking_calendar_page_revamped",
  PACKS_REVAMP: "revamp_packs_page",
  FS_BILLING_FLOW_NEW_MODAL: "fs_billing_flow_new_modal",
} as const);
