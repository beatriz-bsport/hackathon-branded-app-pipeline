import React from 'react';
import { CssComponentsVariantIdentifiers } from '#src/libs/exportable-components/constants';

import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#src/libs/exportable-components/types';
import { CompanyTheme } from '#src/libs/theme/types';

import { paymentPackFactory } from '#src/libs/payment-packs/factory';
// @ts-expect-error
import MarketplacePaymentPackCardCss from './styles.css?raw';
import MarketplacePaymentPackCard, {
  Props as MarketplacePaymentPackCardProps,
} from '.';

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
    label: CssComponentsVariantIdentifiers.MARKETPLACE_PAYMENT_PACK_CARD,
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
