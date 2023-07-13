import React from 'react';
import MarketplaceContractCard, {
  Props as MarketplaceContractCardProps,
} from '.';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplaceContractCardCss from '!!raw-loader!./styles.css';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';

import { contractFactory } from '#libs/subscription/factory';

const contractCardVariationRegistry = [
  {
    label: 'isExcludingTax',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];

const contractFromFactory = contractFactory();

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): MarketplaceContractCardProps => {
  const isExcludingTaxSelected =
    variationsSelected?.isExcludingTax?.value === 'true';

  return {
    contract: contractFromFactory,
    isExcludingTax: isExcludingTaxSelected,
    addToCart: () => {},
    onOpenDetailDialog: () => {},
  };
};

export const MARKETPLACE_CONTRACT_CARD_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: 'contractCard',
    css: MarketplaceContractCardCss,
    pages: [MarketplacePage.SUBSCRIPTION],
    defaultState: {},
    variations: contractCardVariationRegistry,
  };

export const MARKETPLACE_CONTRACT_CARD_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  return <MarketplaceContractCard {...componentProps} />;
});
