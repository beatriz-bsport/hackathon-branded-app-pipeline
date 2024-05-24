import React from 'react';

import MinimalSubscriptionCard, { type Props } from '.';

// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MinimalSubscriptionCardCss from './styles.css?raw';

import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { subscriptionFactory } from '#libs/subscription/factory';

const SUBSCRIPTION = subscriptionFactory();

const minimalSubscriptionCardVariationRegistry = [
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
    subscription: SUBSCRIPTION,
  };
};

export const MINIMAL_SUBSCRIPTION_CARD_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MINIMAL_SUBSCRIPTION_CARD,
    css: MinimalSubscriptionCardCss,
    pages: [MarketplacePage.SUBSCRIPTION],
    defaultState: {},
    variations: minimalSubscriptionCardVariationRegistry,
  };

export const MINIMAL_SUBSCRIPTION_CARD_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  return <MinimalSubscriptionCard {...componentProps} />;
});
