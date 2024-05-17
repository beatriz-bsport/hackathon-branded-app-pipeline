import React from 'react';

import { fakerEN as faker } from '@faker-js/faker';

import MinimalPaymentComboCard, { type Props } from '.';

// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MinimalPaymentComboCardCss from '!!raw-loader!./styles.css';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';

import { paymentComboFactory } from '#libs/payment-combo/factory';

const paymentCombo = paymentComboFactory();

const quantity = faker.number.int(10);

const minimalPaymentComboCardRegistry = [
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
    paymentCombo,
  };
};

export const MINIMAL_PAYMENT_COMBO_CARD_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MINIMAL_PAYMENT_COMBO_CARD,
    css: MinimalPaymentComboCardCss,
    pages: [MarketplacePage.PASS],
    defaultState: {},
    variations: minimalPaymentComboCardRegistry,
  };

export const MINIMAL_PAYMENT_COMBO_CARD_CARD_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  return (
    <div style={{ width: '100%' }}>
      <MinimalPaymentComboCard {...componentProps} />
    </div>
  );
});
