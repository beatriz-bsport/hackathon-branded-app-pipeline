// @flow
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import { compose, withState } from 'recompose';

import SubscriptionSummary from './SubscriptionSummary.component';
import SubscriptionSchedule from './SubscriptionSchedule.component';
import StopConfirmation from './StopDialog.component';
import type { Subscription } from './types';

type Props = {
  subscription: Subscription,
  stopSubscription: (id: number) => void,
  setShowDialogStop: (boolean) => void,
  goToInvoice: (uuid: string) => void,
  goToSubscribe: (id: number) => void,
  goToMember: (id: number) => void,
  showDialogStop: boolean,
  member: ?Member,
};

export function SubscriptionComponent(props: Props) {
  if (!props.subscription) {
    return null;
  }
  return (
    <div>
      <Grid container direction="row" spacing={24}>
        <Grid item xs={12} md={6}>
          <Paper>
            <SubscriptionSummary
              subscription={props.subscription}
              stopSubscription={() => props.setShowDialogStop(true)}
              goToSubscribe={props.goToSubscribe}
              goToMember={props.goToMember}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper>
            <SubscriptionSchedule
              scheduledInvoices={props.subscription.planned_invoices}
              onPlannedInvoiceClick={props.goToInvoice}
            />
          </Paper>
        </Grid>
      </Grid>
      <Dialog open={props.showDialogStop}>
        <StopConfirmation
          onSubmit={() => {
            props.stopSubscription(props.subscription.id);
            props.setShowDialogStop(false);
          }}
          onCancel={() => props.setShowDialogStop(false)}
        />
      </Dialog>
    </div>
  );
}

export default compose(withState('showDialogStop', 'setShowDialogStop', false))(
  SubscriptionComponent,
);
