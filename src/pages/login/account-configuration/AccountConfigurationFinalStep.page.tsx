import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { push } from 'connected-react-router';
import { LinearProgress } from '@material-ui/core';
import { fetchAccessLevel } from '../../../actions/auth.actions';
import { getAuthToken } from '../../../http';
import { RootState } from '../../../reducers';
import themeSelectors from '#libs/theme/selectors';
import FinalStep from '#libs/login/components/account-configuration/AccountConfigurationFinalStep.component';

import { PaymentMethod } from '#libs/payment/types';
import { validateAccountConfigurationStepAction } from '#libs/company/actions';
import { ACCOUNT_CONFIGURATION_FINAL_STEP } from '#libs/company/constants';
import { TUTORIAL_WELCOME_DIALOG_OPEN_QUERY_PARAMS } from '#libs/platform-tutorial/constant';
import { platformTutorialActivated } from '#libs/platform-tutorial/utils';

export type Props = ConnectedProps<typeof connector>;
type State = {
  paymentMethodList?: Array<PaymentMethod>;
};
export class AccountConfiguationWelcomeStepPage extends Component<Props> {
  goToBackoffice = () => {
    if (!platformTutorialActivated()) {
      this.props.push('/');
    } else {
      this.props.push(
        `/calendar/?${TUTORIAL_WELCOME_DIALOG_OPEN_QUERY_PARAMS}`,
      );
    }
  };

  state: State = {};

  refreshAccessLevel = () => {
    this.props.fetchAccessLevel(getAuthToken(), {
      onDone: this.goToBackoffice,
    });
  };

  finishConfiguration = () => {
    this.props.validateAccountConfigurationStep(
      {
        step: ACCOUNT_CONFIGURATION_FINAL_STEP,
      },
      {
        onSuccess: this.refreshAccessLevel,
      },
    );
  };

  componentDidMount() {
    if (
      this.props.stripeCompany.has_no_need_for_payment_method_configuration &&
      this.props.stripeCompany.has_no_need_for_stripe_configuration &&
      this.props.stripeCompany.has_no_need_for_bank_account_configuration
    ) {
      this.finishConfiguration();
    }
    if (
      this.props.stripeCompany.has_completed_account_configuration_on_boarding
    ) {
      this.refreshAccessLevel();
    }
  }

  render() {
    if (
      this.props.stripeCompany
        .has_completed_account_configuration_on_boarding ||
      (this.props.stripeCompany.has_no_need_for_payment_method_configuration &&
        this.props.stripeCompany.has_no_need_for_stripe_configuration &&
        this.props.stripeCompany.has_no_need_for_bank_account_configuration)
    ) {
      return <LinearProgress />;
    }

    return (
      <FinalStep
        goNext={this.finishConfiguration}
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
    theme: themeSelectors.getTheme(state),
    companySetup: state.company.setup,
  }),
  {
    push,
    validateAccountConfigurationStep: validateAccountConfigurationStepAction,

    fetchAccessLevel,
  },
);

export default compose(connector)(AccountConfiguationWelcomeStepPage);
