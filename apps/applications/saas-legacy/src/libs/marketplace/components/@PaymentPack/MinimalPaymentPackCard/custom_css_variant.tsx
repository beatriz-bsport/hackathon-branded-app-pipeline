import React from 'react';

import { fakerEN as faker } from '@faker-js/faker';

import { CssComponentsVariantIdentifiers } from '#src/libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#src/libs/exportable-components/types';

import { paymentPackFactory } from '#src/libs/payment-packs/factory';
// @ts-expect-error
import MinimalPaymentPackCardCss from './styles.css?raw';
import MinimalPaymentPackCard, { type Props } from '.';

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
