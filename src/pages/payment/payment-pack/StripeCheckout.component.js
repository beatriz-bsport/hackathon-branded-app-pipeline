// @flow

import React, { Component } from 'react';
import { compose } from 'recompose';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { Redirect } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';

import { CardElement, injectStripe } from 'react-stripe-elements';

import { CB as PAYMENT_METHOD_CB } from '@bsport/common/lib/master-data/payment-methods';

import api from '../../../api';

type Props = {
  price: ?number,
  purchaseId: ?number,
  purchaseType: ?string,
  urlParams: ?string,
  offerToBuy: ?number,
  stripe: Object,
  goBack: () => void,
  classes: Object,
  t: TFunction,
  i18n: *,
};

type State = {
  completed: boolean,
  loading: boolean,
};

function getStripeErrorMessage(t, i18n, errorCode, declineCode) {
  if (!errorCode) return null;

  const tCode = `stripe:errors.${errorCode}`;
  const message = i18n.exists(tCode)
    ? t(tCode)
    : t('stripe:errors.processing_error');
  const reason = i18n.exists(`stripe:errors.${declineCode}`)
    ? t(`stripe:errors.${declineCode}`)
    : null;
  return `${message}${reason ? `\n${reason}` : ''}`;
}

export class StripeCheckout extends Component<Props, State> {
  state = { completed: false, loading: false, error: null };

  submit = async () => {
    this.setState({ loading: true, error: null, completed: false });

    const { t, i18n } = this.props;
    const {
      urlParams,
      price,
      purchaseId,
      purchaseType,
      offerToBuy,
    } = this.props;
    try {
      let token = { id: '' };
      if (price) {
        const tokenizer = await this.props.stripe.createToken();
        if (tokenizer.error) {
          throw new Error(getStripeErrorMessage(t, i18n, tokenizer.error.code));
        }
        // eslint-disable-next-line
        token = tokenizer.token;
      }

      await api.payment.consumerBuy({
        token: token.id,
        objectId: purchaseId,
        paymentMethod: PAYMENT_METHOD_CB.id,
        objectClassName: purchaseType,
        offerToBuy,
        urlParams,
      });

      this.setState({
        completed: true,
        loading: false,
      });
    } catch (error) {
      const data = (error.response && error.response.data) || {};
      const err =
        getStripeErrorMessage(t, i18n, data.code, data.decline_code) ||
        t('error.connectionError');
      this.setState({
        loading: false,
        error: err,
      });
    }
  };

  render() {
    const { price, classes, t, purchaseType } = this.props;
    const { loading, completed, error } = this.state;
    if (completed) {
      if (purchaseType === 'pass') {
        return <Redirect to="/pass" />;
      }
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
            <Typography variant="h3">{price || ' 0 '} €</Typography>
          </Grid>
        </Grid>
        {price ? (
          <Grid item>
            <div className={classes.cardContainer}>
              <CardElement hidePostalCode />
            </div>
            {error ? (
              <Typography className={classes.error}>{error}</Typography>
            ) : null}
          </Grid>
        ) : null}
        <Grid
          item
          container
          direction="row"
          alignItems="center"
          justify="space-between"
        >
          <Grid item>
            <Button onClick={this.props.goBack}>{t('common.cancel')}</Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              id="stripe-pay"
              disabled={loading}
              onClick={this.submit}
            >
              {t('payment.pay')}
            </Button>
          </Grid>
        </Grid>
        {loading ? <LinearProgress /> : null}
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
  error: {
    paddingTop: theme.spacing.unit * 2,
    fontSize: '0.8rem',
    color: theme.palette.error.dark,
  },
});

export default compose(
  withNamespaces([]),
  withStyles(styles),
  injectStripe,
)(StripeCheckout);
