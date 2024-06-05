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
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplaceContractDetailModalCss from './styles.css?raw';
import MarketplaceContractDetailModal, {
  Props as MarketplaceContractDetailModalProps,
} from '.';

const contractDetailModalVariationRegistry = [
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
): MarketplaceContractDetailModalProps => {
  const isExcludingTaxSelected =
    variationsSelected?.isExcludingTax?.value === 'true';

  return {
    isOpen: true,
    contract: contractFromFactory,
    isExcludingTax: isExcludingTaxSelected,
    onAddToCart: () => {},
    onDialogClose: () => {},
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

export const MARKETPLACE_CONTRACT_DETAIL_MODAL_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_CONTRACT_DETAIL_MODAL,
    css: MarketplaceContractDetailModalCss,
    pages: [MarketplacePage.SUBSCRIPTION],
    defaultState: {},
    variations: contractDetailModalVariationRegistry,
  };

export const MARKETPLACE_CONTRACT_DETAIL_MODAL_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  return <MarketplaceContractDetailModal {...componentProps} />;
});
