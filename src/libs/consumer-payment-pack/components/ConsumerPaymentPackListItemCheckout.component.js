// @flow

import React, { Component } from 'react';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTranslation, TFunction } from 'react-i18next';
import type { ConsumerPaymentPackConsumerView } from '../../../api/types';
import ConsumerPackRowItem from './ConsumerPackRowItem.component';
import { getCreditsDividedDisplay } from '#libs/theme/utils';

type Props = {
  onBookFromPack: () => void,
  consumerPack: ConsumerPaymentPackConsumerView,
  creditPrice: number,
  t: TFunction,
  divider?: boolean,
};
type State = {
  processing: boolean,
};

export class ConsumerPaymentPackListItemCheckout extends Component<
  Props,
  State,
> {
  state = {
    processing: false,
  };

  getBuyText = () => {
    const { consumerPack, t, creditPrice } = this.props;
    if (consumerPack.payment_pack.unlimited) {
      return t('payment.bookWithUnlimitedPack');
    }

    return `${getCreditsDividedDisplay(parseInt(creditPrice, 10))} ${t(
      'payment.payWithNCredits2',
    )}`;
  };

  renderButton = () => {
    const { t, consumerPack, creditPrice } = this.props;
    if (this.state.processing || !consumerPack.payment_pack) {
      return <CircularProgress />;
    }

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
    if (!hasBookingsLeftThisWeek) {
      return <Button disabled>{t('payment.noBookingsLeftOnPack')}</Button>;
    }
    if (!hasBookingsLeftThisMonth) {
      return (
        <Button disabled>{t('payment.noBookingsLeftOnPackInMonth')}</Button>
      );
    }

    const buyButtonText = this.getBuyText();
    return (
      <Button
        color="primary"
        disabled={this.state.processing}
        id={`btn-payment-pack-user-${consumerPack.id}`}
        onClick={() => {
          this.setState({ processing: true });
          this.props.onBookFromPack({
            onSuccess: () => this.setState({ processing: false }),
            onError: () => this.setState({ processing: false }),
          });
        }}
        variant="contained"
      >
        {buyButtonText}
      </Button>
    );
  };

  render() {
    return (
      <ConsumerPackRowItem
        hideConsumer
        button={this.renderButton()}
        consumerPack={this.props.consumerPack}
        noDivider={!this.props.divider}
        paymentPack={this.props.consumerPack.payment_pack}
      />
    );
  }
}

export default compose(withTranslation())(ConsumerPaymentPackListItemCheckout);
