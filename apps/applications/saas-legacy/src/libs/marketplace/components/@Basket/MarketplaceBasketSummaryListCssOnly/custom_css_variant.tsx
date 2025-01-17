import React from 'react';

import { CssComponentsVariantIdentifiers } from '#src/libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#src/libs/exportable-components/types';
import { checkoutItemsFactory } from '#src/libs/checkout/factories';
import { CompanyTheme } from '#src/libs/theme/types';
import { CheckoutItem } from '#src/libs/checkout/types';
// @ts-expect-error
import MarketplaceBasketSummaryListCss from './styles.css?raw';
import MarketplaceBasketSummaryListCssOnly, { Props } from '.';

const marketplaceBasketSummaryItemVariationRegistry = [
  {
    label: 'numberOfDistinctCheckoutItem',
    choices: [
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
    ],
    default: { label: '1', value: '1' },
  },
  {
    label: 'isDense',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
  {
    label: 'isItemEditionDisabled',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
  companyTheme: CompanyTheme,
): Props => {
  const isDense = variationsSelected?.isDense?.value === 'true';

  const isItemEditionDisabled =
    variationsSelected?.isItemEditionDisabled?.value === 'true';

  const numberOfDistinctCheckoutItem = parseInt(
    variationsSelected?.numberOfDistinctCheckoutItem?.value ?? '1',
  );

  const items = checkoutItemsFactory(numberOfDistinctCheckoutItem);
  return {
    isExcludingTax: companyTheme?.is_tax_excluded_in_marketplace,
    checkoutItems: items,
    dense: isDense,

    onAddCheckoutItem: (_: CheckoutItem) => {},

    onRemoveCheckoutItem: (_: CheckoutItem) => {},
    isItemEditionDisabled,
  };
};

export const MARKETPLACE_BASKET_SUMMARY_LIST_ITEM_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label:
      CssComponentsVariantIdentifiers.MARKETPLACE_BASKET_SUMMARY_LIST_ITEM_PREVIEW,
    css: MarketplaceBasketSummaryListCss,
    pages: [MarketplacePage.BASKET],
    defaultState: {},
    variations: marketplaceBasketSummaryItemVariationRegistry,
  };

export const MARKETPLACE_BASKET_SUMMARY_LIST_ITEM_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected, theme }) => {
  const componentProps = usePropsFromVariation(variationsSelected, theme);
  return <MarketplaceBasketSummaryListCssOnly {...componentProps} />;
});
