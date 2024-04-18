// @ts-nocheck
import React from 'react';
import { Theme, Typography, withStyles } from '@material-ui/core';
import { compose } from 'recompose';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import MailOutlineIcon from '@material-ui/icons/MailOutline';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import { NOTIFICATION_KIND } from '@bsport/common/lib/master-data/notification-rule-events';

import { MarketingNotification } from '../types';
import { MaterialStyleType } from '../../../utils/types';
import FeatureListProvider from '../../company/hocs/feature-list-provider.hoc';
import { SmartList } from '../../smart-list/types';

import { CONSUMER_PAYMENT_PACK_CREDIT_NOTIFICATION_COUNTDOWN_ON_BOOKING } from '#libs/payment-packs/utils';
import { UPSELL_IDENTIFIER_PUSH_NOTIFICATION } from '#libs/platform-billing/upsell-identifiers';
import { FeatureList } from '#libs/company/types';
import { hasUpsell } from '#libs/platform-billing/utils';
import {
  getCreditsDividedDisplay,
  getCreditsDividedValue,
} from '#libs/theme/utils';

const getLabelForRules = (
  notification: MarketingNotification,
  t: TFunction,
) => {
  if (
    [
      NOTIFICATION_KIND.BOOKING_CREATION,
      NOTIFICATION_KIND.PRIVATE_BOOKING_CREATION,
    ].includes(notification.kind)
  ) {
    let key = 'second_before';
    if (notification.event_rules.hours > 0) {
      key = 'second_after';
    } else if (notification.event_rules.days < 0) {
      key = 'second_before_days';
    } else if (notification.event_rules.days > 0) {
      key = 'second_after_days';
    }
    const trad = t(`booking:notification.form.chooseTime.${key}`, {
      count:
        Math.abs(notification.event_rules.hours) ||
        Math.abs(notification.event_rules.days),
    });
    return trad;
  }

  if (
    notification.kind === NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_TIME ||
    notification.kind === NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_TIME
  ) {
    const key =
      notification.event_rules.days_left < 0
        ? 'daysPastLabel'
        : 'daysLeftLabel';
    const absDay = Math.abs(notification.event_rules.days_left);
    return t(`paymentPack:notification.${key}`, {
      count: absDay,
      day: absDay,
    });
  }
  if (
    notification.kind === NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_CREDIT ||
    notification.kind === NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_CREDIT
  ) {
    const creditsLeftLabel = t('paymentPack:notification.creditsLeftLabel', {
      credit: getCreditsDividedDisplay(notification.event_rules.credits_left),
      count: getCreditsDividedValue(notification.event_rules.credits_left),
    });
    const { kind, hours } = notification.event_rules;
    if (kind !== undefined && hours) {
      const countdownLabel = t(
        `paymentPack:notification.${
          kind ===
          CONSUMER_PAYMENT_PACK_CREDIT_NOTIFICATION_COUNTDOWN_ON_BOOKING
            ? 'creditsLeftOnBooking'
            : 'creditsLeftOnOfferStart'
        }`,
        { hours },
      );
      return `${creditsLeftLabel} - ${countdownLabel}`;
    }
    return creditsLeftLabel;
  }

  if (
    notification.kind ===
      NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_CREATION ||
    notification.kind ===
      NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_FIRST_BILLING ||
    notification.kind === NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_END
  ) {
    const { days, hours } = notification.event_rules;
    const kind = notification.kind;
    let period = 0;
    if (days !== null) {
      period = days;
    } else if (hours !== null) {
      period = hours;
    }
    let count = period;
    let isAfterEvent = true;
    if (period < 0) {
      count = -period;
      isAfterEvent = false;
    }
    const notificationKind = (() => {
      switch (kind) {
        case NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_CREATION:
          return t('subscription:notification.creation').toLowerCase();
        case NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_FIRST_BILLING: {
          return isAfterEvent
            ? t('subscription:notification.afterfirstBilling').toLowerCase()
            : t('subscription:notification.beforefirstBilling').toLowerCase();
        }
        case NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_END: {
          return isAfterEvent
            ? t('subscription:notification.afterSubscriptionEnd').toLowerCase()
            : t(
                'subscription:notification.beforeSubscriptionEnd',
              ).toLowerCase();
        }
        default: {
          return '';
        }
      }
    })();
    return t('subscription:notification.title', {
      count,
      periodScale:
        days !== null
          ? t('subscription:notification.days', { count }).toLowerCase()
          : t('subscription:notification.hours', { count }).toLowerCase(),
      notificationKind,
    });
  }

  if (notification.kind === 0) {
    return t('notificationRule:marketingNotification.birthday');
  }
  return '';
};

type OwnProps = {
  notification: MarketingNotification;
  emailTitle: string;
  smartLists?: SmartList[];
};

type Props = OwnProps & MaterialStyleType<ReturnType<typeof styles>>;

const NotificationListInner = (props: Props) => {
  const { emailTitle, classes, notification, smartLists = [] } = props;
  const { t } = useTranslation();

  return (
    <>
      <FeatureListProvider>
        {(featureList: FeatureList) => (
          <div className={classes.contentContainer}>
            <Typography>{getLabelForRules(notification, t)}</Typography>
            {hasUpsell(featureList, UPSELL_IDENTIFIER_PUSH_NOTIFICATION) &&
              notification.push_notification_title !== '' && (
                <div className={classes.row}>
                  <NotificationsNoneIcon
                    className={classes.icon}
                    fontSize="small"
                  />
                  <Typography variant="caption">
                    {notification.push_notification_title}
                  </Typography>
                </div>
              )}
            {emailTitle && (
              <div className={classes.row}>
                <MailOutlineIcon className={classes.icon} fontSize="small" />
                <Typography variant="caption">{emailTitle}</Typography>
              </div>
            )}
            {notification?.event_rules?.smartlist_exclude &&
              notification?.event_rules?.smartlist_exclude.length > 0 && (
                <div className={classes.inlineLeft}>
                  <Typography variant="caption">
                    {` ${t('paymentPack:notification.listItem.smartList')}: `}
                  </Typography>
                  <Typography className={classes.list} variant="caption">
                    {smartLists
                      .filter((smartlist) =>
                        notification?.event_rules?.smartlist_exclude.includes(
                          smartlist.id,
                        ),
                      )
                      .map((smartlist) => smartlist.name)
                      .join(', ') || ' - '}
                  </Typography>
                </div>
              )}
            {notification?.event_rules?.smartlist_include &&
              notification?.event_rules?.smartlist_include.length > 0 && (
                <div className={classes.inlineLeft}>
                  <Typography variant="caption">
                    {` ${t(
                      'paymentPack:notification.listItem.smartListInclude',
                    )}: `}
                  </Typography>
                  <Typography className={classes.list} variant="caption">
                    {smartLists
                      .filter((smartlist) =>
                        notification?.event_rules?.smartlist_include.includes(
                          smartlist.id,
                        ),
                      )
                      .map((smartlist) => smartlist.name)
                      .join(', ') || ' - '}
                  </Typography>
                </div>
              )}
          </div>
        )}
      </FeatureListProvider>
    </>
  );
};

const styles = (theme: Theme) => ({
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  list: {
    marginLeft: theme.spacing(1),
  },
  inlineLeft: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
});

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
)(NotificationListInner);
