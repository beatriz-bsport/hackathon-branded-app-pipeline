// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PaymentIcon from '@material-ui/icons/Payment';
import PersonIcon from '@material-ui/icons/Person';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';
import moment from 'moment';

import RedButton from '../../components/button/RedButton.component';

import type { Subscription } from './types';
import type { Member } from '../../api/types';

type Props = {
  stopSubscription: () => void,
  goToSubscribe: (id: number) => void,
  subscription: Subscription,
  goToMember: (id: number) => void,
  member: Member,
  t: TFunction,
  classes: Object,
  goToMember: () => void,
  member: {},
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
      <Typography color="error">
        {t('subscriptionStatus.canceledOn') +
          moment(canceled_at).format('DD/MM/YYYY')}
      </Typography>
    );
  }
  return (
    <Typography color="secondary">{t('subscriptionStatus.pending')}</Typography>
  );
};

export function SubscriptionSummary(props: Props) {
  const { subscription, t, classes, stopSubscription } = props;
  if (!subscription) {
    return null;
  }
  return (
    <div className={classes.container}>
      <fieldset className={classes.parameters}>
        <legend>{t('parameters.parameters')}</legend>
        <div className={classes.field}>
          <Typography inline>{t('parameters.nbInterval')}</Typography>
          <Typography inline>{subscription.nb_interval}</Typography>
        </div>
        <div className={classes.field}>
          <Typography inline>{t('parameters.trial_nb')}</Typography>
          <Typography inline>{subscription.trial_nb}</Typography>
        </div>
        <div className={classes.field}>
          <Typography inline>{t('parameters.recurrent_price')}</Typography>
          <Typography inline>{subscription.recurrent_price} €</Typography>
        </div>
        <div className={classes.field}>
          <Typography inline>{t('parameters.recurrent_voucher')}</Typography>
          <Typography inline>{subscription.recurrent_voucher} €</Typography>
        </div>
      </fieldset>
      <div className={classes.statusContainer}>
        {renderStatus(t, subscription.canceled_at, subscription.has_ended)}
        <RedButton
          disabled={subscription.has_ended || subscription.canceled_at}
          onClick={stopSubscription}
        >
          {t('action.stop')}
        </RedButton>
      </div>
      <div className={classes.bottomButtonsContainer}>
        <Button
          color="secondary"
          variant="contained"
          onClick={() =>
            props.goToSubscribe(props.subscription && props.subscription.member)
          }
        >
          <PaymentIcon className={classes.leftIcon} />
          {t('parameters.subscribeAgain')}
        </Button>
        {props.goToMember ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => props.goToMember(props.subscription.member)}
          >
            <PersonIcon />
            {props.member}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

const styles = (theme) => ({
  container: {
    padding: theme.spacing.unit,
  },
  field: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing.unit,
  },
  parameters: {},
  statusContainer: {
    marginTop: theme.spacing.unit * 2,
    padding: theme.spacing.unit,
    border: '1px solid #DDDDDD',
    backgroundColor: '#F8F8F8',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 6,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  bottomButtonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.unit * 2,
    right: 0,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['subscription']),
)(SubscriptionSummary);
