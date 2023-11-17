import React from 'react';

import { fakerEN as faker } from '@faker-js/faker';

import MarketplaceProductItem, { type Props } from '.';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplaceProductItemCss from '!!raw-loader!./styles.css';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';

import { generateRandomName } from '#utils/factories';

const quantity = faker.number.int(10);

const name = generateRandomName(faker);

const price = faker.number.int(10);

const tax = faker.number.int(30);

const marketplaceProductItemVariationRegistry = [
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
    name,
    price,
    tax,
  };
};

export const MARKETPLACE_PRODUCT_ITEM_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_PRODUCT_ITEM,
    css: MarketplaceProductItemCss,
    pages: [MarketplacePage.CHECKOUT_CONFIRMATION],
    defaultState: {},
    variations: marketplaceProductItemVariationRegistry,
  };

export const MARKETPLACE_PRODUCT_ITEM_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  return (
    <div style={{ width: '100%' }}>
      <MarketplaceProductItem {...componentProps} />
    </div>
  );
});
