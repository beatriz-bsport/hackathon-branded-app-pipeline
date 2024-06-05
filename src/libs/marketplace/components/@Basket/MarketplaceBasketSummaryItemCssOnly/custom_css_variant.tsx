import React from 'react';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { checkoutItemFactory } from '#libs/checkout/factories';
import { CompanyTheme } from '#libs/theme/types';
import { CheckoutItem } from '#libs/checkout/types';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplaceBasketSummaryItemCss from './styles.css?raw';
import MarketplaceBasketSummaryItemCssOnly, { Props } from '.';

const checkoutItem = checkoutItemFactory();

const marketplaceBasketSummaryItemVariationRegistry = [
  {
    label: 'isItemEditionDisabled',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isDense',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
  companyTheme: CompanyTheme,
  itemQuantity: number,
  onAddOneItem: (checkoutItem: CheckoutItem) => void,
  onRemoveItem: (checkoutItem: CheckoutItem) => void,
): Props => {
  const isDense = variationsSelected?.isDense?.value === 'true';

  const isItemEditionDisabled =
    variationsSelected?.isItemEditionDisabled?.value === 'true';
  return {
    isExcludingTax: companyTheme?.is_tax_excluded_in_marketplace,
    checkoutItem: { ...checkoutItem, quantity: itemQuantity },
    dense: isDense,
    onAddOneItem,
    onRemoveItem,
    isItemEditionDisabled,
  };
};

export const MARKETPLACE_BASKET_SUMMARY_ITEM_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label:
      CssComponentsVariantIdentifiers.MARKETPLACE_BASKET_SUMMARY_ITEM_PREVIEW,
    css: MarketplaceBasketSummaryItemCss,
    pages: [MarketplacePage.BASKET],
    defaultState: {},
    variations: marketplaceBasketSummaryItemVariationRegistry,
  };

export const MARKETPLACE_BASKET_SUMMARY_ITEM_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected, theme }) => {
  const [itemQuantity, setItemQuantity] = React.useState(1);

  const onAddOneItem = () =>
    setItemQuantity((prevItemQuantity) => prevItemQuantity + 1);

  const onRemoveOneItem = () =>
    setItemQuantity((prevItemQuantity) => Math.max(prevItemQuantity - 1, 1));

  const componentProps = usePropsFromVariation(
    variationsSelected,
    theme,
    itemQuantity,
    onAddOneItem,
    onRemoveOneItem,
  );
  return <MarketplaceBasketSummaryItemCssOnly {...componentProps} />;
});
