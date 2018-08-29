import React, { Component } from 'react';

import {
  Grid,
  Paper,
  CircularProgress,
  withStyles,
  Typography,
  Button,
  Divider,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import { CardElement, injectStripe } from 'react-stripe-elements';
import { Redirect } from 'react-router-dom';

import api from '../../api';

type Props = {
  price: Number,
  purchaseId: Number,
  purchaseType: String,
};

export class OfferPayment extends Component<Props> {
  state = { completed: false, loading: false };

  static defaultProps = {
    price: 0.0,
    basket: null,
    purchaseId: 0,
    purchaseType: 'test',
  };

  submit = async () => {
    this.setState({ loading: true });
    const { purchaseId, purchaseType } = this.props;
    try {
      const { token } = await this.props.stripe.createToken();
      const response = await api.payment.pay(
        token.id,
        purchaseId,
        purchaseType,
      );

      if (response.status === 200) this.setState({ completed: true });
    } catch (err) {
      alert(`An error occured:\n${JSON.stringify(err)}`);
      this.setState({ loading: false });
    }
  };

  getPaymentInfo = () => {
    const { loading, price, children } = this.props;
    if (loading) {
      return (
        <Grid container alignItems="center" justify="center">
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      );
    }

    return (
      <Grid
        direction="column"
        container
        alignItems="center"
        justify="center"
        spacing={24}
      >
        <Grid item>{children}</Grid>
      </Grid>
    );
  };

  render() {
    const { price, classes, t } = this.props;
    const { loading, completed } = this.state;
    if (completed) {
      return <Redirect to="/" />;
    }

    if (loading) {
      return (
        <Paper className={classes.paymentContainer}>
          <CircularProgress />
        </Paper>
      );
    }

    return (
      <Paper className={classes.container}>
        {this.getPaymentInfo()}
        <Divider />
        <Grid
          container
          direction="column"
          spacing={24}
          className={classes.paymentContainer}
        >
          <Grid item container justify="center" alignItems="center">
            <Grid item>
              <Typography variant="display2">{price} €</Typography>
            </Grid>
          </Grid>
          <Grid item>
            <CardElement />
          </Grid>
          <Grid item>
            {loading ? (
              <CircularProgress />
            ) : (
              <Button variant="raised" color="primary" onClick={this.submit}>
                {t('payment.pay')}
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

const styles = (theme) => ({
  container: {
    maxWidth: 500,
  },
  paymentContainer: {
    padding: theme.spacing.unit * 3,
  },
});

export default withStyles(styles)(translate()(injectStripe(OfferPayment)));
