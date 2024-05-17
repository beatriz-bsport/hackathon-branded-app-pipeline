import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';

import { push } from 'connected-react-router';
import { Stripe } from '@stripe/stripe-js';
import { WithTranslation, withTranslation } from 'react-i18next';
import { LinearProgress } from '@material-ui/core';
import { RootState } from '../../../reducers';
import StripeStep from '#libs/login/components/account-configuration/AccountConfigurationStripeStep.component';
import StripeHoc from '#hocs/stripe.hoc';
import { getOnboardingLink as getOnboardingLinkAPI } from '../../../libs/company/api';
import {
  AccountConfigurationBankAccountStepUrl,
  AccountConfigurationFinalStepUrl,
  AccountConfigurationPaymentMethodStepUrl,
  AccountConfigurationStripeStepUrl,
} from './AccountConfiguration.router';
import {
  validateAccountConfigurationStepAction,
  retrieveMyCompanySetup as retrieveMyCompanySetupAction,
} from '#libs/company/actions';
import { STRIPE_CONFIGURATION_STEP } from '#libs/company/constants';

type StripeProps = { stripe: Stripe };
type State = {
  error?: Error;
};

export type Props = StripeProps &
  ConnectedProps<typeof connector> &
  WithTranslation;
export class AccountConfigurationStripeStepPage extends Component<
  Props,
  State
> {
  state: State = { error: null };

  getOnboardingLink = (tokenId: string) =>
    getOnboardingLinkAPI({
      account_token: tokenId,
      return_url: AccountConfigurationStripeStepUrl,
    })
      .then((r) => {
        // @ts-expect-error
        window.location = r.data.url;
      })
      .catch((err) => {
        console.error(err);
        this.setState({ error: err });
      });

  goToStripeOnBoarding = () => {
    this.props.stripe
      .createToken('account', { tos_shown_and_accepted: true })
      .then(({ token }) => {
        this.getOnboardingLink(token.id);
      })
      .catch((err) => {
        console.error(err);
        this.setState({ error: err });
      });
  };

  componentDidMount() {
    this.props.retrieveMyCompanySetup();
  }

  validateStripeStep = () => {
    if (!this.props.stripeCompany.has_completed_stripe_configuration) {
      this.props.validateAccountConfigurationStep(
        {
          step: STRIPE_CONFIGURATION_STEP,
        },
        {
          onSuccess: this.goNext,
        },
      );
    } else {
      this.goNext();
    }
  };

  goNext = () => {
    if (
      this.props.stripeCompany.has_no_need_for_payment_method_configuration &&
      this.props.stripeCompany.has_no_need_for_bank_account_configuration
    ) {
      this.props.push(AccountConfigurationFinalStepUrl);
    } else if (
      this.props.stripeCompany.has_no_need_for_bank_account_configuration
    ) {
      this.props.push(AccountConfigurationPaymentMethodStepUrl);
    } else {
      this.props.push(AccountConfigurationBankAccountStepUrl);
    }
  };

  render() {
    if (!this.props.companySetup) {
      return <LinearProgress />;
    }
    return (
      <StripeStep
        companyAdress={this.props.companySetup?.address}
        companyName={this.props.companySetup?.name}
        companyStripeName={this.props.companySetup?.business_name}
        error={this.state.error}
        goNext={this.validateStripeStep}
        has_no_need_for_bank_account_configuration={
          this.props.stripeCompany.has_no_need_for_bank_account_configuration
        }
        has_no_need_for_payment_method_configuration={
          this.props.stripeCompany.has_no_need_for_payment_method_configuration
        }
        has_no_need_for_stripe_configuration={
          this.props.stripeCompany.has_no_need_for_stripe_configuration
        }
        labelGoNext={
          this.props.stripeCompany
            .has_no_need_for_payment_method_configuration &&
          this.props.stripeCompany.has_no_need_for_bank_account_configuration &&
          this.props.t('finish')
        }
        redirectToStripe={this.goToStripeOnBoarding}
        success={
          this.props.stripeCompany?.currently_due_verifications === 0 &&
          this.props.stripeCompany?.stripe_id !== ''
        }
      />
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    companySetup: state.company.setup,
    stripeCompany: state.company.stripeCompany.data,
  }),
  {
    push,
    validateAccountConfigurationStep: validateAccountConfigurationStepAction,
    retrieveMyCompanySetup: retrieveMyCompanySetupAction,
  },
);

export default compose(
  StripeHoc,
  withTranslation('common'),
  connector,
)(AccountConfigurationStripeStepPage);
