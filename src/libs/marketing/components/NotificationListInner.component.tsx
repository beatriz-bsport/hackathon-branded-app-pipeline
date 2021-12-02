import React from 'react';
import { Theme, Typography, withStyles } from '@material-ui/core';
import { compose } from 'recompose';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NOTIFICATION_KIND } from '@bsport/common/lib/master-data/notification-rule-events';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';

import { MarketingNotification } from '../types';
import { MaterialStyleType } from '../../../utils/types';
import FeatureListProvider from '../../company/hocs/feature-list-provider.hoc';
import { SmartList } from '../../smart-list/types';

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
    const key =
      notification.event_rules.hours < 0 ? 'second_before' : 'second_after';
    const trad = t(`booking:notification.form.chooseTime.${key}`);
    return `${Math.abs(notification.event_rules.hours)} ${trad}`;
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
    return t('paymentPack:notification.creditsLeftLabel', {
      credit: notification.event_rules.credits_left,
      count: notification.event_rules.credits_left,
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
  smartLists: SmartList[];
};

type Props = OwnProps & MaterialStyleType<ReturnType<typeof styles>>;

const NotificationListInner = (props: Props) => {
  const { emailTitle, classes, notification, smartLists = [] } = props;
  const { t } = useTranslation();

  return (
    <>
      <FeatureListProvider>
        {(featureList) => (
          <div className={classes.contentContainer}>
            <Typography className={classes.title}>
              {getLabelForRules(notification, t)}
            </Typography>
            {featureList.upsell &&
              featureList.upsell.find(
                (f) => f.readable_identifier === 'push_notification',
              ) &&
              notification.push_notification_title !== '' && (
                <div className={classes.row}>
                  <NotificationsNoneIcon
                    fontSize="small"
                    className={classes.icon}
                  />
                  <Typography variant="caption">
                    {notification.push_notification_title}
                  </Typography>
                </div>
              )}
            {emailTitle && (
              <div className={classes.row}>
                <MailOutlineIcon fontSize="small" className={classes.icon} />
                <Typography variant="caption">{emailTitle}</Typography>
              </div>
            )}
            {notification?.event_rules?.smartlist_exclude &&
              notification?.event_rules?.smartlist_exclude.length > 0 && (
                <div className={classes.inlineLeft}>
                  <Typography variant="caption">
                    {` ${t('paymentPack:notification.listItem.smartList')}: `}
                  </Typography>
                  <Typography variant="caption" className={classes.list}>
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
                  <Typography variant="caption" className={classes.list}>
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
  },
  title: {
    marginBottom: theme.spacing(2),
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
