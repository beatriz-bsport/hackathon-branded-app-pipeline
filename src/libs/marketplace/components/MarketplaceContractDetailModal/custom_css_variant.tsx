import React from 'react';
import MarketplaceContractDetailModal, {
  Props as MarketplaceContractDetailModalProps,
} from '.';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplaceContractDetailModalCss from '!!raw-loader!./styles.css';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';

import FactoryBotSubscription from '#libs/subscription/factory';
import FactoryBotPaymentCombo from '#libs/payment-combo/factory';
import { paymentPackFactory } from '#libs/payment-packs/factory';
import { private_services_passes_factory } from '#libs/private-service/factory';

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

const contractFromFactory = FactoryBotSubscription.Contract.create();
const fakePaymentCombo = FactoryBotPaymentCombo.PaymentCombo.create();
const fakepaymentPack = paymentPackFactory();
const fakePrivatePass = private_services_passes_factory(1)[0];

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

export const MARKETPLACE_CONTRACT_DETAIL_MODAL_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: 'contractDetailModal',
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
