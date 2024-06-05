import React from 'react';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';
import { contractFactory } from '#libs/subscription/factory';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplacePayContractableItemCss from './styles.css?raw';
import MarketplaceContractBuyableItem from '.';

const contract = contractFactory();

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
): React.ComponentProps<typeof MarketplaceContractBuyableItem> => {
  const isRecommended = variationsSelected?.isRecommended?.value === 'true';

  const isSelected = variationsSelected?.isSelected?.value === 'true';
  return {
    contract: {
      ...contract,
      highlighted_as_recommended: isRecommended,
    },
    isExcludingTax: theme.is_tax_excluded_in_marketplace,
    isSelected,
  };
};

export const BOOKER_MODULE_BUYABLE_ITEM_CONTRACT_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.BOOKER_MODULE_BUYABLE_ITEM_CONTRACT,
    css: MarketplacePayContractableItemCss,
    pages: [MarketplacePage.BOOKING_PAGE],
    defaultState: {},
    variations: VariationRegistry,
  };

export const BOOKER_MODULE_BUYABLE_ITEM_CONTRACT_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected, theme }) => {
  const componentProps = usePropsFromVariation(variationsSelected, theme);
  return <MarketplaceContractBuyableItem {...componentProps} />;
});
