// @flow
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import SubscriptionSummary from './SubscriptionSummary.component';
import SubscriptionSchedule from './SubscriptionSchedule.component';
import SubscriptionPauseListItem from './SubscriptionPauseListItem.component';
import SubscriptionActions from './SubscriptionActions.component';
import type { Subscription, PlannedInvoice } from '../types';

type Props = {
  subscription: Subscription,
  loading: boolean,

  requestUpdatePrice: (PlannedInvoice) => void,
  updateSubscriptionRenewal: ({ auto_renewal: boolean }) => void,
  requestFreeze: () => void,
  requestPaymentPackSwitch: () => void,
  requestPaymentMethodSwitch: () => void,
  requestStop: () => void,

  goToInvoice: (uuid: string) => void,
  goToSubscribe: (id: number) => void,
  goToMember: (id: number) => void,

  classes: Object,
  t: TFunction,
};

export function SubscriptionComponent(props: Props) {
  if (!props.subscription) {
    return null;
  }
  return (
    <div>
      <Grid container direction="row" spacing={24}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" component="h3">
            {props.t('subscription.invoicesSection')}
          </Typography>
          <Divider className={props.classes.divider} />
          <Paper>
            <SubscriptionSchedule
              scheduledInvoices={props.subscription.planned_invoices}
              onPlannedInvoiceClick={props.goToInvoice}
              requestUpdatePrice={props.requestUpdatePrice}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={props.classes.block}>
            <SubscriptionSummary
              subscription={props.subscription}
              goToSubscribe={props.goToSubscribe}
              goToMember={props.goToMember}
              updateRenewal={props.updateSubscriptionRenewal}
              loading={props.loading}
              requestPaymentPackSwitch={props.requestPaymentPackSwitch}
              requestPaymentMethodSwitch={props.requestPaymentMethodSwitch}
            />
          </div>
          <SubscriptionActions
            subscription={props.subscription}
            requestFreeze={props.requestFreeze}
            requestPaymentMethodSwitch={props.requestPaymentMethodSwitch}
            requestPaymentPackSwitch={props.requestPaymentPackSwitch}
            requestStop={props.requestStop}
          />

          {props.subscription.pauses.length ? (
            <Typography variant="h6">
              {props.t('subscription.pauseSection')}
            </Typography>
          ) : null}
          <Paper className={props.classes.block}>
            {props.subscription.pauses.map((p) => (
              <SubscriptionPauseListItem pause={p} key={p.id} />
            ))}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

const styles = (theme) => ({
  block: {
    marginBottom: theme.spacing.unit * 3,
  },
  divider: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['subscription']),
)(SubscriptionComponent);
