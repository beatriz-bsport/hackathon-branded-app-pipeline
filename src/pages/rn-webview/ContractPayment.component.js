// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';
import { Elements, StripeProvider } from 'react-stripe-elements';
import moment from 'moment';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import Config from '../../config';
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
};

type State = {
  processing: boolean,
};
const STRIPE_KEY = Config.REACT_APP_STRIPE_PK_KEY;

export class ContractPayment extends React.Component<Props, State> {
  state = { processing: false };

  onSubmit = async (token: string) => {
    this.setState({ processing: true });
    try {
      const first_billing_timestamp = moment(
        this.props.date,
        'YYYY-MM-DD',
      ).unix();
      await postContractSubscriptionUnauthenticatedAPI(this.props.contractId, {
        stripe_source: token,
        first_billing_timestamp,
        member: this.props.memberId,
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
        <StripeProvider apiKey={STRIPE_KEY}>
          <Elements>
            <SubscriptionPayment
              onCancel={this.props.onCancel}
              onSubmit={this.onSubmit}
              processing={this.state.processing}
            />
          </Elements>
        </StripeProvider>
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
    null,
    { attachPayment: attachPaymentAction },
  ),
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
