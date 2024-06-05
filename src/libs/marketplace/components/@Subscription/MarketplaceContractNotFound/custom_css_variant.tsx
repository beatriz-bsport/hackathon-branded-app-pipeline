import React from 'react';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';
// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplaceContractNotFoundCss from './styles.css?raw';
import MarketplaceContractNotFound from '.';

export const MARKETPLACE_CONTRACT_NOT_FOUND_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_CONTRACT_NOT_FOUND,
    css: MarketplaceContractNotFoundCss,
    pages: [MarketplacePage.SUBSCRIPTION],
    defaultState: {},
    variations: [],
  };

export const MARKETPLACE_CONTRACT_NOT_FOUND_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(() => {
  return <MarketplaceContractNotFound />;
});
