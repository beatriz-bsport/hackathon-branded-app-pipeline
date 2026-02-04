// Central registry of Unleash feature flag names used in saas-legacy.
export const FeatureFlags = {
  INSIGHTS_PAGE: 'insights_page',
  HOMEPAGE: 'homepage',
  EXPRESS_PASS_CHECKOUT: 'express-pass-checkout',
  TRIAL_ANALYSIS: 'insights_trial_analysis_page',
  SCHEDULE_ANALYSIS: 'insights_schedule_analysis_page',
  AUDIENCE_SMS_MARKETING_ACTIONS: 'audience_sms_marketing_actions',
  MEMBER_AREA_BASKET_UNIFIED: 'member-area-basket-unified',
  WEBVIEW_BASKET_AP_GP: 'webview-basket-ap-gp',
  WEBVIEW_GOOGLE_PAY: 'webview-google-pay',
  STOP_SUBSCRIPTION_FROM_MEMBER_SIDE: 'stop_subscription_on_memberside',
  FISKALY_SIGN_ES: 'fiskaly_sign_es',
  AUDIENCE_TEMPLATES: 'audience_workflow_templates',
  INVOICE_SEQUENTIAL_NUMBERING: 'invoice_sequential_numbering',
  NEW_SUBSCRIPTION_CONTRACTS: 'new-subscription-contracts',
  AUDIENCE_HOURLY_TIMEOUT: 'audience_hourly_timeout',
  AUDIENCE_LEAD_FORM_SUBMITTED_EVENT: 'audience_lead_form_submitted_event',
  BOOKING_ALLOW_ENDLESS_SUBSTITUTIONS: 'booking_allow_endless_substitutions',
} as const;

export type FlagName = (typeof FeatureFlags)[keyof typeof FeatureFlags];
