import { useEffect } from 'react';

import { useSafeFlag } from '#src/utils/feature-flag/flagWrapper';
import { FeatureFlags } from '#src/utils/feature-flag/flags';

import {
  setB2CTrackingAllowed,
  optInTrackingAnalyticsB2C,
  optOutTrackingAnalyticsB2C,
} from './mixpanel';

/**
 * Bridges the `b2c_analytics_tracking` Unleash flag to the B2C analytics module.
 *
 * - When the flag is ON  → B2C tracking is opted-in (the hook drives this since
 *   routers' useEffect may run before flags are ready).
 * - When the flag is OFF → B2C opt-in becomes a no-op **and** any active
 *   tracking session is immediately opted-out so no further events are sent
 *   (including Mixpanel's automatic page-view tracking).
 *
 * Must be rendered inside `<FeatureFlagsProvider>`.
 */
export const useB2CTrackingFeatureFlag = () => {
  const isB2CTrackingEnabled = useSafeFlag(FeatureFlags.B2C_ANALYTICS_TRACKING);

  useEffect(() => {
    setB2CTrackingAllowed(isB2CTrackingEnabled);

    // The routers' useEffect fires before this hook syncs, so their optIn call
    // was a no-op (guard was false). We need to drive opt-in/out from here.
    if (isB2CTrackingEnabled) {
      optInTrackingAnalyticsB2C();
    } else {
      optOutTrackingAnalyticsB2C();
    }
  }, [isB2CTrackingEnabled]);
};
