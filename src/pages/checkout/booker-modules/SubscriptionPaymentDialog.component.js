// @flow
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { compose } from 'recompose';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { withTranslation, TFunction } from 'react-i18next';
import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
} from '@bsport/common/lib/master-data/payment-group';
import {
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} from '@bsport/common/lib/master-data/subscription-payment-methods';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import themeSelectors from '../../../libs/theme/selectors';

import SubscriptionContractCard from '../../../libs/subscription/components/SubscriptionContractCard.component';
import SubscriptionPayment from '../../../libs/subscription/components/SubscriptionPayment.component';
import { fetchPaymentMethodList as fetchPaymentMethodListAction } from '../../../libs/payment/actions';
import { getSavedPaymentMethodList } from '../../../libs/payment/selectors';
import { registerContractBackground } from '../../../libs/subscription/actions';
import Analytics from '../../../components/analytics/Analytics.component';

type Props = {
  t: TFunction,
  contract: ?Contract,
  fullScreen: boolean,
  onCancel: () => void,
  onSubmit: (contractId: number, success: boolean) => void,
  companyId: number,
  requestSetupIntentSecret: () => void,
  savedPaymentMethodList: Array<PaymentMethod>,
  fetchPaymentMethodList: (params: any) => void,
  companyTheme: CompanyTheme,
  isExcludingTax?: boolean,
  registerContractBackground: (
    id: number,
    data: any,
    options: OptionCallback,
  ) => void,
};

type State = {
  processing: boolean,
  firstBillingTimestamp: ?number,
};

export class SubscriptionContractBooking extends React.Component<Props, State> {
  state = {
    firstBillingTimestamp: null,
    processing: false,
  };

  onSubmit = async (
    token: string,
    payment_method_id: string,
    __,
    ___,
    options,
    coupon,
  ) => {
    this.setState({ processing: true });
    try {
      const first_billing_timestamp = moment(
        this.state.firstBillingTimestamp,
      ).unix();
      this.props.registerContractBackground(
        this.props.contract.id,
        {
          stripe_source: token,
          first_billing_timestamp,
          payment_method_id,
          coupon,
        },
        {
          onBackgroundError: () => {
            this.setState({ processing: false });
            this.props.onSubmit(this.props.contract.id, false);
          },
          onError: () => {
            this.setState({ processing: false });
            this.props.onSubmit(this.props.contract.id, false);
          },
          onBackgroundSuccess: () => {
            this.setState({ processing: false });
            this.props.onSubmit(this.props.contract.id, true);
            try {
              Analytics.contractPaymentSuccess(this.props.contract);
            } catch (err) {
              console.error(err);
            }
          },
        },
      );

      // this.setState({ firstBillingTimestamp });
    } catch (err) {
      this.props.onSubmit(this.props.contract.id, false);
      console.error(err);
    }
    this.setState({ processing: false });
  };

  render() {
    const enabledPaymentMethods = [
      ...(this.props.companyTheme.payment_method_available_subscription?.includes(
        PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
      )
        ? [BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB]
        : []),
      ...(this.props.companyTheme.payment_method_available_subscription?.includes(
        PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
      )
        ? [BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA]
        : []),
    ];
    if (!this.state.firstBillingTimestamp) {
      return (
        <Dialog fullScreen={this.props.fullScreen} open={!!this.props.contract}>
          <div>
            <SubscriptionContractCard
              contract={this.props.contract}
              onPayRequest={(firstBillingTimestamp) => {
                this.setState({ firstBillingTimestamp });
              }}
            />
            <DialogActions>
              <Button onClick={this.props.onCancel}>
                {this.props.t('cancel')}
              </Button>
            </DialogActions>
          </div>
        </Dialog>
      );
    }
    return (
      <Dialog fullScreen={this.props.fullScreen} open={!!this.props.contract}>
        <DialogContent>
          <SubscriptionPayment
            isExcludingTax={this.props?.isExcludingTax}
            processing={this.state.processing}
            contract={this.props.contract}
            requestSetupIntentSecret={this.props.requestSetupIntentSecret}
            savedPaymentMethodList={this.props.savedPaymentMethodList}
            withCoupon
            refreshSavedPaymentMethodList={() =>
              this.props.fetchPaymentMethodList({
                company: this.props.companyId,
              })
            }
            onCancel={() => {
              this.setState({ firstBillingTimestamp: null });
              this.props.onCancel();
            }}
            onSubmit={this.onSubmit}
            enabledPaymentGroupMethodIdentifier={
              this.props.companyTheme.payment_method_available_subscription
            }
            enabledPaymentMethods={enabledPaymentMethods}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

export default compose(
  withTranslation(['subscription']),
  withMobileDialog(),
  connect(
    (state) => ({
      savedPaymentMethodList: getSavedPaymentMethodList(state),
      companyTheme: themeSelectors.getTheme(state),
    }),
    {
      fetchPaymentMethodList: fetchPaymentMethodListAction,
      registerContractBackground,
    },
  ),
)(SubscriptionContractBooking);
