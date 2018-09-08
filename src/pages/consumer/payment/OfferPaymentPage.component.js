// @flow

import React, { Component } from 'react';

import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { payment as paymentActions } from '../../../actions';
import { ConsumerModalContainer, OfferPayment } from '../../../components';
import type { Offer, ConsumerPaymentPackManagerView } from '../../../api/types';

type Props = {
  loading: boolean,
  match: Object,
  offer: ?Offer,
  compatibleConsumerPacks: Array<ConsumerPaymentPackManagerView>,
  compatibleConsumerPacksLoading: boolean,
  fetchOffer: (number) => void,
  fetchCompatiblePass: (number) => void,
};

type State = {
  completed: boolean,
};

export class OfferPaymentPage extends Component<Props, State> {
  state = { completed: false };

  onCompletePurchase = () => {
    this.setState({ completed: true });
  };

  componentDidMount() {
    const offerId = parseInt(this.props.match.params.id, 10);
    this.props.fetchOffer(offerId);
    this.props.fetchCompatiblePass(offerId);
  }

  render() {
    const {
      offer,
      loading,
      compatibleConsumerPacksLoading,
      compatibleConsumerPacks,
    } = this.props;

    const { completed } = this.state;

    if (completed) {
      return <Redirect to="/" />;
    }

    return (
      <ConsumerModalContainer>
        <OfferPayment
          offer={offer}
          loading={loading}
          compatibleConsumerPacks={compatibleConsumerPacks}
          compatibleConsumerPacksLoading={compatibleConsumerPacksLoading}
          onCompletePurchase={this.onCompletePurchase}
        />
      </ConsumerModalContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    offer: state.payment.wantedOffer,
    loading: state.payment.loading,
    compatibleConsumerPacks: state.payment.compatibleConsumerPacks,
    compatibleConsumerPacksLoading:
      state.payment.compatibleConsumerPacksLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchOffer(id) {
      dispatch(paymentActions.fetchOffer(id));
    },
    fetchCompatiblePass(id) {
      dispatch(paymentActions.fetchCompatiblePass(id));
    },
  };
}

export default translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(OfferPaymentPage),
);
