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

  // Paid access.
  if (!premiumUpsell.is_free_trial) return true;

  // Free-trial access (treat null remaining days as active).
  const remainingDays = premiumUpsell.trial_remaining_days;
  return remainingDays === null || remainingDays > 0;
};
