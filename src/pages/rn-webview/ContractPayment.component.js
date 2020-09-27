// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { withHandlers, compose, withProps } from 'recompose';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';
import moment from 'moment-timezone';

import {
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} from '@bsport/common/lib/master-data/subscription-payment-methods';

import { requestSetupIntentSecretNoAuth as requestSetupIntentSecretAPI } from '../../libs/payment/api';
import { getSavedPaymentMethodList } from '../../libs/payment/selectors';
import { fetchPaymentMethodList } from '../../libs/payment/actions';
import { fetchContractDetail } from '../../libs/subscription/actions';
import { getContract } from '../../libs/subscription/selectors';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import parse from '../../query-string';
import { attachPaymentToBasketId as attachPaymentAction } from '../../libs/checkout/actions';
import SubscriptionPayment from '../../libs/subscription/components/SubscriptionPayment.component';
import { postContractSubscriptionUnauthenticated as postContractSubscriptionUnauthenticatedAPI } from '../../libs/subscription/api';

type Props = {
  classes: Object,
  onSuccess: () => void,
  onCancel: () => void,
  date: string,
  memberId: number,
  contractId: number,
  fetchPaymentMethodList: (params: any) => void,
  savedPaymentMethodList: Array<PaymentMethod>,
  requestSetupIntentSecret: () => void,
  contract: ?Contract,
  fetchContractDetail: (number) => void,
};

type State = {
  processing: boolean,
};

export class ContractPayment extends React.Component<Props, State> {
  componentDidMount() {
    this.props.fetchContractDetail(this.props.contractId);
  }

  state = { processing: false };

  onSubmit = async (_, payment_method_id: string) => {
    this.setState({ processing: true });
    try {
      const first_billing_timestamp = moment(
        this.props.date,
        'YYYY-MM-DD',
      ).unix();
      await postContractSubscriptionUnauthenticatedAPI(this.props.contractId, {
        first_billing_timestamp,
        member: this.props.memberId,
        payment_method_id,
      });
      this.props.onSuccess();
    } catch (err) {
      console.error(err);
    }
    this.setState({ processing: false });
  };

  render() {
    return (
      <div className={this.props.classes.container}>
        <SubscriptionPayment
          onCancel={this.props.onCancel}
          onSubmit={this.onSubmit}
          processing={this.state.processing}
          savedPaymentMethodList={this.props.savedPaymentMethodList}
          requestSetupIntentSecret={this.props.requestSetupIntentSecret}
          withCoupon
          contract={this.props.contract}
          refreshSavedPaymentMethodList={() => {
            this.props.fetchPaymentMethodList({ member: this.props.memberId });
          }}
          enabledPaymentMethods={[
            BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
            BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
          ]}
        />
      </div>
    );
  }
}

const styles = () => ({
  container: {
    width: '100%',
    height: '100vh',
    backgroundColor: 'white',
  },
});

export default compose(
  withRouter,
  withProps(({ location }) => ({
    date: parse(location.search).date,
    memberId: parseInt(parse(location.search).member, 10),
  })),
  withStyles(styles),
  routerParamsToProps({ contractId: 'contractId' }),
  connect(
    (state, { contractId }) => ({
      contract: getContract(state, parseInt(contractId, 10)),
      savedPaymentMethodList: getSavedPaymentMethodList(state),
    }),
    {
      attachPayment: attachPaymentAction,
      fetchContractDetail,
      fetchPaymentMethodList,
    },
  ),
  withHandlers({
    requestSetupIntentSecret: ({ memberId }) => () =>
      requestSetupIntentSecretAPI(memberId),
  }),
  withProps(() => ({
    onSuccess: () => {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ status: 'succeeded' }),
      );
    },
    onCancel: () => {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ status: 'cancel' }),
      );
    },
  })),
)(ContractPayment);
