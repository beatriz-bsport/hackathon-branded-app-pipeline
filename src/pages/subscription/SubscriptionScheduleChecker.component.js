// @flow
import React from 'react';

import { compose } from 'recompose';
import moment from 'moment';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import SubscriptionSchedule from './SubscriptionSchedule.component';
import type { SubscriptionData } from './types';

type Props = {
  subscriptionData: ?SubscriptionData,
  onCancel: () => void,
  onSubmit: () => void,
  t: TFunction,
  classes: Object,
};

const getScheduledInvoicesFromSubscriptionData = (
  subscriptionData: SubscriptionData,
) =>
  Array(...Array(subscriptionData.nb_interval)).reduce(
    (s) => [
      ...s,
      {
        status: 'pending',
        date: moment(subscriptionData.billing_anchor)
          .clone()
          .add(s.length, 'month'),
        price: subscriptionData.recurrent_price,
        invoice_items: [],
      },
    ],
    [],
  );

export function SubscriptionScheduleChecker(props: Props) {
  const { subscriptionData } = props;
  if (!subscriptionData) {
    return null;
  }

  const scheduledInvoices = getScheduledInvoicesFromSubscriptionData(
    subscriptionData,
  );
  return (
    <div>
      <Typography variant="h4" className={props.classes.title}>
        {props.t('schedule.provisionalTitle')}
      </Typography>
      <SubscriptionSchedule scheduledInvoices={scheduledInvoices} />;
      <div className={props.classes.buttonContainer}>
        <Button onClick={props.onCancel} color="secondary">
          {props.t('form.cancel')}
        </Button>
        <Button onClick={props.onSubmit} color="primary">
          {props.t('form.submit')}
        </Button>
      </div>
    </div>
  );
}

const styles = (theme) => ({
  title: {
    padding: theme.spacing.unit * 2,
  },
  buttonContainer: {
    padding: theme.spacing.unit * 2,
  },
});

export default compose(
  withNamespaces(['subscription']),
  withStyles(styles),
)(SubscriptionScheduleChecker);
