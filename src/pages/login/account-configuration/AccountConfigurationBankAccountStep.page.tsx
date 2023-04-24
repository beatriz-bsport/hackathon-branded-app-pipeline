// @ts-nocheck
import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';

import { push } from 'connected-react-router';
import { WithTranslation, withTranslation } from 'react-i18next';
import { LinearProgress } from '@material-ui/core';
import { OptionCallback } from '../../../state/types';
import { RootState } from '../../../reducers';
import BankAccountStep from '#libs/login/components/account-configuration/AccountConfigurationBankAccountStep.component';
import {
  validateAccountConfigurationStepAction,
  retrieveMyCompanySetup as retrieveMyCompanySetupAction,
  attachExternalAccount as attachExternalAccountAction,
} from '#libs/company/actions';
import { CompanySetup } from '#libs/company/types';
import {
  AccountConfigurationFinalStepUrl,
  AccountConfigurationPaymentMethodStepUrl,
  AccountConfigurationStripeStepUrl,
} from './AccountConfiguration.router';
import { BANK_ACCOUNT_CONFIGURATION_STEP } from '#libs/company/constants';

export type Props = ConnectedProps<typeof connector> & WithTranslation;
export class AccountConfigurationBankAccountPage extends Component<Props> {
  retrieveCompanySetup = (options?: OptionCallback<CompanySetup>) => () => {
    this.props.retrieveMyCompanySetup({
      onError: options && options.onError,
      onSuccess: (setup) => {
        if (options && options.onSuccess) options.onSuccess(setup);
      },
    });
  };

  componentDidMount() {
    this.props.retrieveMyCompanySetup();
  }

  attachExternalAccount = (
    token: string,
    options?: OptionCallback<CompanySetup>,
  ) => {
    this.props.attachExternalAccount(token, {
      onSuccess: this.retrieveCompanySetup(options),
      onError: options && options.onError,
    });
  };

  redirect = (link: string) => () => {
    this.props.push(link);
  };

  goNext = () => {
    if (this.props.stripeCompany.has_no_need_for_payment_method_configuration) {
      this.props.push(AccountConfigurationFinalStepUrl);
    } else {
      this.props.push(AccountConfigurationPaymentMethodStepUrl);
    }
  };

  validateBankAccountStep = () => {
    if (!this.props.stripeCompany.has_completed_bank_account_configuration) {
      this.props.validateAccountConfigurationStep(
        {
          step: BANK_ACCOUNT_CONFIGURATION_STEP,
        },
        {
          onSuccess: this.goNext,
        },
      );
    } else {
      this.goNext();
    }
  };

  render() {
    if (!this.props.companySetup) {
      return <LinearProgress />;
    }
    return (
      <BankAccountStep
        has_no_need_for_stripe_configuration={
          this.props.stripeCompany.has_no_need_for_stripe_configuration
        }
        has_no_need_for_bank_account_configuration={
          this.props.stripeCompany.has_no_need_for_bank_account_configuration
        }
        has_no_need_for_payment_method_configuration={
          this.props.stripeCompany.has_no_need_for_payment_method_configuration
        }
        submitBankAccount={this.attachExternalAccount}
        goNext={this.validateBankAccountStep}
        goPrevious={this.redirect(AccountConfigurationStripeStepUrl)}
        company={this.props.companySetup}
        labelGoNext={
          this.props.stripeCompany
            .has_no_need_for_payment_method_configuration &&
          this.props.stripeCompany.has_no_need_for_bank_account_configuration &&
          this.props.t('finish')
        }
        success={
          !!this.props.companySetup.external_account_last4 &&
          !!this.props.companySetup.bank_account_holder
        }
      />
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    companySetup: state.company.setup,
    stripeCompany: state.company.stripeCompany.data,
    has_completed_account_configuration_on_boarding:
      state.auth.has_completed_account_configuration_on_boarding,
  }),
  {
    push,
    retrieveMyCompanySetup: retrieveMyCompanySetupAction,
    attachExternalAccount: attachExternalAccountAction,
    validateAccountConfigurationStep: validateAccountConfigurationStepAction,
  },
);

export default compose(
  connector,
  withTranslation('common'),
)(AccountConfigurationBankAccountPage);
