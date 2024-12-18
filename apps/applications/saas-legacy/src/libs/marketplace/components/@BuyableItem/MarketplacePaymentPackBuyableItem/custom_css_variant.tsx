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
import MarketplacePaymentPackBuyableItemCss from './styles.css?raw';
import MarketplacePaymentPackBuyableItem from '.';

const paymentPack = paymentPackFactory();

const VariationRegistry = [
  {
    label: 'isRecommended',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },

  {
    label: 'isSelected',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
  theme: CompanyTheme,
): React.ComponentProps<typeof MarketplacePaymentPackBuyableItem> => {
  const isRecommended = variationsSelected?.isRecommended?.value === 'true';

  const isSelected = variationsSelected?.isSelected?.value === 'true';
  return {
    paymentPack: {
      ...paymentPack,
      highlighted_as_recommended: isRecommended,
    },
    isExcludingTax: theme.is_tax_excluded_in_marketplace,
    hideCredits: theme.hide_credits_for_customers,
    isSelected,
  };
};

export const BOOKER_MODULE_BUYABLE_ITEM_PAYMENT_PACK_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label:
      CssComponentsVariantIdentifiers.BOOKER_MODULE_BUYABLE_ITEM_PAYMENT_PACK,
    css: MarketplacePaymentPackBuyableItemCss,
    pages: [MarketplacePage.BOOKING_PAGE],
    defaultState: {},
    variations: VariationRegistry,
  };

export const BOOKER_MODULE_BUYABLE_ITEM_PAYMENT_PACK_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected, theme }) => {
  const componentProps = usePropsFromVariation(variationsSelected, theme);
  return <MarketplacePaymentPackBuyableItem {...componentProps} />;
});
