// Central registry of Unleash feature flag names used in saas-legacy.
export const FeatureFlags = {
  INSIGHTS_PAGE: 'insights_page',
  HOMEPAGE: 'homepage',
  EXPRESS_PASS_CHECKOUT: 'express-pass-checkout',
  TRIAL_ANALYSIS: 'insights_trial_analysis_page',
  SCHEDULE_ANALYSIS: 'insights_schedule_analysis_page',
  COMMUNITY_HEALTH: 'insights_community_health',
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
  AUDIENCE_VIEW_WORKFLOW_DETAILS_IN_ALL_MODES:
    'audience_view_workflow_details_in_all_modes',
  AUDIENCE_REMOVE_TAG_MARKETING_ACTION: 'audience_remove_tag_marketing_action',
  TOGGLE_APPCUES: 'toggle_appcues',
  AUDIENCE_DISPLAY_TIME_IN_MEMBER_TABLE:
    'audience_display_time_in_member_table',
  AUDIENCE_WORKFLOW_DUPLICATION: 'audience_workflow_duplication',
  AUDIENCE_ALLOW_CLICK_ON_MEMBER_TABLE: 'audience_allow_click_on_member_table',
} as const;

export type FlagName = (typeof FeatureFlags)[keyof typeof FeatureFlags];
