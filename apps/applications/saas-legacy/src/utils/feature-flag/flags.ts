// Central registry of Unleash feature flag names used in saas-legacy.
export const FeatureFlags = {
  INSIGHTS_PAGE: 'insights_page',
  EXPRESS_PASS_CHECKOUT: 'express-pass-checkout',
  TRIAL_ANALYSIS: 'insights_trial_analysis_page',
  AUDIENCE_SMS_MARKETING_ACTIONS: 'audience_sms_marketing_actions',
} as const;

export type FlagName = (typeof FeatureFlags)[keyof typeof FeatureFlags];
