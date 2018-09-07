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
import { ConsumerPaymentPackConsumerView } from '../../api/types';

type Props = {
  onCompletePurchase: () => void,
  offerId: number,
  consumerPack: ConsumerPaymentPackConsumerView,
  creditPrice: number,
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
    const { t, consumerPack, creditPrice } = this.props;
    const { processing } = this.state;
    const { payment_pack, available_credits } = consumerPack;

    const hasCredits = available_credits >= creditPrice;
    const paymentIsPossible = hasCredits || payment_pack.unlimited;

    if (processing) {
      return <CircularProgress />;
    }
    if (paymentIsPossible) {
      // prettier-ignore
      const buttonText = payment_pack.unlimited
        ? t('payment.bookWithUnlimitedPack')
        : `${t('payment.payWithNCredits1')} ${creditPrice} ${t('payment.payWithNCredits2')}`;
      return (
        <Button variant="raised" color="primary" onClick={this.pay}>
          {buttonText}
        </Button>
      );
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
