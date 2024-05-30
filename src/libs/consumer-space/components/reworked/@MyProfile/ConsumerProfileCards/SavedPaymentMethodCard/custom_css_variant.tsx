import React from 'react';

import SavedPaymentMethodCard from '.';

// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import SavedPaymentMethodCardCss from '!!raw-loader!./styles.css';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import { payment_method_list_factory } from '#src/libs/payment/factory';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';

const paymentMethods = payment_method_list_factory(3, 3);

const ConsumerSavedPaymentMethdodsCardVariationRegistry = [
  {
    label: 'loading',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];

export const CONSUMER_SAVED_PAYMENT_METHODS_CARD_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.CONSUMER_SAVED_PAYMENT_METHODS_CARD,
    css: SavedPaymentMethodCardCss,
    pages: [MarketplacePage.CONSUMER_SPACE],
    defaultState: {},
    variations: ConsumerSavedPaymentMethdodsCardVariationRegistry,
  };

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
) => {
  const detachPaymentMethodLoading =
    variationsSelected?.loading?.value === 'true';
  const paymentMethodLoading = variationsSelected?.loading?.value === 'true';
  return {
    detachPaymentMethodLoading,
    paymentMethodLoading,
  };
};

export const CONSUMER_SAVED_PAYMENT_METHODS_CARD_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  const emptyFn = () => {};

  return (
    <SavedPaymentMethodCard
      {...componentProps}
      detachPaymentMethod={emptyFn}
      openAddPaymentMethodDialog={emptyFn}
      paymentMethods={paymentMethods}
    />
  );
});
