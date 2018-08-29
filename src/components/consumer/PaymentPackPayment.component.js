import React, { Component } from 'react';

import { Typography, withStyles, Button } from '@material-ui/core';
import { translate } from 'react-i18next';
import { Elements, StripeProvider } from 'react-stripe-elements';
import { connect } from 'react-redux';

import StripeCheckout from './StripeCheckout.component';
import PaymentPackSummary from './PaymentPackSummary.component';
import { payment as paymentActions } from '../../actions';

const STRIPE_KEY = process.env.REACT_APP_STRIPE_PK_KEY;

const styles = () => ({
  container: {},
});

type Props = {
  paymentPackId: Number,
  fetchOffer: () => void,
};

export class PaymentPackPayment extends Component<Props> {
  static defaultProps = {
    paymentPackId: 1,
  };

  componentDidMount() {
    const { paymentPackId } = this.props;
    this.props.fetchPaymentPack(paymentPackId);
  }

  getBasket = () => {
    const { paymentPack } = this.props;
    if (paymentPack) {
      return <PaymentPackSummary paymentPack={this.props.paymentPack} />;
    }
    return null;
  };

  render() {
    const { loading, paymentPack } = this.props;
    return (
      <StripeProvider apiKey={STRIPE_KEY}>
        <Elements>
          <StripeCheckout
            price={paymentPack === null ? ' - ' : paymentPack.price}
            loading={loading}
          >
            {this.getBasket()}
          </StripeCheckout>
        </Elements>
      </StripeProvider>
    );
  }
}

function mapStateToProps(state) {
  return {
    paymentPack: state.payment.wantedPaymentPack,
    loading: state.payment.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPaymentPack(id) {
      dispatch(paymentActions.fetchPaymentPack(id));
    },
  };
}

export default withStyles(styles)(
  translate()(connect(mapStateToProps, mapDispatchToProps)(PaymentPackPayment)),
);
