// @flow
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import EventPanel from '../../event/components/EventPanel.component';
import SubscriptionSummary from './SubscriptionSummary.component';
import SubscriptionSchedule from './SubscriptionSchedule.component';
import SubscriptionPauseListItem from './pause/PauseV1ListItem.component';
import SubscriptionActions from './SubscriptionActions.component';
import type { Subscription, PlannedInvoice } from '../types';

import { COMPANY_EVENTS } from '../event.utils';

type Props = {
  subscription: Subscription,
  loading: boolean,

  requestUpdatePrice: (PlannedInvoice) => void,
  updateSubscriptionRenewal: ({ auto_renewal: boolean }) => void,
  requestFreeze: () => void,
  requestPaymentPackSwitch: () => void,
  requestPaymentMethodSwitch: () => void,
  requestStop: () => void,
  requestScheduledStop: () => void,

  goToInvoice: (uuid: string) => void,
  goToSubscribe: (id: number) => void,
  goToMember: (id: number) => void,

  eventPage: number,
  eventList: Array<EventSubscription>,
  eventLoading: boolean,
  fetchSubscriptionEventList: ({
    page: number,
    page_size: number,
    billing_plan: number,
  }) => void,
  unflagPlannedInvoiceAsLast: (id: number) => void,

  classes: Object,
  t: TFunction,
};

export function SubscriptionComponent(props: Props) {
  if (!props.subscription) {
    return null;
  }
  return (
    <div>
      <Grid container direction="row" spacing={3}>
        <Grid item md={6} xs={12}>
          <Typography component="h3" variant="h5">
            {props.t('subscription.invoicesSection')}
          </Typography>
          <Divider className={props.classes.divider} />
          <Paper>
            <SubscriptionSchedule
              onPlannedInvoiceClick={props.goToInvoice}
              requestUpdatePrice={props.requestUpdatePrice}
              scheduledInvoices={props.subscription.planned_invoices}
              subscriptionHasEnded={
                props.subscription.has_ended || props.subscription.canceled_at
              }
            />
          </Paper>
          <div className={props.classes.divider} />
          <Paper>
            <EventPanel
              eventList={props.eventList}
              eventSpec={COMPANY_EVENTS}
              extraFetchParams={{ billing_plan: props.subscription.id }}
              fetchEventList={props.fetchSubscriptionEventList}
              loading={props.eventLoading}
              page={props.eventPage}
            />
          </Paper>
        </Grid>
        <Grid item md={6} xs={12}>
          <div className={props.classes.block}>
            <SubscriptionSummary
              goToMember={props.goToMember}
              goToSubscribe={props.goToSubscribe}
              loading={props.loading}
              requestPaymentMethodSwitch={props.requestPaymentMethodSwitch}
              requestPaymentPackSwitch={props.requestPaymentPackSwitch}
              subscription={props.subscription}
              unflagPlannedInvoiceAsLast={props.unflagPlannedInvoiceAsLast}
              updateRenewal={props.updateSubscriptionRenewal}
            />
          </div>
          <SubscriptionActions
            requestFreeze={props.requestFreeze}
            requestPaymentMethodSwitch={props.requestPaymentMethodSwitch}
            requestPaymentPackSwitch={props.requestPaymentPackSwitch}
            requestScheduledStop={props.requestScheduledStop}
            requestStop={props.requestStop}
            subscription={props.subscription}
          />

          {props.subscription.pauses.length ? (
            <Typography variant="h6">
              {props.t('subscription.pauseSection')}
            </Typography>
          ) : null}
          <Paper className={props.classes.block}>
            {props.subscription.pauses.map((p) => (
              <SubscriptionPauseListItem key={p.id} pause={p} />
            ))}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

const styles = (theme) => ({
  block: {
    marginBottom: theme.spacing(3),
  },
  eventListTitle: {
    marginTop: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['subscription']),
)(SubscriptionComponent);
