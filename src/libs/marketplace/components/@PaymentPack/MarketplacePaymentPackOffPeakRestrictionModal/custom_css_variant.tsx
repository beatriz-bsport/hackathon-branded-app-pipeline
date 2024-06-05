import React from 'react';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';
import { paymentPackFactory } from '#libs/payment-packs/factory';
// @ts-expect-error
import MarketplacePaymentPackOffPeakRestrictionModalCss from './styles.css?raw';
import MarketplacePaymentPackOffPeakRestrictionModal, {
  Props as MarketplacePaymentPackOffPeakRestrictionModalProps,
} from '.';

const paymentPackFromFactory = paymentPackFactory();

const usePropsFromVariation =
  (): MarketplacePaymentPackOffPeakRestrictionModalProps => {
    return {
      paymentPack: paymentPackFromFactory,
      isOpen: true,
      onDialogClose: () => {},
    };
  };

export const MARKETPLACE_PAYMENT_PACK_OFFPEAK_RESTRICTION_MODAL_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label:
      CssComponentsVariantIdentifiers.MARKETPLACE_PAYMENT_PACK_OFFPEAK_RESTRICTION_MODAL,
    css: MarketplacePaymentPackOffPeakRestrictionModalCss,
    pages: [MarketplacePage.PASS],
    defaultState: {},
    variations: [],
  };

export const MARKETPLACE_PAYMENT_PACK_OFFPEAK_RESTRICTION_MODAL_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(() => {
  const componentProps = usePropsFromVariation();
  return <MarketplacePaymentPackOffPeakRestrictionModal {...componentProps} />;
});
