// @ts-nocheck
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
import ObjectLevelPermissionProviderComponent from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';

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
  requestScheduledStop: (plannedInvoiceId?: number, stopNote?: string) => void;

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
    <ObjectLevelPermissionProviderComponent requiredPermission="product.contract.allowed_actions.pauseBillingPlan">
      {(hasPauseBillingPlanPermission: boolean) => (
        <div>
          <Grid container direction="row" spacing={3}>
            <Grid item md={6} xs={12}>
              <Typography component="h3" variant="h5">
                {t('subscription.invoicesSection')}
              </Typography>
              <Divider className={classes.divider} />
              <PlannedInvoiceListDetail
                cancelPause={props.cancelPause}
                onClickInvoice={props.goToInvoice}
                onRequestScheduledStop={props.requestScheduledStop}
                pauseList={props.subscription.pauses}
                plannedInvoiceList={props.subscription.planned_invoices}
                plannedInvoiceUpdateLoading={props.plannedInvoiceUpdateLoading}
                requestUpdatePrice={props.requestUpdatePrice}
                subscription={props.subscription}
                toogleAutoRenew={props.updateSubscriptionRenewal}
                unflagPlannedInvoiceAsLast={props.unflagPlannedInvoiceAsLast}
                updateDate={props.updateDate}
                updateEventList={updateEventListOnEventSuccess}
                updatePause={props.requestPause}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <div className={classes.block}>
                <SubscriptionSummary
                  downloadContractTerms={props.downloadContractTerms}
                  goToMember={props.goToMember}
                  goToSubscribe={props.goToSubscribe}
                  loading={props.loading}
                  requestPaymentComboSwitch={props.requestPaymentComboSwitch}
                  requestPaymentMethodSwitch={props.requestPaymentMethodSwitch}
                  requestPaymentPackSwitch={props.requestPaymentPackSwitch}
                  requestPrivatePassSwitch={props.requestPrivatePassSwitch}
                  subscription={props.subscription}
                  unflagPlannedInvoiceAsLast={props.unflagPlannedInvoiceAsLast}
                  updateRenewal={props.updateSubscriptionRenewal}
                />
              </div>
              <SubscriptionPaymentMethod
                loading={props.paymentMethodLoading}
                onEdit={props.requestPaymentMethodSwitch}
                paymentEngine={props.subscription.payment_engine}
                paymentMethod={props.paymentMethod}
              />
              <div className={classes.divider} />
              <SubscriptionActionsV2
                requestPause={
                  hasPauseBillingPlanPermission && props.requestPause
                }
                requestScheduledStop={props.requestScheduledStop}
                subscription={props.subscription}
                updateEventList={updateEventListOnEventSuccess}
              />
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

              {pauseListV1.length && (
                <Typography variant="h6">
                  {t('subscription.pauseSection')}
                </Typography>
              )}
              <Paper className={classes.block}>
                {pauseListV1.map((pauseListItem) => (
                  <PauseV1ListItem
                    key={pauseListItem.id}
                    pause={pauseListItem}
                  />
                ))}
              </Paper>
            </Grid>
          </Grid>
        </div>
      )}
    </ObjectLevelPermissionProviderComponent>
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
