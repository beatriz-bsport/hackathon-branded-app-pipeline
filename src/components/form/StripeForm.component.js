// @flow

import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { CardElement, injectStripe } from 'react-stripe-elements';

import { Moment } from '../../i18n';

type Props = {
  price: ?number,
  onComplete: (token: Object) => void,
  stripe: Object,
  t: TFunction,
  classes: Object,
  showRecurring: ?boolean,
};

type State = {
  completed: boolean,
  loading: boolean,
  isRecurring: boolean,
  nb_interval: number,
  billing_anchor: Object,
};

export class StripeCheckout extends Component<Props, State> {
  state = {
    loading: false,
    isRecurring: false,
    interval: 'month',
    nb_interval: 3,
    billing_anchor: Moment(),
  };

  submit = async () => {
    this.setState({ loading: true });
    try {
      const { token } = await this.props.stripe.createToken();
      if (this.state.isRecurring && this.props.showRecurring) {
        const recurringData = {
          nb_interval: this.state.nb_interval,
          billing_anchor: this.state.billing_anchor,
          interval: this.state.interval,
        };
        this.onComplete(token, recurringData);
      }
      this.onComplete(token);
    } catch (err) {
      alert(`An error occured:\n${JSON.stringify(err)}`);
      this.setState({ loading: false });
    }
  };

  onComplete = (token, recurringData) => {
    this.setState({ loading: false });
    this.props.onComplete(token, recurringData);
  };

  render() {
    const { classes, t, price } = this.props;
    const { loading } = this.state;

    return (
      <Grid
        container
        direction="column"
        spacing={2}
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
    padding: theme.spacing(2),
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: 5,
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  caption: {
    marginTop: theme.spacing(1),
  },
  labelAndSelectorItem: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

export default injectStripe(
  withStyles(styles)(withNamespaces()(StripeCheckout)),
);
