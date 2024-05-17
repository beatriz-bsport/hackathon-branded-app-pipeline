import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ClearIcon from '@material-ui/icons/Clear';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import PauseIcon from '@material-ui/icons/Pause';
import DoneIcon from '@material-ui/icons/Done';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  BILLING_PLAN_STATUS_ENDED,
  BILLING_PLAN_STATUS_PAUSED,
} from '@bsport/common/lib/master-data/subscription-status';
import { formatAsDate } from '../../../utils/datetime';
import { Subscription } from '../types';

const SubscriptionStatus = (props: { subscription: Subscription }) => {
  const classes = useStyles();
  const { t } = useTranslation('subscription');
  const { subscription } = props;
  if (subscription.canceled_at) {
    return (
      <div className={classes.subscriptionStatus}>
        <Typography variant="caption">{t('listItem.canceled')}</Typography>
        <ClearIcon className={classes.icon} />
      </div>
    );
  }
  if (
    subscription.has_ended ||
    subscription.status === BILLING_PLAN_STATUS_ENDED
  ) {
    return (
      <div className={classes.subscriptionStatus}>
        <Typography variant="caption">{t('listItem.expired')}</Typography>
        <HourglassEmptyIcon className={classes.icon} />
      </div>
    );
  }
  if (subscription.status === BILLING_PLAN_STATUS_PAUSED) {
    return (
      <div className={classes.subscriptionStatus}>
        <Typography variant="caption">{t('listItem.paused')}</Typography>
        <PauseIcon className={classes.icon} />
      </div>
    );
  }
  return (
    <div className={classes.subscriptionStatus}>
      <Typography variant="caption">{t('listItem.valid')}</Typography>
      <DoneIcon className={classes.icon} />
    </div>
  );
};

type Props = {
  subscription: Subscription;
  onClick: () => void;
  withoutSubscriptionStatus?: boolean;
};

const SubscriptionRowItem = (props: Props) => {
  const { t } = useTranslation('subscription');
  return (
    <div>
      {/* @ts-expect-error */}
      <ListItem dense button={!!props.onClick} onClick={props.onClick || null}>
        <ListItemAvatar>
          <Avatar
            src={
              // @ts-expect-error
              props.subscription?.member?.photo
                ? // @ts-expect-error
                  props.subscription.member.photo
                : null
            }
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography>{props.subscription.memberName}</Typography>
              {props.subscription?.memberArchived && (
                <Typography color="secondary" variant="caption">
                  {`${'\u00A0'}(${t('member:archived')})`}
                </Typography>
              )}
            </div>
          }
          secondary={t('listItem.subscribedOn', {
            date: formatAsDate(props.subscription.first_billing_date),
          })}
          secondaryTypographyProps={{ variant: 'caption' }}
        />
        {!props.withoutSubscriptionStatus && (
          <SubscriptionStatus subscription={props.subscription} />
        )}
      </ListItem>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  subscriptionStatus: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    margin: theme.spacing(2),
  },
}));

export default SubscriptionRowItem;
