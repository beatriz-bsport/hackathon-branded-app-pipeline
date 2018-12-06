// @flow

import React, { Component } from 'react';

import {
  Grid,
  CircularProgress,
  withStyles,
  Typography,
  Button,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import { CardElement, injectStripe } from 'react-stripe-elements';
import { Link, Redirect } from 'react-router-dom';
import { CB as PAYMENT_METHOD_CB } from 'bsport-commons/lib/master-data/payment-methods';

import api from '../../api';

type Props = {
  price: ?number,
  purchaseId: ?number,
  purchaseType: ?string,
  urlParams: ?string,
  stripe: Object,
  t: (x: string) => string,
  classes: Object,
};

type State = {
  completed: boolean,
  loading: boolean,
};
export class StripeCheckout extends Component<Props, State> {
  state = { completed: false, loading: false };

  submit = async () => {
    this.setState({ loading: true });
    const { urlParams, purchaseId, purchaseType, offerToBuy } = this.props;
    try {
      const { token } = await this.props.stripe.createToken();
      const response = await api.payment.consumerBuy({
        token: token.id,
        objectId: purchaseId,
        paymentMethod: PAYMENT_METHOD_CB.id,
        objectClassName: purchaseType,
        offerToBuy,
        urlParams,
      });

      if (response.status === 200) {
        this.setState({
          completed: true,
          loading: false,
        });
      }
    } catch (err) {
      alert(`An error occured:\n${JSON.stringify(err)}`);
      this.setState({ loading: false });
    }
  };

  render() {
    const { price, classes, t } = this.props;
    const { loading, completed } = this.state;
    if (completed) {
      return <Redirect to="/" />;
    }

    return (
      <Grid
        container
        direction="column"
        spacing={24}
        className={classes.paymentContainer}
      >
        <Grid item container justify="center" alignItems="center">
          <Grid item>
            <Typography variant="display2">{price || ' - '} €</Typography>
          </Grid>
        </Grid>
        <Grid item>
          <div className={classes.cardContainer}>
            <CardElement hidePostalCode />
          </div>
        </Grid>
        <Grid
          item
          container
          direction="row"
          alignItems="center"
          justify="space-between"
        >
          <Grid item>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Button>{t('common.cancel')}</Button>
            </Link>
          </Grid>
          <Grid item>
            {loading ? (
              <CircularProgress />
            ) : (
              <Button variant="contained" color="primary" onClick={this.submit}>
                {t('payment.pay')}
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

const styles = (theme) => ({
  paymentContainer: {
    padding: theme.spacing.unit * 3,
  },
  cardContainer: {
    padding: theme.spacing.unit,
    backgroundColor: '#F3F3F3',
    borderRadius: 5,
  },
});

export default injectStripe(withStyles(styles)(translate()(StripeCheckout)));
