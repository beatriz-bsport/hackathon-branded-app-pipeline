import React from 'react';
import MarketplaceContractDetail, {
  Props as MarketplaceContractDetailProps,
} from '.';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplaceContractDetailCss from '!!raw-loader!./styles.css';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { PaymentCombo } from '#libs/payment-combo/types';
import { CompanyTheme } from '#libs/theme/types';

import { contractFactory } from '#libs/subscription/factory';
import { paymentComboFactory } from '#libs/payment-combo/factory';
import { paymentPackFactory } from '#libs/payment-packs/factory';
import { privatePassFactory } from '#libs/private-service/factory';

const contractDetailVariationRegistry = [
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
): MarketplaceContractDetailProps => {
  const isExcludingTaxSelected =
    variationsSelected?.isExcludingTax?.value === 'true';

  return {
    contract: contractFromFactory,
    isExcludingTax: isExcludingTaxSelected,
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

export const MARKETPLACE_CONTRACT_DETAIL_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: 'contractDetail',
    css: MarketplaceContractDetailCss,
    pages: [MarketplacePage.SUBSCRIPTION],
    defaultState: {},
    variations: contractDetailVariationRegistry,
  };

export const MARKETPLACE_CONTRACT_DETAIL_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  return <MarketplaceContractDetail {...componentProps} />;
});
