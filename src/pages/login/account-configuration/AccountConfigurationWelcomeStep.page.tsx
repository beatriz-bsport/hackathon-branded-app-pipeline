// @ts-nocheck
import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';

import { push } from 'connected-react-router';
import WelcomeStep from '#libs/login/components/account-configuration/AccountConfigurationWelcomeStep.component';
import { RootState } from '../../../reducers';
import {
  AccountConfigurationPaymentMethodStepUrl,
  AccountConfigurationStripeStepUrl,
} from './AccountConfiguration.router';

export type Props = ConnectedProps<typeof connector>;
export class AccountConfigurationWelcomeStepPage extends Component<Props> {
  redirect = (path: string) => () => {
    this.props.push(path);
  };

  goNext = () => {
    if (this.props.stripeCompany.has_no_need_for_stripe_configuration) {
      this.props.push(AccountConfigurationPaymentMethodStepUrl);
      return;
    }
    this.props.push(AccountConfigurationStripeStepUrl);
  };

  render() {
    return (
      <WelcomeStep
        goNext={this.goNext}
        has_no_need_for_stripe_configuration={
          this.props.stripeCompany.has_no_need_for_stripe_configuration
        }
        has_no_need_for_bank_account_configuration={
          this.props.stripeCompany.has_no_need_for_bank_account_configuration
        }
        has_no_need_for_payment_method_configuration={
          this.props.stripeCompany.has_no_need_for_payment_method_configuration
        }
      />
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    stripeCompany: state.company.stripeCompany.data,
  }),
  { push },
);

export default compose(connector)(AccountConfigurationWelcomeStepPage);
