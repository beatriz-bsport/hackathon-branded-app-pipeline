import React from 'react';

import { MarketplaceContractPaymentMethodListForStorybook, Props } from '.';
import { payment_method_list_factory } from '#src/libs/payment/factory';
import { MarketplacePaymentMethods } from '#src/libs/marketplace/types';

const ContractPaymentMethodListTemplate = (args: Props) => (
  // @ts-expect-error
  <MarketplaceContractPaymentMethodListForStorybook {...args} />
);

export const CardPaymentMethodList = ContractPaymentMethodListTemplate.bind({});
CardPaymentMethodList.args = {
  isContractLegalTermsAccepted: false,
  paymentMethods: payment_method_list_factory(2, 2),
  selectedPaymentMethod: null,
  paymentMethodType: MarketplacePaymentMethods.card,
  onDetachPaymentMethod: () => {},
  onSelectPaymentMethod: () => {},
};

export const SepaPaymentMethodList = ContractPaymentMethodListTemplate.bind({});
SepaPaymentMethodList.args = {
  isContractLegalTermsAccepted: false,
  paymentMethods: payment_method_list_factory(2, 2),
  selectedPaymentMethod: null,
  paymentMethodType: MarketplacePaymentMethods.sepa,
  onDetachPaymentMethod: () => {},
  onSelectPaymentMethod: () => {},
};

export default {
  title:
    'Components/Marketplace/Subscriptions/MarketplaceContractPaymentMethodList',
  component: MarketplaceContractPaymentMethodListForStorybook,
  parameters: {
    docs: {
      page: null,
    },
    layout: 'centered',
  },
};
