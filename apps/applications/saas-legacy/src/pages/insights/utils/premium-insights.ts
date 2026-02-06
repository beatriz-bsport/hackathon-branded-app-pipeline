import type { FeatureList } from '#src/libs/company/types';
import { UPSELL_IDENTIFIER_PREMIUM_INSIGHTS } from '#src/libs/platform-billing/upsell-identifiers';

export const hasPremiumInsightsAccess = (
  featureList?: FeatureList | null,
): boolean => {
  const premiumUpsell = featureList?.upsell?.find(
    (f) =>
      f.upsell_identifier === UPSELL_IDENTIFIER_PREMIUM_INSIGHTS ||
      f.readable_identifier === 'premium_insights',
  );

  if (!premiumUpsell) return false;
  return true;
};
