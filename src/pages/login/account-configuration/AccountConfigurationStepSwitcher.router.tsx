import React from 'react';

import { Redirect } from 'react-router-dom';
import { ConnectedProps, connect } from 'react-redux';
import { RootState } from '../../../reducers';
import {
  AccountConfigurationBankAccountStepUrl,
  AccountConfigurationFinalStepUrl,
  AccountConfigurationPaymentMethodStepUrl,
  AccountConfigurationWelcomeStepUrl,
} from './AccountConfiguration.router';

export const AccountConfigurationStepSwitcher: React.FC<
  ConnectedProps<typeof connector>
> = ({ stripeCompany }) => {
  const {
    has_completed_stripe_configuration,
    has_completed_bank_account_configuration,
    has_completed_payment_method_configuration,
    has_no_need_for_stripe_configuration,
    has_no_need_for_bank_account_configuration,
    has_no_need_for_payment_method_configuration,
  } = stripeCompany;

  const need_stripe_configuration = !has_no_need_for_stripe_configuration;

  const need_bank_account_configuration =
    !has_no_need_for_bank_account_configuration;

  const need_payment_method_configuration =
    !has_no_need_for_payment_method_configuration;

  if (
    (!has_completed_stripe_configuration && need_stripe_configuration) ||
    (has_no_need_for_stripe_configuration &&
      !has_completed_payment_method_configuration)
  ) {
    return <Redirect to={AccountConfigurationWelcomeStepUrl} />;
  }
  if (
    !has_completed_bank_account_configuration &&
    need_stripe_configuration &&
    need_bank_account_configuration
  ) {
    return <Redirect to={AccountConfigurationBankAccountStepUrl} />;
  }
  if (
    need_payment_method_configuration ||
    !has_completed_payment_method_configuration
  ) {
    return <Redirect to={AccountConfigurationPaymentMethodStepUrl} />;
  }
  return <Redirect to={AccountConfigurationFinalStepUrl} />;
};

const connector = connect((state: RootState) => ({
  stripeCompany: state.company.stripeCompany.data,
}));

export default connector(AccountConfigurationStepSwitcher);
