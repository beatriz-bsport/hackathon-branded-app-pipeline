// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import AlarmAddIcon from '@material-ui/icons/AlarmAdd';
import Button from '@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';
import ReceiptIcon from '@material-ui/icons/Receipt';

import { BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT } from '@bsport/common/lib/master-data/subscription-payment-methods';

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
};

export const SubscriptionActions = (props: Props) => {
  return (
    <div>
      <Typography variant="h5" component="h3">
        {props.t('subscription.actionSection')}
      </Typography>
      <Divider className={props.classes.divider} />
      <div className={props.classes.actionsContainer}>
        <div className={props.classes.row}>
          <Button
            className={props.classes.button}
            variant="outlined"
            onClick={props.requestPaymentPackSwitch}
          >
            <RefreshIcon className={props.classes.leftIcon} />
            {props.t('subscription.actions.switchPack')}
          </Button>
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
          {props.subscription.payment_method ===
          BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT ? (
            <Button
              color="primary"
              variant="outlined"
              onClick={props.requestPaymentMethodSwitch}
              className={props.classes.button}
            >
              <ReceiptIcon className={props.classes.leftIcon} />
              {props.t('subscription.actions.switchPaymentMethod')}
            </Button>
          ) : (
            <div />
          )}
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
      </div>
    </div>
  );
};

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  divider: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
  },
  actionsContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  button: {
    marginBottom: theme.spacing.unit,
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
  withNamespaces(['subscription']),
  withStyles(styles),
)(SubscriptionActions);
