// @flow
import React, { Component } from 'react';

import { compose } from 'recompose';
import moment from 'moment';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { PENDING as PLANNED_INVOICE_PENDING } from '@bsport/common/lib/master-data/planned-invoice-status';
import SubscriptionPayment from './SubscriptionPayment.component';

import SubscriptionSchedule from './SubscriptionSchedule.component';
import type { SubscriptionData } from '../types';

type Props = {
  subscriptionData: ?SubscriptionData,
  processing: boolean,
  onSubmit: (token: string) => void,
  t: TFunction,
  classes: Object,
  member: Member,
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
          subscriptionData.recurrent_price - subscriptionData.recurrent_voucher,
      },
    ],
    [],
  );

export class SubscriptionScheduleChecker extends Component<Props, State> {
  render() {
    const { subscriptionData, classes, t } = this.props;
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
          <SubscriptionPayment
            onSubmit={this.props.onSubmit}
            processing={this.props.processing}
            member={this.props.member}
          />
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
)(SubscriptionScheduleChecker);
