import React from 'react';
import MarketplaceContractCheckout, {
  Props as MarketplaceContractCheckoutProps,
} from '.';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplaceContractCheckoutCss from '!!raw-loader!./styles.css';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';

import FactoryBotSubscription from '#libs/subscription/factory';
import FactoryBotPaymentCombo from '#libs/payment-combo/factory';
import FactoryBotPaymentPack from '#libs/payment-packs/factory';
import { private_services_passes_factory } from '#libs/private-service/factory';

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

const contractFromFactory = FactoryBotSubscription.Contract.create();
const fakePaymentCombo = FactoryBotPaymentCombo.PaymentCombo.create();
const fakepaymentPack = FactoryBotPaymentPack.PaymentPack.create();
const fakePrivatePass = private_services_passes_factory(1)[0];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): MarketplaceContractCheckoutProps => {
  const isExcludingTaxSelected =
    variationsSelected?.isExcludingTax?.value === 'true';

  return {
    contract: contractFromFactory,
    isExcludingTax: isExcludingTaxSelected,
    onSelect: () => {},
    getPaymentComboSelected: (id: number) => {
      return { ...fakePaymentCombo, id };
    },
    getPaymentPackSelected: (id: number) => {
      return { ...fakepaymentPack, id };
    },
    // @ts-expect-error
    getPrivatePassSelected: (id: number) => {
      return { ...fakePrivatePass, id };
    },
  };
};

export const MARKETPLACE_CONTRACT_CHECKOUT_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: 'contractCheckout',
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
