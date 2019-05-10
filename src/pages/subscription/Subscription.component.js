// @flow
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import SubscriptionSummary from './SubscriptionSummary.component';
import SubscriptionSchedule from './SubscriptionSchedule.component';
import type { Subscription } from './types';

type Props = {
  subscription: Subscription,
};

export default function SubscriptionComponent(props: Props) {
  if (!props.subscription) {
    return null;
  }
  return (
    <Grid container direction="row">
      <Grid item xs={12} md={6}>
        <Paper>
          <SubscriptionSummary subscription={props.subscription} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper>
          <SubscriptionSchedule
            scheduledInvoices={props.subscription.planned_invoices}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
