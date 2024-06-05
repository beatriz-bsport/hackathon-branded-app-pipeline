import React from 'react';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';
import { PaymentCombo } from '#libs/payment-combo/types';

import { contractFactory } from '#libs/subscription/factory';
import { paymentComboFactory } from '#libs/payment-combo/factory';
import { paymentPackFactory } from '#libs/payment-packs/factory';
import { privatePassFactory } from '#libs/private-service/factory';
// @ts-expect-error
import MarketplaceContractCheckoutCss from './styles.css?raw';
import MarketplaceContractCheckout, {
  Props as MarketplaceContractCheckoutProps,
} from '.';

const contractCardVariationRegistry = [
  {
    label: 'isExcludingTax',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];

const contractFromFactory = contractFactory();
const fakePaymentCombo = paymentComboFactory();
const fakepaymentPack = paymentPackFactory();
const fakePrivatePass = privatePassFactory();

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): MarketplaceContractCheckoutProps => {
  const isExcludingTaxSelected =
    variationsSelected?.isExcludingTax?.value === 'true';

  return {
    contract: contractFromFactory,
    isExcludingTax: isExcludingTaxSelected,
    isContractObjectLoading: false,
    onSelect: () => {},
    getPaymentComboSelected: (id: number) => {
      return { ...fakePaymentCombo, id } as PaymentCombo;
    },
    getPaymentPackSelected: (id: number) => {
      return { ...fakepaymentPack, id };
    },
    getPrivatePassSelected: (id: number) => {
      return { ...fakePrivatePass, id };
    },
  };
};

export const MARKETPLACE_CONTRACT_CHECKOUT_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_CONTRACT_CHECKOUT,
    css: MarketplaceContractCheckoutCss,
    pages: [MarketplacePage.SUBSCRIPTION],
    defaultState: {},
    variations: contractCardVariationRegistry,
  };

export const MARKETPLACE_CONTRACT_CHECKOUT_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  return <MarketplaceContractCheckout {...componentProps} />;
});
