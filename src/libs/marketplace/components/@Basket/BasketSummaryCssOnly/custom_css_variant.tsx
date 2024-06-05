import React from 'react';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { basketFactory } from '#libs/checkout/factories';
import { CompanyTheme } from '#libs/theme/types';
import {
  HandleAddCheckoutItemData,
  OnRemoveCheckoutItemData,
} from '#libs/checkout/types';
// @ts-expect-error
import BasketSummaryCssOnlyCss from './styles.css?raw';
import BasketSummaryCssOnly, { Props } from '.';

const marketplaceBasketSummaryVariationRegistry = [
  {
    label: 'loading',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'basketIsEmpty',
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
  const loading = variationsSelected?.loading?.value === 'true';
  const basketIsEmpty = variationsSelected?.basketIsEmpty?.value === 'true';
  const basket = basketFactory(basketIsEmpty ? 0 : 4);
  return {
    isExcludingTax: companyTheme?.is_tax_excluded_in_marketplace,
    // @ts-expect-error TODO : Update once following merge request for prepaidLine done.
    basket,
    loading,
    // eslint-disable-next-line
    onAddCheckoutItem: (data: HandleAddCheckoutItemData) => {},
    onRemoveCheckoutItem: (
      // eslint-disable-next-line
      checkoutItemBeingRemoved: OnRemoveCheckoutItemData,
    ) => {},
  };
};

export const MARKETPLACE_BASKET_SUMMARY_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_BASKET_SUMMARY_PREVIEW,
    css: BasketSummaryCssOnlyCss,
    pages: [MarketplacePage.BASKET],
    defaultState: {},
    variations: marketplaceBasketSummaryVariationRegistry,
  };

export const MARKETPLACE_BASKET_SUMMARY_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected, theme }) => {
  const componentProps = usePropsFromVariation(variationsSelected, theme);
  return <BasketSummaryCssOnly {...componentProps} />;
});
