// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import AlarmAddIcon from '@material-ui/icons/AlarmAdd';
import Button from '@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';
import ReceiptIcon from '@material-ui/icons/Receipt';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import {
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} from '@bsport/common/lib/master-data/subscription-payment-methods';
import RedButton from '../../../components/button/RedButton.component';

import type { Subscription } from '../types';

type Props = {
  t: TFunction,
  classes: Object,

  subscription: Subscription,

  requestFreeze: () => void,
  requestPaymentMethodSwitch: () => void,
  requestPaymentPackSwitch: () => void,
  requestStop: () => void,
  requestScheduledStop: () => void,
};

export const SubscriptionActions = (props: Props) => {
  const scheduledStop = props.subscription.planned_invoices.some(
    (invoice) => invoice.is_last_invoice_before_scheduled_stop,
  );
  return (
    <div>
      <Typography variant="h5" component="h3">
        {props.t('subscription.actionSection')}
      </Typography>
      <Divider className={props.classes.divider} />
      <div className={props.classes.actionsContainer}>
        <div className={props.classes.row}>
          {!!props.subscription.payment_pack && (
            <Button
              className={props.classes.button}
              variant="outlined"
              onClick={props.requestPaymentPackSwitch}
              disabled={
                !props.subscription.editable || !props.subscription.payment_pack
              }
            >
              <RefreshIcon className={props.classes.leftIcon} />
              {props.t('subscription.actions.switchPack')}
            </Button>
          )}
          <Button
            className={props.classes.button}
            color="primary"
            variant="outlined"
            onClick={props.requestFreeze}
            disabled={
              !props.requestFreeze ||
              props.subscription.has_ended ||
              props.subscription.canceled_at
            }
          >
            <AlarmAddIcon className={props.classes.leftIcon} />
            {props.t('subscription.actions.freeze')}
          </Button>
        </div>
        <div className={props.classes.row}>
          <Button
            color="primary"
            variant="outlined"
            onClick={props.requestPaymentMethodSwitch}
            className={props.classes.button}
            disabled={
              !props.subscription.stripe_payment_method_id &&
              [
                BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
                BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
              ].includes(props.subscription.payment_method)
            }
          >
            <ReceiptIcon className={props.classes.leftIcon} />
            {props.t('subscription.actions.switchPaymentMethod')}
          </Button>
          <RedButton
            className={props.classes.button}
            variant="outlined"
            disabled={
              props.subscription.has_ended || props.subscription.canceled_at
            }
            onClick={props.requestStop}
          >
            {props.t('action.stop')}
          </RedButton>
        </div>
        <div className={props.classes.row}>
          <RedButton
            className={props.classes.button}
            variant="outlined"
            disabled={
              props.subscription.has_ended ||
              props.subscription.canceled_at ||
              scheduledStop
            }
            onClick={props.requestScheduledStop}
          >
            <EventBusyIcon className={props.classes.leftIcon} />
            {props.t('action.planStop')}
          </RedButton>
        </div>
      </div>
    </div>
  );
};

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  actionsContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  button: {
    marginBottom: theme.spacing(1),
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
});

export default compose(
  withTranslation(['subscription']),
  withStyles(styles),
)(SubscriptionActions);
