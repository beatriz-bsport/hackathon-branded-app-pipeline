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
import { Redirect } from 'react-router-dom';
import { goBack as goBackRouter } from 'react-router-redux';
import { CB as PAYMENT_METHOD_CB } from 'bsport-commons/lib/master-data/payment-methods';
import { connect } from 'react-redux';
import type { TFunction } from 'react-i18next';

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
};

type State = {
  completed: boolean,
  loading: boolean,
};
export class StripeCheckout extends Component<Props, State> {
  state = { completed: false, loading: false };

  submit = async () => {
    this.setState({ loading: true });
    const { t, urlParams, purchaseId, purchaseType, offerToBuy } = this.props;
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

      if (response && (response.status === 200 || response.status === 201)) {
        this.setState({
          completed: true,
          loading: false,
        });
      } else {
        alert(t('error.connectionError'));
        this.setState({ loading: false });
      }
    } catch (error) {
      alert(JSON.stringify(error.response.data));
      this.setState({ loading: false });
    }
  };

  render() {
    const { price, classes, t, purchaseType } = this.props;
    const { loading, completed } = this.state;
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
            <Button onClick={this.props.goBack}>{t('common.cancel')}</Button>
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

function mapDispatchToProps(dispatch) {
  return {
    goBack() {
      dispatch(goBackRouter());
    },
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(injectStripe(withStyles(styles)(translate()(StripeCheckout))));
