// Central registry of Unleash feature flag names used in saas-legacy.
export const FeatureFlags = {
  APPOINTMENT_PASS_TAGS_ELIGIBILITY: 'appointment_pass_tags_eligibility',
  AUDIENCE_ALLOW_CLICK_ON_MEMBER_TABLE: 'audience_allow_click_on_member_table',
  AUDIENCE_DISPLAY_TIME_IN_MEMBER_TABLE:
    'audience_display_time_in_member_table',
  AUDIENCE_HOURLY_TIMEOUT: 'audience_hourly_timeout',
  AUDIENCE_LEAD_FORM_SUBMITTED_EVENT: 'audience_lead_form_submitted_event',
  AUDIENCE_REMOVE_TAG_MARKETING_ACTION: 'audience_remove_tag_marketing_action',
  AUDIENCE_SMS_MARKETING_ACTIONS: 'audience_sms_marketing_actions',
  AUDIENCE_TEMPLATES: 'audience_workflow_templates',
  AUDIENCE_VIEW_WORKFLOW_DETAILS_IN_ALL_MODES:
    'audience_view_workflow_details_in_all_modes',
  AUDIENCE_WORKFLOW_DUPLICATION: 'audience_workflow_duplication',
  BOOKING: 'insights_booking',
  BOOKING_ALLOW_ENDLESS_SUBSTITUTIONS: 'booking_allow_endless_substitutions',
  BOOKING_DISPLAY_SWAP_PASS: 'booking_display_swap_pass',
  BOOKING_DRAFT_PARTNERSHIP_OFFERS: 'booking_draft_partnership_offers',
  COMMUNITY_HEALTH: 'insights_community_health',
  EXPRESS_PASS_CHECKOUT: 'express-pass-checkout',
  FISKALY_SIGN_ES: 'fiskaly_sign_es',
  FS_BILLING_FLOW_NEW_MODAL: 'fs_billing_flow_new_modal',
  FS_NEW_PAYOUT_FLOW: 'fs_new_payout_flow',
  HOMEPAGE: 'homepage',
  INSIGHTS_PAGE: 'insights_page',
  INVOICE_SEQUENTIAL_NUMBERING: 'invoice_sequential_numbering',
  LEAD_ACQUISITION_WIDGET_REQUIRE_RECAPTCHA:
    'lead-acquisition-widget-require-recaptcha',
  MARKETING_DOUBLE_OPT_IN: 'marketing_double_opt_in',
  MEMBER_AREA_BASKET_UNIFIED: 'member-area-basket-unified',
  NEW_SUBSCRIPTION_CONTRACTS: 'new-subscription-contracts',
  SCHEDULE_ANALYSIS: 'insights_schedule_analysis_page',
  STOP_SUBSCRIPTION_FROM_MEMBER_SIDE: 'stop_subscription_on_memberside',
  TOGGLE_APPCUES: 'toggle_appcues',
  TRIAL_ANALYSIS: 'insights_trial_analysis_page',
  WEBVIEW_BASKET_AP_GP: 'webview-basket-ap-gp',
  WEBVIEW_GOOGLE_PAY: 'webview-google-pay',
  CALENDAR_REVAMP: 'booking_calendar_page_revamped',
  STRIPE_LINK_EXPRESS_CHECKOUT: 'stripe-link-express-checkout',
  WELLHUB_NEW_CONFIGURATION: 'booking_activate_new_wellhub_configuration',
} as const;

export type FlagName = (typeof FeatureFlags)[keyof typeof FeatureFlags];
