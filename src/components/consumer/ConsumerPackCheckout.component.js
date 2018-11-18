// @flow

import React, { Component } from 'react';

import {
  ListItem,
  ListItemText,
  Button,
  Grid,
  CircularProgress,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import api from '../../api';
import type { ConsumerPaymentPackConsumerView } from '../../api/types';

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

    // prettier-ignore
    const hasEnoughCredits = available_credits >= creditPrice || payment_pack.unlimited;
    // prettier-ignore
    const hasBookingsLeft = payment_pack.max_bookings_per_week > bookings_this_week;

    const paymentIsPossible = hasEnoughCredits && hasBookingsLeft;

    if (paymentIsPossible) {
      // prettier-ignore
      const buttonText = payment_pack.unlimited
        ? t('payment.bookWithUnlimitedPack')
        : `${t('payment.payWithNCredits1')} ${creditPrice} ${t('payment.payWithNCredits2')}`;
      return (
        <Button variant="contained" color="primary" onClick={this.pay}>
          {buttonText}
        </Button>
      );
    }
    if (hasEnoughCredits) {
      return <Button disabled>{t('payment.noBookingsLeftOnPack')}</Button>;
    }
    return <Button disabled>{t('payment.noCreditLeft')}</Button>;
  };

  render() {
    const { t, consumerPack } = this.props;
    const { payment_pack, available_credits } = consumerPack;

    // prettier-ignore
    const formattedCredits = payment_pack.unlimited
      ? t('paymentPack.unlimitedCredits')
      : `${available_credits}/${payment_pack.credits} ${t('paymentPack.credits')}`;

    return (
      <Grid container direction="column" alignItems="stretch" spacing={0}>
        <Grid item>
          <ListItem>
            <ListItemText
              primary={payment_pack.name}
              secondary={formattedCredits}
            />
          </ListItem>
        </Grid>
        <Grid item>
          <Grid container item alignItems="center" justify="center">
            {this.renderButton()}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default translate()(ConsumerPackCheckout);
