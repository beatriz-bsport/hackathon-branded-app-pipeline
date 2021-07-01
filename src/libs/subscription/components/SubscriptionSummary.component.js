// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';
import moment from 'moment-timezone';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import { isPaused } from '../utils';
import { getCurrencyDisplay } from '../../theme/selectors';

import type { Subscription } from '../types';

type Props = {
  subscription: Subscription,
  t: TFunction,
  classes: Object,
  updateRenewal: ({ auto_renewal: boolean }) => void,
  requestPaymentPackSwitch: () => void,
  loading: boolean,
  unflagPlannedInvoiceAsLast: (id: number) => void,
};

const renderStatus = (
  t: TFunction,
  canceled_at: string,
  has_ended: boolean,
  pauses: Array<SubscriptionPause>,
) => {
  if (has_ended) {
    return (
      <Typography color="primary">
        {t('subscriptionStatus.hasEnded')}
      </Typography>
    );
  }
  if (canceled_at) {
    return (
      <Typography color="error">
        {t('subscriptionStatus.canceledOn') + moment(canceled_at).format('L')}
      </Typography>
    );
  }
  if (isPaused(pauses)) {
    return (
      <Typography color="secondary">
        {t('subscriptionStatus.isPaused')}
      </Typography>
    );
  }
  return (
    <Typography color="secondary">{t('subscriptionStatus.pending')}</Typography>
  );
};

export function SubscriptionSummary(props: Props) {
  const { subscription, t, classes } = props;
  const lastInvoice = subscription.planned_invoices.find(
    (invoice) => invoice.is_last_invoice_before_scheduled_stop,
  );
  if (!subscription) {
    return null;
  }
  return (
    <div className={classes.container}>
      <fieldset className={classes.parameters}>
        <legend>{t('parameters.parameters')}</legend>
        <div className={classes.field}>
          <Typography variant="body2" inline>
            {t('parameters.nbInterval')}
          </Typography>
          <Typography inline>{subscription.nb_interval}</Typography>
        </div>
        <div className={classes.field}>
          <Typography variant="body2" inline>
            {t('parameters.recurrent_price')}
          </Typography>
          <Typography inline>
            {subscription.recurrent_price} {getCurrencyDisplay()}
          </Typography>
        </div>
        <div className={classes.field}>
          <Typography variant="body2" inline>
            {t('parameters.flat_fee')}
          </Typography>
          <Typography inline>
            {subscription.flat_fee} {getCurrencyDisplay()}
          </Typography>
        </div>
        {!props.subscription.is_v2 && (
          <div className={classes.field}>
            <Typography variant="body2" inline>
              {t('parameters.payment_method.label')}
            </Typography>
            <Typography inline>
              {t(
                `invoice:paymentMethod.label.${subscription.payment_method_identifier}`,
              )}
            </Typography>
          </div>
        )}
        <div className={classes.fieldNotPadded}>
          <Typography variant="body2" inline>
            {props.t('parameters.autoRenew')}
          </Typography>
          <Checkbox
            checked={props.subscription.auto_renewal}
            disabled={props.loading || !subscription.editable}
            onChange={(ev) =>
              props.updateRenewal({
                auto_renewal: ev.target.checked,
              })
            }
          />
        </div>
        {!!subscription.payment_pack && (
          <div className={classes.fieldNotPadded}>
            <Typography variant="body2" inline>
              {t('parameters.payment_pack')}
            </Typography>
            <div className={classes.rowRight}>
              <IconButton
                color="primary"
                onClick={props.requestPaymentPackSwitch}
                disabled={!subscription.editable}
              >
                <EditIcon />
              </IconButton>
              <Typography variant="body2" inline>
                {subscription.payment_pack
                  ? subscription.payment_pack.name
                  : ' - '}
              </Typography>
            </div>
          </div>
        )}
        {!!subscription.private_pass && (
          <div className={classes.fieldNotPadded}>
            <Typography variant="body2" inline>
              {t('parameters.private_pass')}
            </Typography>
            <div className={classes.rowRight}>
              <Typography variant="body2" inline>
                {subscription.private_pass
                  ? subscription.private_pass.name
                  : ' - '}
              </Typography>
            </div>
          </div>
        )}

        <div className={classes.field}>
          <Typography variant="body2" inline>
            {props.t('parameters.status')}
          </Typography>
          {renderStatus(
            t,
            subscription.canceled_at,
            subscription.has_ended,
            subscription.pauses,
          )}
        </div>
        <div className={classes.field}>
          <Typography variant="body2" inline>
            {props.t('parameters.note')}
          </Typography>
          {subscription.note}
        </div>
        {lastInvoice && !(subscription.has_ended || subscription.canceled_at) && (
          <div className={classes.field}>
            <Typography className={classes.scheduledStop} variant="body2">
              {t('subscription.scheduledStop.summary', {
                date: moment(lastInvoice.date).format('L'),
              })}
            </Typography>
            <Button
              variant="outlined"
              disabled={moment(lastInvoice.date).isBefore(moment())}
              onClick={() => props.unflagPlannedInvoiceAsLast(lastInvoice.id)}
              color="error"
            >
              {t('form.cancel')}
            </Button>
          </div>
        )}
      </fieldset>
    </div>
  );
}

const styles = (theme) => ({
  container: {
    padding: theme.spacing(1),
  },
  field: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
  fieldNotPadded: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  parameters: {},
  statusContainer: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    border: '1px solid #DDDDDD',
    backgroundColor: '#F8F8F8',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 6,
  },
  rowRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  bottomButtonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(2),
    right: 0,
  },
  scheduledStop: {
    marginRight: theme.spacing(4),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['subscription']),
)(SubscriptionSummary);
