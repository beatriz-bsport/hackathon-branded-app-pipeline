// @flow

import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import type { ConsumerPaymentPackConsumerView } from '../../../api/types';
import ConsumerPackRowItem from './ConsumerPackRowItem.component';

type Props = {
  onBookFromPack: () => void,
  consumerPack: ConsumerPaymentPackConsumerView,
  creditPrice: number,
  t: TFunction,
};

type State = {
  processing: boolean,
};

export class ConsumerPackCheckout extends Component<Props, State> {
  state = {
    processing: false,
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
      bookings_within_month,
    } = consumerPack;

    const hasEnoughCredits =
      available_credits >= creditPrice || payment_pack.unlimited;
    const hasBookingsLeftThisWeek =
      payment_pack.max_bookings_per_week > bookings_this_week ||
      !payment_pack.max_bookings_per_week;
    const hasBookingsLeftThisMonth =
      payment_pack.max_bookings_per_month > bookings_within_month ||
      !payment_pack.max_bookings_per_month ||
      !bookings_within_month;

    if (!hasEnoughCredits) {
      // the backend should not return these cases, handling them anyway
      return <Button disabled>{t('payment.noCreditLeft')}</Button>;
    }
    if (!hasBookingsLeftThisWeek || !hasBookingsLeftThisMonth) {
      return <Button disabled>{t('payment.noBookingsLeftOnPack')}</Button>;
    }

    const buyButtonText = this.getBuyText();
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={this.props.onBookFromPack}
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

export default withTranslation()(ConsumerPackCheckout);
