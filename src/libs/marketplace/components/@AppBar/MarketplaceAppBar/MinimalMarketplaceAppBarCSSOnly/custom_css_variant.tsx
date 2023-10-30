import React from 'react';

import { fakerEN as faker } from '@faker-js/faker';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplaceMinimalAppBarCss from '!!raw-loader!./styles.css';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';

import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';
import MinimalMarketplaceAppBarCSSOnly from '.';

const minimalMarketplaceAppBarVariationRegistry = [
  {
    label: 'isRegistered',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'true', value: 'true' },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
) => {
  const isRegisteredSelected =
    variationsSelected?.isRegistered?.value === 'true';

  const auth = {
    name: 'Client Name',
    username: 'client@email.io',
    authenticated: isRegisteredSelected,
  };

  return auth;
};

export const MARKETPLACE_MINIMAL_APPBAR_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_MINIMAL_APPBAR,
    css: MarketplaceMinimalAppBarCss,
    pages: [MarketplacePage.COMMON],
    defaultState: {},
    variations: minimalMarketplaceAppBarVariationRegistry,
  };

export const MARKETPLACE_MINIMAL_APPBAR_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ theme, variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);

  const photo = faker.image.urlPicsumPhotos();
  return (
    <MinimalMarketplaceAppBarCSSOnly auth={componentProps} photo={photo} />
  );
});
