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

  compatibleConsumerPacks: Array<ConsumerPaymentPackManagerView>,

  goToPassMarketplace: (companyName: string) => void,
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

  goToPassMarketplace = () => {
    const { company_name } = this.props.offer.activity;
    this.props.goToPassMarketplace(company_name);
  };

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
    goToPassMarketplace(companyName) {
      dispatch(routerPush(`/m/${companyName}`));
    },
  };
}

export default translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(OfferPaymentPage),
);
