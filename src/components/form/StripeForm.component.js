// @flow

import React, { Component } from 'react';

import {
  Typography,
  Grid,
  CircularProgress,
  withStyles,
  Button,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { translate } from 'react-i18next';
import { CardElement, injectStripe } from 'react-stripe-elements';

type Props = {
  price: ?number,
  onComplete: (token: Object) => void,
  stripe: Object,
  t: (x: string) => string,
  classes: Object,
};

type State = {
  completed: boolean,
  loading: boolean,
};
export class StripeCheckout extends Component<Props, State> {
  state = { loading: false };

  submit = async () => {
    this.setState({ loading: true });
    try {
      const { token } = await this.props.stripe.createToken();
      this.onComplete(token);
    } catch (err) {
      alert(`An error occured:\n${JSON.stringify(err)}`);
      this.setState({ loading: false });
    }
  };

  onComplete = (token) => {
    this.setState({ loading: false });
    this.props.onComplete(token);
  };

  render() {
    const { classes, t, price } = this.props;
    const { loading } = this.state;

    return (
      <Grid
        container
        direction="column"
        spacing={16}
        className={classes.paymentContainer}
      >
        <Grid item>
          <div className={classes.cardContainer}>
            <CardElement />
          </div>
          <Typography variant="caption" className={classes.caption}>
            {t('payment.stripePaymentWillBeCashedOutOnInvoiceValidation')}
          </Typography>
        </Grid>
        <Grid item container direction="row" justify="flex-end">
          <Grid item>
            {loading ? (
              <CircularProgress />
            ) : (
              <Button
                variant="outlined"
                color="primary"
                onClick={this.submit}
                disabled={!price}
              >
                <AddCircleIcon className={classes.leftIcon} />
                {t('payment.addThisPaymentItem')}
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

const styles = (theme) => ({
  cardContainer: {
    padding: theme.spacing.unit * 2,
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: 5,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  caption: {
    marginTop: theme.spacing.unit,
  },
});

export default injectStripe(withStyles(styles)(translate()(StripeCheckout)));
