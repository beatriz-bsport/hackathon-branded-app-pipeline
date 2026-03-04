import React from 'react';
import { useSafeFlag } from './flagWrapper';
import { FeatureFlags } from './flags';

export type FeatureFlagProps = {
  showExpressCheckout: boolean;
  showAudienceTemplates: boolean;
  isInvoiceSequentialNumberingEnabled: boolean;
  shouldDisplayNewSubscriptionContracts: boolean;
  toggleAppcues: boolean;
  showBookingDisplaySwapPass: boolean;
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
    const isInvoiceSequentialNumberingEnabled = useSafeFlag(
      FeatureFlags.INVOICE_SEQUENTIAL_NUMBERING,
    );
    const shouldDisplayNewSubscriptionContracts = useSafeFlag(
      FeatureFlags.NEW_SUBSCRIPTION_CONTRACTS,
    );
    const toggleAppcues = useSafeFlag(FeatureFlags.TOGGLE_APPCUES);
    const showBookingDisplaySwapPass = useSafeFlag(
      FeatureFlags.BOOKING_DISPLAY_SWAP_PASS,
    );

    return (
      <WrappedComponent
        {...props}
        isInvoiceSequentialNumberingEnabled={
          isInvoiceSequentialNumberingEnabled
        }
        shouldDisplayNewSubscriptionContracts={
          shouldDisplayNewSubscriptionContracts
        }
        showAudienceTemplates={showAudienceTemplates}
        showBookingDisplaySwapPass={showBookingDisplaySwapPass}
        showExpressCheckout={showExpressCheckout}
        toggleAppcues={toggleAppcues}
      />
    );
  };

  return WithFeatureFlagsComponent;
};
