import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import EventPanel from '../../event/components/EventPanel.component';
import SubscriptionSummary from './SubscriptionSummary.component';
import PlannedInvoiceListDetail from './PlannedInvoiceListDetail.component';
import SubscriptionPauseListItem from './SubscriptionPauseListItem.component';
import SubscriptionActionsV2 from './SubscriptionActionsV2.component';
import SubscriptionPaymentMethod from './SubscriptionPaymentMethod.component';
import { Subscription } from '../types';

import { COMPANY_EVENTS } from './event.utils';
import { OptionsCallback } from '../../../state/types';

type Props = {
  subscription: Subscription;
  loading: boolean;

  requestUpdatePrice: (PlannedInvoice) => void;
  updateSubscriptionRenewal: ({ auto_renewal: boolean }) => void;
  requestPaymentPackSwitch: () => void;
  requestPaymentMethodSwitch: () => void;
  requestStop: () => void;
  requestScheduledStop: () => void;

  goToInvoice: (uuid: string) => void;
  goToSubscribe: (id: number) => void;
  goToMember: (id: number) => void;

  eventPage: number;
  eventList: Array<any>;
  eventLoading: boolean;
  fetchSubscriptionEventList: ({
    page: number,
    page_size: number,
    billing_plan: number,
  }) => void;
  unflagPlannedInvoiceAsLast: (id: number) => void;

  updateDate: (data: any, options: OptionsCallback) => void;
  cancelPause: (id: number) => void;
};

export function SubscriptionComponent(props: Props) {
  const classes = useStyles();
  const { t } = useTranslation(['subscription']);
  if (!props.subscription) {
    return null;
  }
  const pauseListV1 = props.subscription.pauses.filter(
    (p) => !p.first_paused_planned_invoice,
  );

  return (
    <div>
      <Grid container direction="row" spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" component="h3">
            {t('subscription.invoicesSection')}
          </Typography>
          <Divider className={classes.divider} />
          <PlannedInvoiceListDetail
            plannedInvoiceList={props.subscription.planned_invoices}
            pauseList={props.subscription.pauses}
            subscription={props.subscription}
            onClickInvoice={props.goToInvoice}
            requestUpdatePrice={props.requestUpdatePrice}
            cancelPause={props.cancelPause}
            toogleAutoRenew={props.updateSubscriptionRenewal}
            updateDate={props.updateDate}
            onRequestScheduledStop={props.requestScheduledStop}
            unflagPlannedInvoiceAsLast={props.unflagPlannedInvoiceAsLast}
            subscriptionHasEnded={
              props.subscription.has_ended || props.subscription.canceled_at
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={classes.block}>
            <SubscriptionSummary
              subscription={props.subscription}
              goToSubscribe={props.goToSubscribe}
              goToMember={props.goToMember}
              updateRenewal={props.updateSubscriptionRenewal}
              loading={props.loading}
              requestPaymentPackSwitch={props.requestPaymentPackSwitch}
              requestPaymentMethodSwitch={props.requestPaymentMethodSwitch}
              unflagPlannedInvoiceAsLast={props.unflagPlannedInvoiceAsLast}
            />
          </div>
          <SubscriptionPaymentMethod
            paymentMethod={props.paymentMethod}
            onEdit={props.requestPaymentMethodSwitch}
            paymentEngine={props.subscription.payment_engine}
          />
          <div className={classes.divider} />
          <SubscriptionActionsV2
            subscription={props.subscription}
            requestPause={props.requestPause}
            requestPaymentMethodSwitch={props.requestPaymentMethodSwitch}
            requestPaymentPackSwitch={props.requestPaymentPackSwitch}
            requestStop={props.requestStop}
            requestScheduledStop={props.requestScheduledStop}
            unflagPlannedInvoiceAsLast={props.unflagPlannedInvoiceAsLast}
          />
          <Paper>
            <EventPanel
              loading={props.eventLoading}
              eventList={props.eventList}
              page={props.eventPage}
              fetchEventList={props.fetchSubscriptionEventList}
              extraFetchParams={{ billing_plan: props.subscription.id }}
              eventSpec={COMPANY_EVENTS}
            />
          </Paper>

          {pauseListV1.length ? (
            <Typography variant="h6">
              {t('subscription.pauseSection')}
            </Typography>
          ) : null}
          <Paper className={classes.block}>
            {pauseListV1.map((p) => (
              <SubscriptionPauseListItem pause={p} key={p.id} />
            ))}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
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
}));

export default SubscriptionComponent;
