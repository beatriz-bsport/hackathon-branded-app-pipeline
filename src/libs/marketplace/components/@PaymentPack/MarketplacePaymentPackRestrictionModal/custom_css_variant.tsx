import React from 'react';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';

import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
} from '#libs/exportable-components/types';

import { paymentPackFactory } from '#libs/payment-packs/factory';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplacePaymentPackRestrictionModalCss from './styles.css?raw';
import MarketplacePaymentPackRestrictionModal, {
  Props as MarketplacePaymentPackRestrictionModalProps,
} from '.';

const fakePaymentPack = paymentPackFactory();

const usePropsFromVariation =
  (): MarketplacePaymentPackRestrictionModalProps => {
    return {
      paymentPack: fakePaymentPack,
      isOpen: true,
      onDialogClose: () => {},
    };
  };

export const MARKETPLACE_PAYMENT_PACK_RESTRICTION_MODAL_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label:
      CssComponentsVariantIdentifiers.MARKETPLACE_PAYMENT_PACK_RESTRICTION_MODAL,
    css: MarketplacePaymentPackRestrictionModalCss,
    pages: [MarketplacePage.PASS],
    defaultState: {},
    variations: [],
  };

export const MARKETPLACE_PAYMENT_PACK_RESTRICTION_MODAL_PREVIEW: React.FC =
  () => {
    const componentProps = usePropsFromVariation();
    return <MarketplacePaymentPackRestrictionModal {...componentProps} />;
  };
