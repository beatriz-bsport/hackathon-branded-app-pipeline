import React from 'react';
import moment from 'moment-timezone';
import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
} from '@bsport/common/lib/master-data/payment-group';

import MarketplaceContractPayment, {
  Props as MarketplaceContractPaymentProps,
} from '.';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import MarketplaceContractPaymentCss from '!!raw-loader!./styles.css';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';

import { contractFactory } from '#libs/subscription/factory';

const contractPaymentVariationRegistry = [
  {
    label: 'isExcludingTax',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
  {
    label: 'isContractLegalTermsAccepted',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },
];

const contractFromFactory = contractFactory();

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): MarketplaceContractPaymentProps => {
  const isExcludingTaxSelected =
    variationsSelected?.isContractLegalTermsAccepted?.value === 'true';
  const isContractLegalTermsAcceptedSelected =
    variationsSelected?.isContractLegalTermsAccepted?.value === 'true';

  return {
    contract: contractFromFactory,
    isExcludingTax: isExcludingTaxSelected,
    isContractLegalTermsAccepted: isContractLegalTermsAcceptedSelected,
    billingStartDate: moment().add(1, 'week').format(),
    enabledPaymentMethodsIds: [
      PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
      PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
      PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
    ],
    enabledPaymentGroupMethodIdentifierIds: [
      PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
      PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
      PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
    ],
    savedPaymentMethodList: [],
    refreshSavedPaymentMethodList: () => {},
    detachPaymentMethod: () => {},
    setBillingStartDate: () => {},
    onOpenContractTermsDialog: () => {},
    onCancelContractPayment: () => {},
    onSubmitContractPayment: () => {},
    setAcceptContractLegalTerms: () => {},
    requestSetupIntentSecret: () => {
      return { data: { client_secret: '' } };
    },
    companyId: '',
    cardBillingDetailsMandatory: true,
    paymentMethodFetchDone: true,
    enableMultiLocalization: false,
  };
};

export const MARKETPLACE_CONTRACT_PAYMENT_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.MARKETPLACE_CONTRACT_PAYMENT,
    css: MarketplaceContractPaymentCss,
    pages: [MarketplacePage.SUBSCRIPTION],
    defaultState: {},
    variations: contractPaymentVariationRegistry,
  };

export const MARKETPLACE_CONTRACT_PAYMENT_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  return <MarketplaceContractPayment {...componentProps} />;
});
