// Central registry of Unleash feature flag names used in saas-legacy.
export const FeatureFlags = {
  INSIGHTS_PAGE: 'insights_page',
} as const;

export type FlagName = (typeof FeatureFlags)[keyof typeof FeatureFlags];
