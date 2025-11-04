import React from 'react';
import { useSafeFlag } from './flagWrapper';
import { FeatureFlags } from './flags';

export type FeatureFlagProps = {
  showExpressCheckout: boolean;
  showCalendarFeed: boolean;
};

/**
 * Higher-Order Component that provides feature flags to class components
 * Add more flags to FeatureFlagProps and to this HOC if needed
 */
export const withFeatureFlags = <TProps extends object>(
  WrappedComponent: React.ComponentType<TProps & FeatureFlagProps>,
): React.ComponentType<TProps> => {
  const WithFeatureFlagsComponent = (props: TProps) => {
    const showExpressCheckout = useSafeFlag(FeatureFlags.EXPRESS_PASS_CHECKOUT);
    const showCalendarFeed = useSafeFlag(
      FeatureFlags.BOOKING_TEACHER_CALENDAR_FEED,
    );

    return (
      <WrappedComponent
        {...props}
        showCalendarFeed={showCalendarFeed}
        showExpressCheckout={showExpressCheckout}
      />
    );
  };

  return WithFeatureFlagsComponent;
};
