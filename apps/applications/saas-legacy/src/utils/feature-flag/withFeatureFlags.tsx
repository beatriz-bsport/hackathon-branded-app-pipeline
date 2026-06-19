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
  checkoutFlowModalEnabled: boolean;
  paymentFlowModalEnabled: boolean;
  isBookingMultipleOffersInSubscriptionCheckoutEnabled: boolean;
  isCalendarRevampEnabled: boolean;
  isAgentChatEnabled: boolean;
  isNewWellpassConfigurationEnabled: boolean;
  shouldSendFileNotJson: boolean;
  isStripeComplianceStatusAlertEnabled: boolean;
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
    const isBookingMultipleOffersInSubscriptionCheckoutEnabled = useSafeFlag(
      FeatureFlags.BOOKING_MULTIPLE_OFFERS_IN_SUBSCRIPTION_CHECKOUT,
    );
    const checkoutFlowModalEnabled = useSafeFlag(
      FeatureFlags.FS_BILLING_FLOW_NEW_MODAL,
    );
    const paymentFlowModalEnabled = useSafeFlag(
      FeatureFlags.FS_PAYMENT_FLOW_MODAL,
    );

    const isCalendarRevampEnabled = useSafeFlag(FeatureFlags.CALENDAR_REVAMP);
    const isAgentChatEnabled = useSafeFlag(FeatureFlags.AGENT_CHAT);
    const isNewWellpassConfigurationEnabled = useSafeFlag(
      FeatureFlags.BOOKING_ACTIVATE_NEW_WELLPASS_CONFIGURATION,
    );
    const shouldSendFileNotJson = useSafeFlag(
      FeatureFlags.SIGNUP_SEND_FILE_NOT_JSON,
    );
    const isStripeComplianceStatusAlertEnabled = useSafeFlag(
      FeatureFlags.STRIPE_COMPLIANCE_STATUS_ALERT,
    );

    return (
      <WrappedComponent
        {...props}
        checkoutFlowModalEnabled={checkoutFlowModalEnabled}
        isAgentChatEnabled={isAgentChatEnabled}
        isBookingMultipleOffersInSubscriptionCheckoutEnabled={
          isBookingMultipleOffersInSubscriptionCheckoutEnabled
        }
        isCalendarRevampEnabled={isCalendarRevampEnabled}
        isInvoiceSequentialNumberingEnabled={
          isInvoiceSequentialNumberingEnabled
        }
        isNewWellpassConfigurationEnabled={isNewWellpassConfigurationEnabled}
        isStripeComplianceStatusAlertEnabled={
          isStripeComplianceStatusAlertEnabled
        }
        paymentFlowModalEnabled={paymentFlowModalEnabled}
        shouldDisplayNewSubscriptionContracts={
          shouldDisplayNewSubscriptionContracts
        }
        shouldSendFileNotJson={shouldSendFileNotJson}
        showAudienceTemplates={showAudienceTemplates}
        showBookingDisplaySwapPass={showBookingDisplaySwapPass}
        showExpressCheckout={showExpressCheckout}
        toggleAppcues={toggleAppcues}
      />
    );
  };

  return WithFeatureFlagsComponent;
};
