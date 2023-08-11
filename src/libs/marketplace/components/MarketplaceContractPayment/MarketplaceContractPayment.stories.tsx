import React from 'react';
import moment from 'moment-timezone';

import { MarketplaceContractPaymentForStorybook, Props } from '.';
import { contractFactory } from '#libs/subscription/factory';
import { payment_method_list_factory } from '#libs/payment/factory';
import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
} from '@bsport/common/lib/master-data/payment-group';

const fakeContract = contractFactory();
const defaultArgs = {
  contract: fakeContract,
  isContractLegalTermsAccepted: false,
  isLoading: false,
  date: moment().format(),
  enabledPaymentMethods: [
    PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
    PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
    PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
  ],
  enabledPaymentGroupMethodIdentifier: [
    PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
    PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
    PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
  ],
  // @ts-ignore
  savedPaymentMethodList: [],
  sepaDefaultName: 'John Doe',
  sepaDefaultEmail: 'john.doe@gmail.com',
  onlinePaymentEnabled: true,
  isExcludingTax: false,
  detachPaymentMethod: () => {},
  setDate: () => {},
  setAcceptContract: () => {},
  onOpenContractTermsDialog: () => {},
  requestSetupIntentSecret: () => {},
  refreshSavedPaymentMethodList: () => {},
  onCancel: () => {},
  onSubmit: () => {},
  cardBillingDetailsMandatory: true,
  paymentMethodFetchDone: true,
};

const ContractPaymentTemplate = (args: Props) => (
  // @ts-ignore
  <MarketplaceContractPaymentForStorybook {...args} />
);

export const CardOnlyContractPayment = ContractPaymentTemplate.bind({});
CardOnlyContractPayment.args = {
  ...defaultArgs,
  enabledPaymentMethods: [PAYMENT_GROUP_METHOD_IDENTIFIER_CB],
  enabledPaymentGroupMethodIdentifier: [PAYMENT_GROUP_METHOD_IDENTIFIER_CB],
  savedPaymentMethodList: payment_method_list_factory(3, 3),
};

export const NoPaymentMethodContractPayment = ContractPaymentTemplate.bind({});
NoPaymentMethodContractPayment.args = {
  ...defaultArgs,
  enabledPaymentMethods: [
    PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
    PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
  ],
  enabledPaymentGroupMethodIdentifier: [
    PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
    PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
  ],
};

export const CardSepaContractPayment = ContractPaymentTemplate.bind({});
CardSepaContractPayment.args = {
  ...defaultArgs,
  enabledPaymentMethods: [
    PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
    PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
  ],
  enabledPaymentGroupMethodIdentifier: [
    PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
    PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
  ],
  savedPaymentMethodList: payment_method_list_factory(3, 3),
};

export default {
  title: 'Components/Marketplace/Subscriptions/MarketplaceContractPayment',
  component: MarketplaceContractPaymentForStorybook,
  parameters: {
    docs: {
      page: null,
    },
    layout: 'centered',
  },
};
