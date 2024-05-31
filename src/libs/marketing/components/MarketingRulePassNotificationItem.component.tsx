import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import type { Theme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { NOTIFICATION_KIND } from '@bsport/common/lib/master-data/notification-rule-events';
import type { TFunction } from 'i18next';
import { ImmutableObject } from 'seamless-immutable';
import { CustomChip } from '#src/components/chip/CustomChip.component';
import type { MarketingNotification } from '../types';
import { EmailTemplateSummary } from '#src/libs/email-editor/types';
import { CONSUMER_PAYMENT_PACK_CREDIT_NOTIFICATION_COUNTDOWN_ON_BOOKING } from '#src/libs/payment-packs/utils';

const getNotificationTriggerDescription = (
  notification: ImmutableObject<MarketingNotification>,
  t: TFunction, // Scoped to `marketing` namespace
) => {
  const { event_rules, kind: notificationKind } = notification;
  if (
    notificationKind === NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_CREDIT ||
    notificationKind === NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_CREDIT
  ) {
    const trigger = t('notifications.triggerDescription.remainingCredit', {
      count: event_rules.credits_left,
    });

    const creditNotificationTtype =
      event_rules.kind ??
      CONSUMER_PAYMENT_PACK_CREDIT_NOTIFICATION_COUNTDOWN_ON_BOOKING;
    const hours = event_rules.hours ?? 0;

    if (
      creditNotificationTtype ===
      CONSUMER_PAYMENT_PACK_CREDIT_NOTIFICATION_COUNTDOWN_ON_BOOKING
    ) {
      if (hours === 0) {
        return `${trigger} - ${t('notifications.sendingDelay.justOnBooking')}`;
      }
      return `${trigger} - ${t('notifications.sendingDelay.onBooking', {
        hours: hours,
      })}`;
    }
    if (hours === 0) {
      return `${trigger} - ${t('notifications.sendingDelay.justOnSession')}`;
    }
    return `${trigger} - ${t('notifications.sendingDelay.onSession', {
      hours: hours,
    })}`;
  }
  if (
    notificationKind === NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_TIME ||
    notificationKind === NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_TIME
  ) {
    if (event_rules.days_left < 0) {
      return t('notifications.triggerDescription.expiredValidity', {
        count: -event_rules.days_left,
      });
    }
    if (event_rules.days_left === 0) {
      return t('notifications.triggerDescription.todayValidity');
    }
    return t('notifications.triggerDescription.remainingValidity', {
      count: event_rules.days_left,
    });
  }
  return '';
};

type Props = {
  notification: ImmutableObject<MarketingNotification>;
  emailSummariesById: {
    [key: string]: EmailTemplateSummary;
  };
};

const MarketingRulePassNotificationItem: React.FC<Props> = ({
  notification,
  emailSummariesById,
}: Props) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();
  const {
    email_design,
    push_notification_title,
    event_rules: { name },
  } = notification;

  return (
    <div className={classes.notificationPreview}>
      <Typography className={classes.notificationName} variant="body1">
        {name}
      </Typography>
      <Typography style={{ color: '#757575' }} variant="body2">
        {getNotificationTriggerDescription(notification, t)}
      </Typography>
      <div className={classes.componentContainer}>
        {!!email_design && (
          <CustomChip
            blackText
            displayedValue={emailSummariesById[email_design]?.title || ''}
            icon="MailOutline"
          />
        )}
        {!!push_notification_title && (
          <CustomChip
            blackText
            displayedValue={push_notification_title}
            icon="NotificationsNone"
          />
        )}
      </div>
    </div>
  );
};

export default MarketingRulePassNotificationItem;

const useStyles = makeStyles((theme: Theme) => ({
  notificationName: {
    fontWeight: 400,
  },
  notificationPreview: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  componentContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
  },
}));
