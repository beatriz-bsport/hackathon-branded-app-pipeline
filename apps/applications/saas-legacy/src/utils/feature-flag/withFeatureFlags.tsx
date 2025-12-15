import React from 'react';
import { useSafeFlag } from './flagWrapper';
import { FeatureFlags } from './flags';

export type FeatureFlagProps = {
  showExpressCheckout: boolean;
  showAudienceTemplates: boolean;
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
    const showAudienceTemplates = useSafeFlag(FeatureFlags.AUDIENCE_TEMPLATES);

    return (
      <WrappedComponent
        {...props}
        showAudienceTemplates={showAudienceTemplates}
        showExpressCheckout={showExpressCheckout}
      />
    );
  };

  return WithFeatureFlagsComponent;
};
