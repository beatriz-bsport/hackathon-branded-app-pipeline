import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';

import { push } from 'connected-react-router';
import { LinearProgress } from '@material-ui/core';
import PaymentMethodStep from '#src/libs/login/components/account-configuration/AccountConfigurationPaymentMethodStep.component';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '#src/libs/payment/api';
import { fetchMyUserProfile } from '#src/libs/member/actions';
import { getSavedPaymentMethodList } from '#src/libs/payment/selectors';
import { PaymentMethod } from '#src/libs/payment/types';
import { updateCompanyTheme } from '#src/libs/theme/actions';
import { PAYMENT_METHOD_CONFIGURATION_STEP } from '#src/libs/company/constants';
import {
  retrieveMyCompanySetup as retrieveMyCompanySetupAction,
  validateAccountConfigurationStepAction,
} from '../../../libs/company/actions';
import {
  AccountConfigurationBankAccountStepUrl,
  AccountConfigurationInvoiceNumberingStepUrl,
  AccountConfigurationStripeStepUrl,
} from './AccountConfiguration.router';
import {
  fetchPaymentMethodList as fetchPaymentMethodListAction,
  setPaymentMethodAsDefault as setPaymentMethodAsDefaultAction,
} from '../../../libs/payment/actions';
import { RootState } from '../../../reducers';

export type Props = ConnectedProps<typeof connector>;
export class AccountConfigurationPaymentMethodStepPage extends Component<Props> {
  redirect = (link: string) => () => {
    this.props.push(link);
  };

  requestSetupIntentSecret = () => {
    return requestSetupIntentSecretAPI(null, null, true);
  };

  componentDidMount() {
    this.props.fetchMyUserProfile();
    this.fetchPaymentMethodList();
    this.props.retrieveMyCompanySetup();
  }

  fetchPaymentMethodList = () => {
    this.props.fetchPaymentMethodList({ as_company: true });
  };

  onPaymentMethodAdded = (stripeSetupIntentCallResult: any) => {
    const paymentMethodId =
      stripeSetupIntentCallResult?.setupIntent?.payment_method;

    if (paymentMethodId) {
      this.props.setPaymentMethodAsDefault({
        payment_backend_payment_method_id: paymentMethodId,
        as_company: true,
      });
    }
    this.fetchPaymentMethodList();
  };

  goPrevious = this.props.stripeCompany.has_no_need_for_stripe_configuration
    ? null
    : () => {
        if (
          this.props.stripeCompany.has_no_need_for_bank_account_configuration
        ) {
          this.props.push(AccountConfigurationStripeStepUrl);
        } else {
          this.props.push(AccountConfigurationBankAccountStepUrl);
        }
      };

  validatePaymentMethodStep = () => {
    if (!this.props.stripeCompany.has_completed_payment_method_configuration) {
      this.props.validateAccountConfigurationStep(
        {
          step: PAYMENT_METHOD_CONFIGURATION_STEP,
        },
        {
          onSuccess: this.redirect(AccountConfigurationInvoiceNumberingStepUrl),
        },
      );
    } else {
      this.props.push(AccountConfigurationInvoiceNumberingStepUrl);
    }
  };

  render() {
    if (!this.props.companySetup) {
      return <LinearProgress />;
    }
    return (
      <PaymentMethodStep
        cardBillingDetailsMandatory={
          this.props.theme.force_billing_details_on_cards
        }
        currency={this.props.companySetup?.currency}
        goNext={this.validatePaymentMethodStep}
        goPrevious={this.goPrevious}
        has_no_need_for_bank_account_configuration={
          this.props.stripeCompany.has_no_need_for_bank_account_configuration
        }
        has_no_need_for_payment_method_configuration={
          this.props.stripeCompany.has_no_need_for_payment_method_configuration
        }
        has_no_need_for_stripe_configuration={
          this.props.stripeCompany.has_no_need_for_stripe_configuration
        }
        memberEmail={this.props.myProfile?.email}
        memberName={
          this.props.myProfile?.first_name
            ? `${this.props.myProfile?.first_name} ${this.props.myProfile?.last_name}`
            : null
        }
        // @ts-expect-error
        onPaymentMethodSuccess={this.onPaymentMethodAdded}
        paymentMethodLoading={this.props.savedPaymentMethodListLoading}
        paymentMethodRegistered={
          this.props.savedPaymentMethodList?.length
            ? this.props.savedPaymentMethodList[0]
            : null
        }
        requestSetupIntentSecret={this.requestSetupIntentSecret}
      />
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    stripeCompany: state.company.stripeCompany.data,
    companySetup: state.company.setup,
    myProfile: state.member.userProfile.profile,
    theme: state.theme.theme,
    savedPaymentMethodListLoading: state.paymentBackend.paymentMethod.loading,
    savedPaymentMethodList: getSavedPaymentMethodList(
      state,
    ) as Array<PaymentMethod>,
  }),
  {
    push,
    fetchMyUserProfile,
    fetchPaymentMethodList: fetchPaymentMethodListAction,
    updateCompanyTheme,
    setPaymentMethodAsDefault: setPaymentMethodAsDefaultAction,
    retrieveMyCompanySetup: retrieveMyCompanySetupAction,
    validateAccountConfigurationStep: validateAccountConfigurationStepAction,
  },
);

export default compose(connector)(AccountConfigurationPaymentMethodStepPage);
