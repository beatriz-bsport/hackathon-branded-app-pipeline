import { makeFeatureFlags } from "@bsport/sm-backbone";

export const { flags: NavFlags, useFlag: useNavFlag } = makeFeatureFlags({
  // BI
  INSIGHTS_PAGE: "insights_page",
  HOMEPAGE: "homepage",
  // FS
  INVOICE_LIST_PAGE: "invoice_list_page",
  PAYOUTS_PAGE: "payouts_page",
  FS_BILLING_FLOW_NEW_MODAL: "fs_billing_flow_new_modal",
  FS_PAYMENT_FLOW_MODAL: "fs_payment_flow_modal",
  // CDP
  INBOX_REVAMP: "unified_inbox",
  // BOOKING
  CALENDAR_REVAMP: "booking_calendar_page_revamped",
  // Classes revamp
  CLASSES_MERGED_VIEW: "booking_classes_merged_view",
  SETTINGS_TEACHER_VIEW: "settings_teacher_view",
  SMARTFILL: "smartfill_page",
  SETTINGS_AGGREGATORS: "settings_aggregators_view",
  BOOKING_VENUES_PAGE: "booking_venues_page",
  BOOKING_WIDGETS_SETTINGS_PAGE: "booking_widgets_settings_page",
  // CORE
  SETTINGS_STAFF_PAGE: "revamp_settings_staff_page",
  SETTINGS_ROLE_PAGE: "revamp_settings_role_page",
  // BUYABLES
  PACKS_REVAMP: "revamp_packs_page",
  GIFTCARDS_REVAMP: "revamp_giftcards_page",
  ONDEMAND_REVAMP: "revamp_ondemand_page",
  SUBSCRIPTION_REVAMP: "revamp_contracts_page",
} as const);
