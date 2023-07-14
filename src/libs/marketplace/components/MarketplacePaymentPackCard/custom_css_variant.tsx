import React from 'react';
import MarketplacePaymentPackCard, {
  Props as MarketplacePaymentPackCardProps,
} from '.';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplacePaymentPackCardCss from '!!raw-loader!./styles.css';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';

import { paymentPackFactory } from '#libs/payment-packs/factory';

const paymentPackCardVariationRegistry = [
  {
    label: 'isExcludingTax',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];

const paymentPackFromFactory = paymentPackFactory();

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): MarketplacePaymentPackCardProps => {
  const isExcludingTaxSelected =
    variationsSelected?.isExcludingTax?.value === 'true';

  return {
    paymentPack: paymentPackFromFactory,
    isExcludingTax: isExcludingTaxSelected,
    addToCart: () => {},
    onOpenDetailDialog: () => {},
  };
};

export const MARKETPLACE_PAYMENT_PACK_CARD_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: 'paymentPackCard',
    css: MarketplacePaymentPackCardCss,
    pages: [MarketplacePage.PASS],
    defaultState: {},
    variations: paymentPackCardVariationRegistry,
  };

export const MARKETPLACE_PAYMENT_PACK_CARD_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  return <MarketplacePaymentPackCard {...componentProps} />;
});
