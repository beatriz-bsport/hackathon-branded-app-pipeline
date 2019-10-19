// @flow
import React, { Component } from 'react';

import { compose } from 'recompose';
import moment from 'moment';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { PENDING as PLANNED_INVOICE_PENDING } from '@bsport/common/lib/master-data/planned-invoice-status';
import { CardElement, IbanElement, injectStripe } from 'react-stripe-elements';

import SubscriptionSchedule from './SubscriptionSchedule.component';
import type { SubscriptionData } from '../types';

type Props = {
  subscriptionData: ?SubscriptionData,
  processing: boolean,
  onCancel: () => void,
  onSubmit: (token: string) => void,
  t: TFunction,
  classes: Object,
  stripe: Object,
};

type State = {
  loading: boolean,
};

const SEPA_AVAILABLE = false;

const getScheduledInvoicesFromSubscriptionData = (
  subscriptionData: SubscriptionData,
) =>
  Array(...Array(subscriptionData.nb_interval)).reduce(
    (s) => [
      ...s,
      {
        status: PLANNED_INVOICE_PENDING.id,
        date: moment(subscriptionData.first_billing_timestamp * 1000)
          .clone()
          .add(s.length, 'month'),
        price:
          subscriptionData.trial_nb + s.length >= subscriptionData.nb_interval
            ? 0
            : subscriptionData.recurrent_price,
        voucher:
          subscriptionData.trial_nb + s.length >= subscriptionData.nb_interval
            ? 0
            : subscriptionData.recurrent_voucher,
      },
    ],
    [],
  );

const PaymentMethodSwitcher = (props: {
  classes: Object,
  t: TFunction,
  onChange: (string) => void,
  payment_method: string,
}) => (
  <RadioGroup
    aria-label="payment-method"
    className={props.classes.paymentMethodSelectorContainer}
    value={props.payment_method}
    onChange={(ev) => props.onChange(ev.target.value)}
  >
    <FormControlLabel
      value="sepa_debit"
      control={<Radio color="primary" />}
      label={props.t('subscription:paymentMethod.sepa')}
      labelPlacement="bottom"
    />
    <FormControlLabel
      value="card"
      control={<Radio color="primary" />}
      label={props.t('subscription:paymentMethod.card')}
      labelPlacement="bottom"
    />
  </RadioGroup>
);

export class SubscriptionScheduleChecker extends Component<Props, State> {
  state = {
    loading: false,
    payment_method: 'card',
    name: '',
    email: '',
  };

  getSourceData = () => {
    if (this.state.payment_method === 'sepa_debit') {
      return {
        type: 'sepa_debit',
        currency: 'eur',
        owner: {
          name: this.state.name,
          email: this.state.email,
        },
        mandate: {
          // Automatically send a mandate notification email to your customer
          // once the source is charged.
          notification_method: 'email',
        },
      };
    }
    return {
      type: 'card',
      currency: 'eur',
    };
  };

  submit = async () => {
    this.setState({ loading: true });
    try {
      const tokenizer = await this.props.stripe.createSource(
        this.getSourceData(),
      );
      const { source } = tokenizer;
      this.props.onSubmit(source.id);
    } catch (error) {
      console.error(error);
    }
    this.setState({
      loading: false,
    });
  };

  render() {
    const { subscriptionData, classes, t, onCancel } = this.props;
    if (!subscriptionData) {
      return null;
    }

    const scheduledInvoices = getScheduledInvoicesFromSubscriptionData(
      subscriptionData,
    );
    return (
      <Grid container spacing={16}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" className={classes.title}>
            {t('subscription:schedule.provisionalTitle')}
          </Typography>
          <Paper>
            <SubscriptionSchedule scheduledInvoices={scheduledInvoices} />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" className={classes.title}>
            {t('subscription:schedule.paymentMethodTitle')}
          </Typography>
          <Paper>
            {SEPA_AVAILABLE ? (
              <PaymentMethodSwitcher
                classes={classes}
                t={t}
                payment_method={this.state.payment_method}
                onChange={(payment_method) => this.setState({ payment_method })}
              />
            ) : null}
            <Divider />
            <div className={classes.cardContainer}>
              {this.state.payment_method === 'sepa_debit' ? (
                <div>
                  <div className={classes.nameAndEmailContainer}>
                    <TextField
                      inline
                      required
                      value={this.state.name}
                      variant="outlined"
                      placeholder={t('subscription:mandate.name')}
                      onChange={(ev) =>
                        this.setState({ name: ev.target.value })
                      }
                    />
                    <TextField
                      inline
                      type="email"
                      required
                      variant="outlined"
                      value={this.state.email}
                      placeholder={t('subscription:mandate.email')}
                      onChange={(ev) =>
                        this.setState({ email: ev.target.value })
                      }
                    />
                  </div>
                  <div className={classes.sensitiveData}>
                    <IbanElement supportedCountries={['SEPA']} />
                  </div>
                  <Typography
                    color="textSecondary"
                    variant="caption"
                    className={classes.mandate}
                  >
                    {t('subscription:mandate.content')}
                  </Typography>
                </div>
              ) : null}
              {this.state.payment_method === 'card' ? (
                <div className={classes.sensitiveData}>
                  <CardElement />
                </div>
              ) : null}
            </div>
            <div className={classes.buttonContainer}>
              <Button onClick={onCancel} color="secondary">
                {t('subscription:form.cancel')}
              </Button>
              <Button
                onClick={this.submit}
                id="stripe-pay"
                color="primary"
                disabled={
                  (!this.state.name || !this.state.email) &&
                  this.state.payment_method === 'sepa_debit'
                }
              >
                {this.state.loading || this.props.processing ? (
                  <CircularProgress />
                ) : (
                  t('subscription:form.submit')
                )}
              </Button>
            </div>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

const styles = (theme) => ({
  title: {
    padding: theme.spacing.unit * 2,
  },
  buttonContainer: {
    padding: theme.spacing.unit * 2,
  },
  sensitiveData: {
    backgroundColor: '#EFEFEF',
    padding: theme.spacing.unit * 2,
  },
  paymentMethodSelectorContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.unit * 2,
  },
  nameAndEmailContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: theme.spacing.unit * 2,
  },
  mandate: {
    padding: theme.spacing.unit * 2,
  },
});

export default compose(
  withNamespaces(['stripe', 'subscription']),
  withStyles(styles),
  injectStripe,
)(SubscriptionScheduleChecker);
