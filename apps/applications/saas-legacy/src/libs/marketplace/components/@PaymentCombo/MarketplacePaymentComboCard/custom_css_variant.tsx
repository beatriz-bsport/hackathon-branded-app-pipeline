import React from 'react';
import { CssComponentsVariantIdentifiers } from '#src/libs/exportable-components/constants';

import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#src/libs/exportable-components/types';
import { CompanyTheme } from '#src/libs/theme/types';
import { PaymentCombo } from '#src/libs/payment-combo/types';

import { paymentComboFactory } from '#src/libs/payment-combo/factory';
// @ts-expect-error
import MarketplacePaymentComboCardCss from './styles.css?raw';
import MarketplacePaymentComboCard, {
  Props as MarketplacePaymentComboCardProps,
} from './MarketplacePaymentComboCard.component';

const paymentComboCardVariationRegistry = [
  {
    label: 'isExcludingTax',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];

const paymentComboFromFactory = paymentComboFactory();

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): MarketplacePaymentComboCardProps => {
  const isExcludingTaxSelected =
    variationsSelected?.isExcludingTax?.value === 'true';

  return {
    paymentCombo: paymentComboFromFactory as PaymentCombo,
    isExcludingTax: isExcludingTaxSelected,
    onClick: () => {},
    addToCart: () => {},
    onOpenDetailDialog: () => {},
  };
};

export const MARKETPLACE_PAYMENT_COMBO_CARD_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_PAYMENT_COMBO_CARD,
    css: MarketplacePaymentComboCardCss,
    pages: [MarketplacePage.PASS],
    defaultState: {},
    variations: paymentComboCardVariationRegistry,
  };

export const MARKETPLACE_PAYMENT_COMBO_CARD_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  return <MarketplacePaymentComboCard {...componentProps} />;
});
