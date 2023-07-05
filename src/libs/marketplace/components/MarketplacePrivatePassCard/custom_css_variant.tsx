import React from 'react';
import MarketplacePrivatePassCard, {
  Props as MarketplacePrivatePassCardProps,
} from '.';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplacePrivatePassCardCss from '!!raw-loader!./styles.css';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';

import { private_services_passes_factory } from '#libs/private-service/factory';

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

const privatePassFromFactory = private_services_passes_factory(1)[0];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): MarketplacePrivatePassCardProps => {
  const isExcludingTaxSelected =
    variationsSelected?.isExcludingTax?.value === 'true';

  return {
    // @ts-ignore
    privatePass: privatePassFromFactory,
    isExcludingTax: isExcludingTaxSelected,
    addToCart: () => {},
    onOpenDetailDialog: () => {},
  };
};

export const MARKETPLACE_PRIVATE_PASS_CARD_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: 'privatePassCard',
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
