import React from 'react';

import { fakerEN as faker } from '@faker-js/faker';

import MinimalPaymentPackCard, { type Props } from '.';

// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MinimalPaymentPackCardCss from './styles.css?raw';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';

import { paymentPackFactory } from '#libs/payment-packs/factory';

const paymentPack = paymentPackFactory();

const quantity = faker.number.int(10);

const minimalPaymentPackCardRegistry = [
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
    paymentPack,
  };
};

export const MINIMAL_PAYMENT_PACK_CARD_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MINIMAL_PAYMENT_PACK_CARD,
    css: MinimalPaymentPackCardCss,
    pages: [MarketplacePage.PASS],
    defaultState: {},
    variations: minimalPaymentPackCardRegistry,
  };

export const MINIMAL_PAYMENT_PACK_CARD_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  return (
    <div style={{ width: '100%' }}>
      <MinimalPaymentPackCard {...componentProps} />
    </div>
  );
});
