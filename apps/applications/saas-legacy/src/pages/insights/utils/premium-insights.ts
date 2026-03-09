import type { FeatureList } from '#src/libs/company/types';
import {
  UPSELL_IDENTIFIER_INSIGHTS_FOR_ESSENTIAL,
  UPSELL_IDENTIFIER_PREMIUM_INSIGHTS,
} from '#src/libs/platform-billing/upsell-identifiers';

export const hasPremiumInsightsAccess = (
  featureList?: FeatureList | null,
): boolean => {
  return Boolean(
    featureList?.upsell?.find(
      (f) =>
        f.upsell_identifier === UPSELL_IDENTIFIER_PREMIUM_INSIGHTS ||
        f.readable_identifier === 'premium_insights',
    ),
  );
};

export const hasInsightsForEssentialAccess = (
  featureList?: FeatureList | null,
): boolean => {
  return Boolean(
    featureList?.upsell?.find(
      (f) =>
        f.upsell_identifier === UPSELL_IDENTIFIER_INSIGHTS_FOR_ESSENTIAL ||
        f.readable_identifier === 'insights_for_essential',
    ),
  );
};
