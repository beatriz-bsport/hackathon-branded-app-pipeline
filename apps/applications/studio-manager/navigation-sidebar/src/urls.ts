import type { Urls } from "./types";

const SETTINGS_URL = "/settings";

export const HELP_CENTER = "https://intercom.help/bsport-helpcenter/";

export const LEGACY_URLS: Omit<Urls, "payout"> = {
  accessMonitoring: "/access-monitoring",
  accessMonitoring_monitor: "/access-monitoring/monitor",
  accessMonitoring_perform: "/access-monitoring/perform",
  accessMonitoring_settings: "/access-monitoring/settings",
  activity: "/activity",
  appointment: "/private-service/service",
  appointmentPass: "/private-service/pass",
  attendance: "/clock-in",
  audience: "/audience",
  calendar: "/calendar",
  customForm: "/custom-form",
  dashboard: "/dashboard",
  directDebit: "/subscription",
  emailTemplate: "/email-template",
  establishment: "/establishment/room",
  expense: "/expense",
  feedback: "/feature-base",
  giftcard: "/giftcard",
  inbox: "/inbox/thread",
  insights: "/insights",
  invoice: "/invoice",
  member: "/member",
  memberNotification: "/marketing/notifications",
  order: "/order",
  pack: "/combo",
  pass: "/payment-pack",
  payroll: "/coach/performance",
  performanceTracking: "/performance-tracking",
  playlist: "/vod/playlist",
  promotion: "/coupon",
  reporting: "/reporting/categories",
  schedule: "/schedule",
  search: "/search/results",
  settings_activeCampaign: `${SETTINGS_URL}/active-campaign`,
  settings_billing: `${SETTINGS_URL}/invoice`,
  settings_company: `${SETTINGS_URL}/company`,
  settings_companyOnboarding: `${SETTINGS_URL}/company_onboarding`,
  settings_bsportSubscription: `${SETTINGS_URL}/platform-billing`,
  settings_general: `${SETTINGS_URL}/general`,
  settings_livestreaming: `${SETTINGS_URL}/broadcast`,
  settings_marketplace: `${SETTINGS_URL}/marketplace-settings`,
  settings_memberForm: `${SETTINGS_URL}/forms`,
  settings_mobilePersonalization: `${SETTINGS_URL}/mobile-personalisation/links`,
  settings_partnership: `${SETTINGS_URL}/partnership`,
  settings_paymentFacility: "/instalment-payment",
  settings_paymentMethod: `${SETTINGS_URL}/payment-methods`,
  settings_payroll: `${SETTINGS_URL}/payment-rules`,
  settings_quickbook: `${SETTINGS_URL}/quickbooks`,
  settings_quicksale: `${SETTINGS_URL}/quicksale`,
  settings_referral: `${SETTINGS_URL}/referral`,
  settings_permission: `${SETTINGS_URL}/role`,
  settings_teacherView: `${SETTINGS_URL}/coach-userspace`,
  settings_personalization: `${SETTINGS_URL}/personalization`,
  settings_transactionalNotification: `${SETTINGS_URL}/notification-rule`,
  settings_waitlist: `${SETTINGS_URL}/waiting-list`,
  settings_webhook: `${SETTINGS_URL}/webhook`,
  settings_webshop: `${SETTINGS_URL}/shop`,
  settings_widgets: `${SETTINGS_URL}/widget/create`,
  smartlist: "/smart-list",
  subscription: "/subscription/contract",
  substitution: "/replacement/management",
  tag: "/marketing/tags",
  teacher: "/coach",
  tutorial: "/tutorial",
  video: "/vod/video",
  webshop: "/shop/products",
  webshop_products: "/shop/products",
  webshop_settings: "/shop/settings",
  webshopOld: "/shop",
  workshop: "/workshop-activity/tabs/list",
} as const;

export const REVAMP_URLS_DEVELOPMENT = {
  activity: "/activity",
  customForm: "/custom-form",
  emailTemplate: "/email-template",
  giftcard: "/giftcard",
  invoice: "/invoice",
  member: "/member",
  order: "/order",
  pack: "/pack",
  smartlist: "/smartlist",
  teacher: "/teacher",
  settings_referral: `${SETTINGS_URL}/referral-program`,
  settings_transactionalNotification: `${SETTINGS_URL}/notification-rule`,
  tag: "/tag",
} as const satisfies Partial<Urls>;

export const REVAMP_URLS_PRODUCTION = {
  customForm: "/custom-form",
  emailTemplate: "/email-template",
  giftcard: "/giftcard",
  invoice: "/invoice",
  member: "/member",
  order: "/order",
  pack: "/pack",
  smartlist: "/smartlist",
  teacher: "/teacher",
} satisfies Partial<typeof REVAMP_URLS_DEVELOPMENT>; // Ensure that it's a subset of REVAMP_URLS_DEVELOPMENT

export const MAP_REVAMP_DEVELOPMENT_TO_LEGACY_URLS = new Map();
for (const [key, url] of Object.entries(REVAMP_URLS_DEVELOPMENT)) {
  if (key === "payout") {
    // Future-proofing: payout will be added to REVAMP_URLS later
    MAP_REVAMP_DEVELOPMENT_TO_LEGACY_URLS.set(url, "/"); // Default location
  } else {
    MAP_REVAMP_DEVELOPMENT_TO_LEGACY_URLS.set(
      url,
      LEGACY_URLS[key as keyof Omit<Urls, "payout">],
    );
  }
}

export const MAP_REVAMP_PRODUCTION_TO_LEGACY_URLS = new Map();
for (const [key, url] of Object.entries(REVAMP_URLS_PRODUCTION)) {
  if (key === "payout") {
    // Future-proofing: payout will be added to REVAMP_URLS later
    MAP_REVAMP_PRODUCTION_TO_LEGACY_URLS.set(url, "/"); // Default location
  } else {
    MAP_REVAMP_PRODUCTION_TO_LEGACY_URLS.set(
      url,
      LEGACY_URLS[key as keyof Omit<Urls, "payout">],
    );
  }
}

export default REVAMP_URLS_DEVELOPMENT;
