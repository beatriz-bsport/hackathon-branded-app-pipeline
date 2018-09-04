import React, { Component } from 'react';

import {
  ListItem,
  ListItemText,
  Button,
  Grid,
  Divider,
  withStyles,
  CircularProgress,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import api from '../../api';

const styles = (theme) => ({
  container: {},
});

type Props = {
  onCompletePurchase: () => void,
  offerId: Number,
  consumerPack: Object,
  creditPrice: Number,
  t: (x: string) => string,
  classes: Object,
};

export class ConsumerPackCheckout extends Component<Props> {
  state = {
    processing: false,
  };

  pay = async () => {
    this.setState({ processing: true });
    const { consumerPack, offerId } = this.props;
    const response = await api.payment.payWithConsumerPaymentPack(
      consumerPack.id,
      offerId,
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

    const paymentIsPossible =
      available_credits >= creditPrice || payment_pack.unlimited;

    if (processing) {
      return <CircularProgress />;
    }
    if (paymentIsPossible) {
      const buttonText = payment_pack.unlimited
        ? t('payment.bookWithUnlimitedPack')
        : `${t('payment.payWithNCredits1')} ${creditPrice} ${t(
            'payment.payWithNCredits2',
          )}`;
      return (
        <Button variant="raised" color="primary" onClick={this.pay}>
          {buttonText}
        </Button>
      );
    }
    return <Button disabled>{t('payment.noCreditLeft')}</Button>;
  };

  render() {
    const { classes, t, consumerPack, creditPrice } = this.props;
    const { payment_pack, available_credits } = consumerPack;

    const formattedCredits = payment_pack.unlimited
      ? t('paymentPack.unlimitedCredits')
      : `${available_credits}/${payment_pack.credits} ${t(
          'paymentPack.credits',
        )}`;
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

export default withStyles(styles)(translate()(ConsumerPackCheckout));
