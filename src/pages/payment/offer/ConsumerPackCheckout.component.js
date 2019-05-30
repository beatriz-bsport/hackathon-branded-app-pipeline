// @flow

import React, { Component } from 'react';

import { Button, CircularProgress } from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import api from '../../../api';
import type { ConsumerPaymentPackConsumerView } from '../../../api/types';
import ConsumerPackRowItem from '../../../libs/payment-packs/ConsumerPackRowItem.component';

type Props = {
  onCompletePurchase: () => void,
  offerId: number,
  consumerPack: ConsumerPaymentPackConsumerView,
  creditPrice: number,
  urlParams: ?string,
  t: (x: string) => string,
};

type State = {
  processing: boolean,
};

export class ConsumerPackCheckout extends Component<Props, State> {
  state = {
    processing: false,
  };

  pay = async () => {
    this.setState({ processing: true });
    const { urlParams, consumerPack, offerId } = this.props;
    const response = await api.payment.payWithConsumerPaymentPack(
      consumerPack.id,
      offerId,
      urlParams,
    );
    if (response.status === 200) {
      this.props.onCompletePurchase();
    }

    this.setState({ processing: false });
  };

  getBuyText = () => {
    const { consumerPack, t, creditPrice } = this.props;
    if (consumerPack.payment_pack.unlimited) {
      return t('payment.bookWithUnlimitedPack');
    }

    return `${creditPrice} ${t('payment.payWithNCredits2')}`;
  };

  renderButton = () => {
    const { processing } = this.state;
    if (processing) {
      return <CircularProgress />;
    }

    const { t, consumerPack, creditPrice } = this.props;
    const {
      payment_pack,
      available_credits,
      bookings_this_week,
    } = consumerPack;

    const hasEnoughCredits =
      available_credits >= creditPrice || payment_pack.unlimited;
    const hasBookingsLeftThisWeek =
      payment_pack.max_bookings_per_week > bookings_this_week ||
      !payment_pack.max_bookings_per_week;

    if (!hasEnoughCredits) {
      // the backend should not return these cases, handling them anyway
      return <Button disabled>{t('payment.noCreditLeft')}</Button>;
    }
    if (!hasBookingsLeftThisWeek) {
      return <Button disabled>{t('payment.noBookingsLeftOnPack')}</Button>;
    }

    const buyButtonText = this.getBuyText();
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={this.pay}
        id={`btn-payment-pack-user-${consumerPack.id}`}
      >
        {buyButtonText}
      </Button>
    );
  };

  render() {
    return (
      <ConsumerPackRowItem
        hideConsumer
        noDivider
        consumerPack={this.props.consumerPack}
        paymentPack={this.props.consumerPack.payment_pack}
        button={this.renderButton()}
      />
    );
  }
}

export default withNamespaces()(ConsumerPackCheckout);
