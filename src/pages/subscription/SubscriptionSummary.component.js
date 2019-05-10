// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';

import RedButton from '../../components/button/RedButton.component';

import type { Subscription } from './types';

type Props = {
  subscription: Subscription,
  t: TFunction,
  classes: Object,
};

const renderStatus = (
  t: TFunction,
  canceled_at: string,
  has_ended: boolean,
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
      <Typography color="error">{t('subscriptionStatus.canceled')}</Typography>
    );
  }
  return (
    <Typography color="secondary">{t('subscriptionStatus.pending')}</Typography>
  );
};

export function SubscriptionSummary(props: Props) {
  const { subscription, t, classes } = props;
  if (!subscription) {
    return null;
  }
  return (
    <div>
      <Typography variant="h4">{props.subscription.name}</Typography>
      <div className={classes.parameters}>
        <div className={classes.field}>
          <Typography inline>{t('parameters.nbInterval')}</Typography>
          <Typography inline>{subscription.nb_interval}</Typography>
        </div>
        <div className={classes.field}>
          <Typography inline>{t('parameters.nbInterval')}</Typography>
          <Typography inline>{subscription.nb_interval}</Typography>
        </div>
        <div className={classes.field}>
          <Typography inline>{t('parameters.trialNb')}</Typography>
          <Typography inline>{subscription.trial_nb}</Typography>
        </div>
        <div className={classes.field}>
          <Typography inline>{t('parameters.price')}</Typography>
          <Typography inline>{subscription.recurrent_price}</Typography>
        </div>
        <div className={classes.field}>
          <Typography inline>{t('parameters.recurrentVoucher')}</Typography>
          <Typography inline>{subscription.recurrent_voucher}</Typography>
        </div>
        <div className={classes.field}>
          <Typography inline>{t('parameters.nbInterval')}</Typography>
          <Typography inline>{subscription.nb_interval}</Typography>
        </div>
      </div>
      <div className={classes.statusContainer}>
        {renderStatus(t, subscription.canceled_at, subscription.has_ended)}
        <RedButton
          disabled={subscription.has_ended || subscription.canceled_at}
        >
          {t('action.stop')}
        </RedButton>
      </div>
    </div>
  );
}

const styles = (theme) => ({
  field: {
    display: 'flex',
    justify: 'space-between',
    padding: theme.spacing.unit,
  },
  parameters: {
    backgroundColor: 'EFEFEF',
    margin: theme.spacing.unit,
  },
  statusContainer: {
    padding: theme.spacing.unit,
    border: '1px solid #DDDDDD',
    borderRadius: 6,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['subscription']),
)(SubscriptionSummary);
