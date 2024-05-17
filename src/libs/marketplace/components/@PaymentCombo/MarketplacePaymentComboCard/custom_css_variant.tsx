import React from 'react';
import MarketplacePaymentComboCard, {
  Props as MarketplacePaymentComboCardProps,
} from './MarketplacePaymentComboCard.component';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplacePaymentComboCardCss from '!!raw-loader!./styles.css';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';

import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';
import { PaymentCombo } from '#libs/payment-combo/types';

import { paymentComboFactory } from '#libs/payment-combo/factory';

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
