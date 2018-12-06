// @flow

import React, { Component } from 'react';

import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { push as routerPush } from 'react-router-redux';

import { payment as paymentActions } from '../../../actions';
import { ConsumerModalContainer, OfferPayment } from '../../../components';
import type { Offer, ConsumerPaymentPackManagerView } from '../../../api/types';

type Props = {
  match: Object,

  offer: ?Offer,
  loading: boolean,
  compatibleConsumerPacksLoading: boolean,
  compatiblePaymentPacksLoading: boolean,

  compatibleConsumerPacks: Array<ConsumerPaymentPackManagerView>,
  compatiblePaymentPacks: Array<PaymentPack>,

  goToPassMarketplace: (companyName: string) => void,
  fetchOffer: (number) => void,
  fetchCompatiblePass: (number) => void,
  fetchCompatiblePaymentPacks: (number) => void,
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
    this.offerId = offerId;
    this.props.fetchOffer(offerId);
    this.props.fetchCompatiblePass(offerId);
    this.props.fetchCompatiblePaymentPacks(offerId);
  }

  goToPassMarketplace = () => {
    const { company_name } = this.props.offer.activity;
    this.props.goToPassMarketplace(company_name);
  };

  buyPaymentPack = (packId: number) => {
    this.props.pushRouter(
      `/customer/payment/pass/${packId}?nextOffer=${this.offerId}`,
    );
  };

  render() {
    const {
      offer,
      loading,
      compatibleConsumerPacksLoading,
      compatibleConsumerPacks,
      compatiblePaymentPacks,
      compatiblePaymentPacksLoading,
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
          compatiblePaymentPacksLoading={compatiblePaymentPacksLoading}
          compatiblePaymentPacks={compatiblePaymentPacks}
          onCompletePurchase={this.onCompletePurchase}
          onBuyPaymentPack={this.buyPaymentPack}
          goToPassMarketplace={this.goToPassMarketplace}
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
    compatiblePaymentPacks: state.payment.compatiblePaymentPacks,
    compatiblePaymentPacksLoading: state.payment.compatibleConsumerPacksLoading,
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
    fetchCompatiblePaymentPacks(id) {
      dispatch(paymentActions.fetchCompatiblePaymentPacks(id));
    },
    goToPassMarketplace(companyName) {
      dispatch(routerPush(`/m/${companyName}`));
    },
    pushRouter(path) {
      dispatch(routerPush(path));
    },
  };
}

export default translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(OfferPaymentPage),
);
