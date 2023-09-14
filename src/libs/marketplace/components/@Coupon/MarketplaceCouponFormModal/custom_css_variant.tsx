import React from 'react';
import MarketplaceCouponFormModal, {
  Props as MarketplaceCouponFormModalProps,
} from '.';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplaceCouponFormModalCss from '!!raw-loader!./styles.css';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
} from '#libs/exportable-components/types';

const usePropsFromVariation = (): MarketplaceCouponFormModalProps => {
  return {
    isOpen: true,
    onCancel: () => {},
    // @ts-ignore
    onSubmit: () => {},
  };
};

export const MARKETPLACE_CONTRACT_COUPON_FORM_MODAL_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label:
      CssComponentsVariantIdentifiers.MARKETPLACE_CONTRACT_COUPON_FORM_MODAL,
    css: MarketplaceCouponFormModalCss,
    pages: [MarketplacePage.SUBSCRIPTION],
    defaultState: {},
    variations: [],
  };

export const MARKETPLACE_CONTRACT_COUPON_FORM_MODAL_PREVIEW: React.FC = () => {
  const componentProps = usePropsFromVariation();
  return <MarketplaceCouponFormModal {...componentProps} />;
};
