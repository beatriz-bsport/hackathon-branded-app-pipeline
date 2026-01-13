import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { push } from 'connected-react-router';
import { LinearProgress } from '@material-ui/core';
import InvoiceNumberingStep from '#src/libs/login/components/account-configuration/AccountConfigurationInvoiceNumberingStep.component';
import {
  AccountConfigurationFinalStepUrl,
  AccountConfigurationPaymentMethodStepUrl,
} from './AccountConfiguration.router';
import { initializeLegalIdentifierOnboarding } from '../../../libs/invoice/actions';
import { RootState } from '../../../reducers';
import { validateAccountConfigurationStepAction } from '../../../libs/company/actions';
import { INVOICE_NUMBERING_CONFIGURATION_STEP } from '../../../libs/company/constants';

export type Props = ConnectedProps<typeof connector>;
export class AccountConfigurationInvoiceNumberingStepPage extends Component<Props> {
  goPrevious = () => {
    this.props.push(AccountConfigurationPaymentMethodStepUrl);
  };

  goNext = () => {
    this.props.push(AccountConfigurationFinalStepUrl);
  };

  validateInvoiceNumberingStep = () => {
    if (
      !this.props.stripeCompany
        ?.has_completed_invoice_sequential_number_configuration
    ) {
      this.props.validateAccountConfigurationStep(
        {
          step: INVOICE_NUMBERING_CONFIGURATION_STEP,
        },
        {
          onSuccess: this.goNext,
          onError: (error) => {
            // Validation failed - log error but stay on current step
            // The user can retry or the backend needs to be fixed
            console.error('Invoice numbering validation failed:', error);
          },
        },
      );
    } else {
      this.goNext();
    }
  };

  handleConfirm = (
    prefix: string,
    suffix: string,
    dateFormat: 'year_only' | 'year_month',
  ) => {
    return new Promise<void>((resolve, reject) => {
      const format = dateFormat === 'year_only' ? 1 : 2;

      this.props.initializeLegalIdentifierOnboarding(
        {
          prefix,
          suffix,
          format_: format,
        },
        {
          onSuccess: () => {
            resolve();
          },
          onError: (error) => {
            reject(error);
          },
        },
      );
    });
  };

  render() {
    if (!this.props.stripeCompany) {
      return <LinearProgress />;
    }
    const { stripeCompany } = this.props;
    return (
      <InvoiceNumberingStep
        goNext={this.validateInvoiceNumberingStep}
        goPrevious={this.goPrevious}
        has_no_need_for_bank_account_configuration={
          stripeCompany.has_no_need_for_bank_account_configuration
        }
        has_no_need_for_payment_method_configuration={
          stripeCompany.has_no_need_for_payment_method_configuration
        }
        has_no_need_for_stripe_configuration={
          stripeCompany.has_no_need_for_stripe_configuration
        }
        onConfirm={this.handleConfirm}
      />
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    stripeCompany: state.company.stripeCompany?.data,
  }),
  {
    push,
    initializeLegalIdentifierOnboarding,
    validateAccountConfigurationStep: validateAccountConfigurationStepAction,
  },
);

export default compose(connector)(AccountConfigurationInvoiceNumberingStepPage);
