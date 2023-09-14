import React from 'react';
import {
  MarketplaceCollectPaymentMethodForStorybook as MarketplaceCollectPaymentMethod,
  Props as MarketplaceCollectPaymentMethodProps,
} from '.';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplaceCollectPaymentMethodCss from '!!raw-loader!./styles.css';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { MarketplacePaymentMethods } from '#libs/marketplace/types';

const offerCardVariationRegistry = [
  {
    label: 'paymentMethodType',
    choices: [
      {
        label: MarketplacePaymentMethods.card,
        value: MarketplacePaymentMethods.card,
      },
      {
        label: MarketplacePaymentMethods.sepa,
        value: MarketplacePaymentMethods.sepa,
      },
      {
        label: MarketplacePaymentMethods.bacs,
        value: MarketplacePaymentMethods.bacs,
      },
    ],
    default: {
      label: MarketplacePaymentMethods.card,
      value: MarketplacePaymentMethods.card,
    },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): Omit<
  MarketplaceCollectPaymentMethodProps,
  'stripe' | 'elements' | 'onSuccess' | 'onCancel'
> => {
  const typeSelected = variationsSelected?.paymentMethodType
    ?.value as MarketplacePaymentMethods;

  return {
    type: typeSelected,
    isOpen: true,
    sepaDefaultName: '',
    sepaDefaultEmail: '',
    requestSetupIntentSecret: () => ({
      data: {
        client_secret: 'stripeSecretKey',
      },
    }),
    savedPaymentMethodList: [],
    areInitialBillingDetailsNecessary: false,
    billingDetails: {
      name: '',
      email: '',
      address: {
        line1: '',
        line2: '',
        postal_code: '',
        city: '',
        country: 'GB',
        state: '',
      },
    },
    setBillingDetails: () => {},
    cardBillingDetailsMandatory: true,
    paymentMethodFetchDone: true,
    isContractLegalTermsAccepted: true,
  };
};

export const MARKETPLACE_COLLECT_PAYMENT_METHOD_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_COLLECT_PAYMENT_METHOD,
    css: MarketplaceCollectPaymentMethodCss,
    pages: [MarketplacePage.SUBSCRIPTION],
    defaultState: {},
    variations: offerCardVariationRegistry,
  };

export const MARKETPLACE_COLLECT_PAYMENT_METHOD_PREVIEW: React.FC<{
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  return (
    // @ts-expect-error
    <MarketplaceCollectPaymentMethod {...componentProps} />
  );
});
