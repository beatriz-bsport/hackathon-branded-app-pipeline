import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import EventPanel from '#libs/event/components/EventPanel.component';
import SubscriptionSummary from './SubscriptionSummary.component';
import PlannedInvoiceListDetail from './PlannedInvoiceListDetail.component';
import PauseV1ListItem from './pause/PauseV1ListItem.component';
import SubscriptionActionsV2 from './SubscriptionActionsV2.component';
import SubscriptionPaymentMethod from './SubscriptionPaymentMethod.component';
import { Subscription, PauseRequestData } from '../types';

import { COMPANY_EVENTS } from '../event.utils';
import { OptionCallback } from '../../../state/types';
import { EventListParams } from '#libs/event/types';

type Props = {
  subscription: Subscription;
  loading: boolean;

  requestUpdatePrice: (
    data: {
      planned_invoice: number;
      price: string;
      update_all: boolean;
      update_recurrent_price: boolean;
    },
    options?: OptionCallback<Subscription>,
  ) => void;
  plannedInvoiceUpdateLoading?: boolean;
  updateSubscriptionRenewal: ({
    auto_renewal,
  }: {
    auto_renewal: boolean;
  }) => void;
  requestPaymentPackSwitch: () => void;
  requestPrivatePassSwitch: () => void;
  requestPaymentComboSwitch: () => void;
  requestPaymentMethodSwitch: () => void;
  requestScheduledStop: (plannedInvoiceId?: number) => void;

  goToInvoice: (uuid: string) => void;
  goToSubscribe: (id: number) => void;
  goToMember: (id: number) => void;

  eventPage: number;
  eventList: Array<any>;
  eventLoading: boolean;
  fetchSubscriptionEventList: (params: EventListParams) => void;
  unflagPlannedInvoiceAsLast: (id: number) => void;

  updateDate: (
    data: {
      date: string;
      planned_invoice: number;
    },
    options: OptionCallback,
  ) => void;
  cancelPause: (id: number, options?: OptionCallback<Subscription>) => void;
  requestPause: (data: PauseRequestData, options: OptionCallback<any>) => void;
  paymentMethodLoading?: boolean;
  downloadContractTerms: (options: OptionCallback) => void;
};

export function SubscriptionComponent(props: Props) {
  const classes = useStyles();
  const { t } = useTranslation('subscription');
  if (!props.subscription) {
    return null;
  }
  const pauseListV1 = props.subscription.pauses.filter(
    (p) => !p.first_paused_planned_invoice && p.version === 'v1',
  );

  const updateEventListOnEventSuccess = () => {
    props.fetchSubscriptionEventList({
      page: 1,
      page_size: 10,
      object_id: props.subscription.id,
      event_types: Object.keys(COMPANY_EVENTS),
    });
  };

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
            plannedInvoiceUpdateLoading={props.plannedInvoiceUpdateLoading}
            cancelPause={props.cancelPause}
            updatePause={props.requestPause}
            toogleAutoRenew={props.updateSubscriptionRenewal}
            updateDate={props.updateDate}
            onRequestScheduledStop={props.requestScheduledStop}
            unflagPlannedInvoiceAsLast={props.unflagPlannedInvoiceAsLast}
            updateEventList={updateEventListOnEventSuccess}
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
              requestPrivatePassSwitch={props.requestPrivatePassSwitch}
              requestPaymentComboSwitch={props.requestPaymentComboSwitch}
              requestPaymentMethodSwitch={props.requestPaymentMethodSwitch}
              unflagPlannedInvoiceAsLast={props.unflagPlannedInvoiceAsLast}
              downloadContractTerms={props.downloadContractTerms}
            />
          </div>
          <SubscriptionPaymentMethod
            paymentMethod={props.paymentMethod}
            onEdit={props.requestPaymentMethodSwitch}
            paymentEngine={props.subscription.payment_engine}
            loading={props.paymentMethodLoading}
          />
          <div className={classes.divider} />
          <SubscriptionActionsV2
            subscription={props.subscription}
            requestPause={props.requestPause}
            requestScheduledStop={props.requestScheduledStop}
            updateEventList={updateEventListOnEventSuccess}
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
              <PauseV1ListItem pause={p} key={p.id} />
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
