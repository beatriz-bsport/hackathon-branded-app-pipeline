import { makeFeatureFlags } from "@bsport/sm-backbone";

export const { flags: StaffFlags, useFlag: useStaffFlag } = makeFeatureFlags({
  STAFF_PAGE: "revamp_settings_staff_page",
  ROLE_PAGE: "revamp_settings_role_page",
} as const);
