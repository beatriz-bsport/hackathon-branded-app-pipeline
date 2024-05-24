import React from 'react';

import { fakerEN as faker } from '@faker-js/faker';

import MinimalPrivatePassCard, { type Props } from '.';

// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MinimalPrivatePassCardCss from './styles.css?raw';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';

import { privatePassFactory } from '#libs/private-service/factory';

const privatePass = privatePassFactory();

const quantity = faker.number.int(10);

const minimalPrivatePassCardRegistry = [
  {
    label: 'loading',
    choices: [
      {
        label: 'true',
        value: 'true',
      },
      {
        label: 'false',
        value: 'false',
      },
    ],
    default: {
      label: 'false',
      value: 'false',
    },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Props => {
  const isLoading = variationsSelected?.loading?.value === 'true';
  return {
    isLoading,
    quantity,
    privatePass,
  };
};

export const MINIMAL_PRIVATE_PASS_CARD_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MINIMAL_PRIVATE_PASS_CARD,
    css: MinimalPrivatePassCardCss,
    pages: [MarketplacePage.PASS],
    defaultState: {},
    variations: minimalPrivatePassCardRegistry,
  };

export const MINIMAL_PRIVATE_PASS_CARD_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  return (
    <div style={{ width: '100%' }}>
      <MinimalPrivatePassCard {...componentProps} />
    </div>
  );
});
