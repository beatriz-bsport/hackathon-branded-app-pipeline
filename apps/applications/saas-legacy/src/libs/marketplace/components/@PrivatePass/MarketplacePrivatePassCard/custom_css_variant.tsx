import React from 'react';
import { CssComponentsVariantIdentifiers } from '#src/libs/exportable-components/constants';

import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#src/libs/exportable-components/types';
import { CompanyTheme } from '#src/libs/theme/types';

import { privatePassFactory } from '#src/libs/private-service/factory';
// @ts-expect-error
import MarketplacePrivatePassCardCss from './styles.css?raw';
import MarketplacePrivatePassCard, {
  Props as MarketplacePrivatePassCardProps,
} from '.';

const privatePassCardVariationRegistry = [
  {
    label: 'isExcludingTax',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];

const privatePassFromFactory = privatePassFactory();

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): MarketplacePrivatePassCardProps => {
  const isExcludingTaxSelected =
    variationsSelected?.isExcludingTax?.value === 'true';

  return {
    privatePass: privatePassFromFactory,
    isExcludingTax: isExcludingTaxSelected,
    addToCart: () => {},
    onOpenDetailDialog: () => {},
  };
};

export const MARKETPLACE_PRIVATE_PASS_CARD_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_PRIVATE_PASS_CARD,
    css: MarketplacePrivatePassCardCss,
    pages: [MarketplacePage.PASS],
    defaultState: {},
    variations: privatePassCardVariationRegistry,
  };

export const MARKETPLACE_PRIVATE_PASS_CARD_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  return <MarketplacePrivatePassCard {...componentProps} />;
});
