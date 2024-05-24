import React from 'react';

import MarketplacePaymentComboBuyableItem from '.';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplacePaymentComboBuyableItemCss from './styles.css?raw';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';
import { paymentComboFactory } from '#libs/payment-combo/factory';

const paymentCombo = paymentComboFactory();

const VariationRegistry = [
  {
    label: 'isRecommended',
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
): React.ComponentProps<typeof MarketplacePaymentComboBuyableItem> => {
  const [selected, setIsSelected] = React.useState(false);

  const handleClick = React.useCallback(
    () => setIsSelected((prevIsSelected) => !prevIsSelected),
    [],
  );
  const isRecommended = variationsSelected?.isRecommended?.value === 'true';
  return {
    paymentCombo: {
      ...paymentCombo,
      highlighted_as_recommended: isRecommended,
    },
    isExcludingTax: theme.is_tax_excluded_in_marketplace,
    onClick: handleClick,
    isSelected: selected,
  };
};

export const BOOKER_MODULE_BUYABLE_ITEM_PAYMENT_COMBO_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label:
      CssComponentsVariantIdentifiers.BOOKER_MODULE_BUYABLE_ITEM_PAYMENT_COMBO,
    css: MarketplacePaymentComboBuyableItemCss,
    pages: [MarketplacePage.BOOKING_PAGE],
    defaultState: {},
    variations: VariationRegistry,
  };

export const BOOKER_MODULE_BUYABLE_ITEM_PAYMENT_COMBO_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected, theme }) => {
  const componentProps = usePropsFromVariation(variationsSelected, theme);
  return <MarketplacePaymentComboBuyableItem {...componentProps} />;
});
