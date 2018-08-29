import React, { Component } from 'react';

import { Typography, withStyles, Button } from '@material-ui/core';
import { translate } from 'react-i18next';
import { Elements, StripeProvider } from 'react-stripe-elements';
import { connect } from 'react-redux';

import StripeCheckout from './StripeCheckout.component';
import OfferSummary from './OfferSummary.component';
import { payment as paymentActions } from '../../actions';

const STRIPE_KEY = process.env.REACT_APP_STRIPE_PK_KEY;

const styles = () => ({
  container: {},
});

type Props = {
  offerId: Number,
  fetchOffer: () => void,
};

export class OfferPayment extends Component<Props> {
  static defaultProps = {
    offerId: 1,
  };

  componentDidMount() {
    const { offerId } = this.props;
    this.props.fetchOffer(offerId);
  }

  getBasket = () => {
    const { offer } = this.props;
    if (offer) {
      return <OfferSummary offer={this.props.offer} />;
    }
    return null;
  };

  render() {
    const { loading, offer } = this.props;
    return (
      <StripeProvider apiKey={STRIPE_KEY}>
        <Elements>
          <StripeCheckout
            price={offer === null ? ' - ' : offer.price}
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
    offer: state.payment.wantedOffer,
    loading: state.payment.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchOffer(id) {
      dispatch(paymentActions.fetchOffer(id));
    },
  };
}

export default withStyles(styles)(
  translate()(connect(mapStateToProps, mapDispatchToProps)(OfferPayment)),
);
