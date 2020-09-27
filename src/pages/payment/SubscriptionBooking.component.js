// @flow
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { compose } from 'recompose';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import {
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} from '@bsport/common/lib/master-data/subscription-payment-methods';
import { postContractSubscription as postContractSubscriptionAPI } from '../../libs/subscription/api';

import SubscriptionContractCard from '../../libs/subscription/components/SubscriptionContractCard.component';
import SubscriptionPayment from '../../libs/subscription/components/SubscriptionPayment.component';
import { fetchPaymentMethodList as fetchPaymentMethodListAction } from '../../libs/payment/actions';
import { getSavedPaymentMethodList } from '../../libs/payment/selectors';

type Props = {
  t: TFunction,
  contract: ?Contract,
  fullScreen: boolean,
  onCancel: () => void,
  onSubmit: (any) => void,
  companyId: number,
  requestSetupIntentSecret: () => void,
  savedPaymentMethodList: Array<PaymentMethod>,
  fetchPaymentMethodList: (params: any) => void,
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
    options,
    coupon,
  ) => {
    this.setState({ processing: true });
    try {
      const first_billing_timestamp = moment(
        this.state.firstBillingTimestamp,
      ).unix();
      await postContractSubscriptionAPI(this.props.contract.id, {
        stripe_source: token,
        first_billing_timestamp,
        payment_method_id,
        coupon,
      });
      this.props.onSubmit();
      // this.setState({ firstBillingTimestamp });
    } catch (err) {
      console.error(err);
    }
    this.setState({ processing: false });
  };

  render() {
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
            enabledPaymentMethods={[
              BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
              BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
            ]}
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
    }),
    {
      fetchPaymentMethodList: fetchPaymentMethodListAction,
    },
  ),
)(SubscriptionContractBooking);
