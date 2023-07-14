import React from 'react';
import MarketplacePaymentPackRestrictionModal, {
  Props as MarketplacePaymentPackRestrictionModalProps,
} from '.';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplacePaymentPackRestrictionModalCss from '!!raw-loader!./styles.css';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
} from '#libs/exportable-components/types';

import { paymentPackFactory } from '#libs/payment-packs/factory';

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
    label: 'paymentPackRestrictionModal',
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
