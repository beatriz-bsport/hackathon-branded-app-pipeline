// Central registry of Unleash feature flag names used in saas-legacy.
export const FeatureFlags = {
  INSIGHTS_PAGE: 'insights_page',
  HOMEPAGE: 'homepage',
  EXPRESS_PASS_CHECKOUT: 'express-pass-checkout',
  TRIAL_ANALYSIS: 'insights_trial_analysis_page',
  AUDIENCE_SMS_MARKETING_ACTIONS: 'audience_sms_marketing_actions',
  MEMBER_AREA_BASKET_UNIFIED: 'member-area-basket-unified',
  WEBVIEW_BASKET_AP_GP: 'webview-basket-ap-gp',
  WEBVIEW_GOOGLE_PAY: 'webview-google-pay',
  STOP_SUBSCRIPTION_FROM_MEMBER_SIDE: 'stop_subscription_on_memberside',
  BOOKING_TEACHER_CALENDAR_FEED: 'booking_teacher_calendar_feed',
} as const;

export type FlagName = (typeof FeatureFlags)[keyof typeof FeatureFlags];
