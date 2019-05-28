// @flow
import React, { Component } from 'react';

import { compose } from 'recompose';
import moment from 'moment';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { PENDING as PLANNED_INVOICE_PENDING } from '@bsport/common/lib/master-data/planned-invoice-status';
import { CardElement, injectStripe } from 'react-stripe-elements';
import SubscriptionSchedule from './SubscriptionSchedule.component';
import type { SubscriptionData } from './types';

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

export class SubscriptionScheduleChecker extends Component<Props, State> {
  state = { loading: false };

  submit = async () => {
    this.setState({ loading: true });

    try {
      const tokenizer = await this.props.stripe.createToken();
      const { token } = tokenizer;
      this.props.onSubmit(token.id);
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
      <div>
        <Typography variant="h5" className={classes.title}>
          {t('subscription:schedule.provisionalTitle')}
        </Typography>
        <SubscriptionSchedule scheduledInvoices={scheduledInvoices} />
        <div className={classes.cardContainer}>
          <CardElement hidePostalCode />
        </div>
        <div className={classes.buttonContainer}>
          <Button onClick={onCancel} color="secondary">
            {t('subscription:form.cancel')}
          </Button>
          <Button onClick={this.submit} id="stripe-pay" color="primary">
            {this.state.loading || this.props.processing ? (
              <CircularProgress />
            ) : (
              t('subscription:form.submit')
            )}
          </Button>
        </div>
      </div>
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
  cardContainer: {
    padding: theme.spacing.unit * 2,
    backgroundColor: '#EFEFEF',
  },
});

export default compose(
  withNamespaces(['stripe', 'subscription']),
  withStyles(styles),
  injectStripe,
)(SubscriptionScheduleChecker);
