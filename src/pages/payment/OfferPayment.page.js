// @flow

import React, { Component } from 'react';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { push as routerPush } from 'react-router-redux';
import { compose } from 'recompose';

import withSnackbar from '../../hocs/with-snackbar.hoc';
import { bookAnOption } from '../../api/payment';

import { payment as paymentActions } from '../../actions';
import ConsumerModalContainer from '../../components/consumer/ConsumerModalContainer.component';
import type { Offer, ConsumerPaymentPackManagerView } from '../../api/types';

import OfferPaymentForm from './offer/OfferPaymentForm.component';

type Props = {
  match: Object,

  t: TFunction,
  offer: ?Offer,
  loading: boolean,
  compatibleConsumerPacksLoading: boolean,
  compatiblePaymentPacksLoading: boolean,
  consumer: { consumer: number },

  compatibleConsumerPacks: Array<ConsumerPaymentPackManagerView>,
  compatiblePaymentPacks: Array<PaymentPack>,

  pushRouter: (path: string) => void,
  goToPassMarketplace: (companyName: string) => void,
  fetchOffer: (number) => void,
  fetchCompatiblePass: (number) => void,
  fetchCompatiblePaymentPacks: (number) => void,
  snackbar: { success: (string) => void },
};

type State = {
  completed: boolean,
  processing: boolean,
};

export class OfferPaymentPage extends Component<Props, State> {
  state = { completed: false, processing: false };

  onCompletePurchase = () => {
    const { snackbar, t } = this.props;
    snackbar.success(t('bookingConfirmed'));
    this.setState({ completed: true });
  };

  componentDidMount() {
    const offerId = parseInt(this.props.match.params.id, 10);
    this.offerId = offerId;
    this.props.fetchOffer(offerId);
    this.props.fetchCompatiblePass(offerId);
    this.props.fetchCompatiblePaymentPacks(offerId);
  }

  bookAnOption = (offerId: number) => {
    this.setState({ processing: true });
    bookAnOption(offerId, this.props.consumer.consumer)
      .then((res) => {
        if (res.status === 201) {
          this.props.pushRouter('/customer');
        }
      })
      .catch((err) => {
        this.setState({ processing: false });
        console.error(err);
      });
  };

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
    if (this.state.completed) {
      return <Redirect to="/" />;
    }

    return (
      <ConsumerModalContainer>
        <OfferPaymentForm
          offer={this.props.offer}
          loading={this.props.loading || this.state.processing}
          compatibleConsumerPacks={this.props.compatibleConsumerPacks}
          compatibleConsumerPacksLoading={
            this.props.compatibleConsumerPacksLoading
          }
          compatiblePaymentPacksLoading={
            this.props.compatiblePaymentPacksLoading
          }
          compatiblePaymentPacks={this.props.compatiblePaymentPacks}
          onCompletePurchase={this.onCompletePurchase}
          onBuyPaymentPack={this.buyPaymentPack}
          goToPassMarketplace={this.goToPassMarketplace}
          bookAnOption={this.bookAnOption}
        />
      </ConsumerModalContainer>
    );
  }
}

export default compose(
  withNamespaces(),
  withSnackbar,
  connect(
    (state) => ({
      offer: state.payment.wantedOffer,
      consumer: state.consumer.profile,
      loading: state.payment.loading,
      compatibleConsumerPacks: state.payment.compatibleConsumerPacks,
      compatiblePaymentPacks: state.payment.compatiblePaymentPacks,
      compatiblePaymentPacksLoading:
        state.payment.compatibleConsumerPacksLoading,
      compatibleConsumerPacksLoading:
        state.payment.compatibleConsumerPacksLoading,
    }),
    {
      fetchOffer: paymentActions.fetchOffer,
      fetchCompatiblePass: paymentActions.fetchCompatiblePass,
      fetchCompatiblePaymentPacks: paymentActions.fetchCompatiblePaymentPacks,
      goToPassMarketplace: (companyName) => routerPush(`/m/${companyName}`),
      pushRouter: (path) => routerPush(path),
    },
  ),
)(OfferPaymentPage);
