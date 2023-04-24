// @ts-nocheck
import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import AlarmAddIcon from '@material-ui/icons/AlarmAdd';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import PopOver from '#components/Popover';

import { OptionCallback } from '../../../state/types';
import RedButton from '../../../components/button/RedButton.component';
import PauseFormDialog from './pause/PauseFormDialog.component';
import { PauseRequestData, Subscription } from '../types';

type Props = {
  subscription: Subscription;
  requestPause: (data: PauseRequestData, options: OptionCallback<any>) => void;
  requestScheduledStop?: (plannedInvoiceId: number) => void;
  updateEventList: () => void;
};

export const SubscriptionActionsV2: FC<Props> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation(['subscription']);
  const [requestPause, setRequestPause] = React.useState(null);
  const scheduledStop = props.subscription.planned_invoices.some(
    (invoice) => invoice.is_last_invoice_before_scheduled_stop,
  );
  const closePauseForm = () => setRequestPause(null);
  return (
    <div>
      <Typography variant="h5" component="h3">
        {t('subscription.actionSection')}
      </Typography>
      <Divider className={classes.divider} />
      <div className={classes.actionsContainer}>
        <PopOver
          title={t('subscription.freeze.disabledReasons.month_billing_day')}
          hide={!props.subscription.month_billing_day}
        >
          <Button
            className={classes.button}
            color="primary"
            variant="outlined"
            onClick={() => setRequestPause(true)}
            disabled={
              !props.requestPause ||
              props.subscription.has_ended ||
              !!props.subscription.canceled_at ||
              !!props.subscription.month_billing_day
            }
          >
            <AlarmAddIcon className={classes.leftIcon} />
            {t('subscription.actions.freeze')}
          </Button>
        </PopOver>
      </div>
      {!!requestPause && (
        <PauseFormDialog
          onSubmit={props.requestPause}
          openForm={!!requestPause}
          closeDialog={closePauseForm}
          subscription={props.subscription}
          updateEventList={props.updateEventList}
        />
      )}
      {!!props.requestScheduledStop && (
        <div className={classes.row}>
          <RedButton
            className={classes.button}
            variant="outlined"
            disabled={
              props.subscription.has_ended ||
              props.subscription.canceled_at ||
              scheduledStop
            }
            onClick={() => props.requestScheduledStop(null)}
          >
            <EventBusyIcon className={classes.leftIcon} />
            {t('action.planStop')}
          </RedButton>
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
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
}));

export default SubscriptionActionsV2;
