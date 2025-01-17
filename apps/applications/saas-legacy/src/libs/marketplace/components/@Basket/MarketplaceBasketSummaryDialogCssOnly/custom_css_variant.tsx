import React from 'react';

import { CssComponentsVariantIdentifiers } from '#src/libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#src/libs/exportable-components/types';
import { basketFactory } from '#src/libs/checkout/factories';
import { CompanyTheme } from '#src/libs/theme/types';
import {
  HandleAddCheckoutItemData,
  OnRemoveCheckoutItemData,
} from '#src/libs/checkout/types';
// @ts-expect-error
import BasketSummaryCssOnlyDialogCss from './styles.css?raw';
import BasketSummaryCssOnlyDialog, { Props } from '.';

const marketplaceBasketSummaryDialogVariationRegistry = [
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

    onAddCheckoutItem: (_data: HandleAddCheckoutItemData) => {},
    onRemoveCheckoutItem: (
      _checkoutItemBeingRemoved: OnRemoveCheckoutItemData,
    ) => {},
    open: true,
    goToCheckout: () => {},
    onCancel: () => {},
    isCustomCssPreview: true,
  };
};

export const MARKETPLACE_BASKET_SUMMARY_DIALOG_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label:
      CssComponentsVariantIdentifiers.MARKETPLACE_BASKET_SUMMARY_DIALOG_PREVIEW,
    css: BasketSummaryCssOnlyDialogCss,
    pages: [MarketplacePage.BASKET],
    defaultState: {},
    variations: marketplaceBasketSummaryDialogVariationRegistry,
  };

export const MARKETPLACE_BASKET_SUMMARY_DIALOG_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected, theme }) => {
  const componentProps = usePropsFromVariation(variationsSelected, theme);
  return <BasketSummaryCssOnlyDialog {...componentProps} />;
});
