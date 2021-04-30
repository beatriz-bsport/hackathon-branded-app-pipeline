import React from 'react';
import { compose } from 'recompose';
import { Theme, Typography, withStyles } from '@material-ui/core';
import { WithTranslation, withTranslation } from 'react-i18next';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import AvTimerIcon from '@material-ui/icons/AvTimer';
import { NOTIFICATION_KIND } from '@bsport/common/lib/master-data/notification-rule-events';

import { MaterialStyleType } from '../../../utils/types';
import { MarketingNotification } from '../types';
import { PaymentPack } from '../../../api/types';
import MarketingNotificationsList from './NotificationsList.Component';
import { EmailTemplateSummary } from '../../email-editor/types';

type OwnProps = {
  notificationsByPaymentPack: { [key: string]: MarketingNotification[] };
  paymentPackById: { [key: string]: PaymentPack };
  onClickNotification: (notification: MarketingNotification) => void;
  emailSummariesById: { [key: string]: EmailTemplateSummary };
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export class PaymentPackNotificationList extends React.PureComponent<Props> {
  render() {
    const { classes, t } = this.props;

    return (
      <div>
        <Typography className={classes.classTitle} variant="h4">
          {t('notifications.groupTitle.paymentPack')}
        </Typography>

        {!Object.keys(this.props.notificationsByPaymentPack).length && (
          <Typography>
            {t('marketing:notifications.notificationsEmpty')}
          </Typography>
        )}

        {Object.keys(this.props.notificationsByPaymentPack).map((id) => {
          const notifications: MarketingNotification[] = this.props
            .notificationsByPaymentPack[id];
          const paymentPack = this.props.paymentPackById[id];

          const byCredits = notifications.filter(
            (n) => n.kind === NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_CREDIT,
          );
          const byTime = notifications.filter(
            (n) => n.kind === NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_TIME,
          );

          if (paymentPack) {
            return (
              <div className={classes.paymentPackItem}>
                <Typography variant="h5" color="primary">
                  {paymentPack.name}
                </Typography>

                {!!byTime.length && (
                  <div className={classes.byKindContainer}>
                    <div className={classes.titleContainer}>
                      <AvTimerIcon />
                      <Typography className={classes.title}>
                        {t('notifications.paymentPackKind.validity')}
                      </Typography>
                    </div>
                    <div className={classes.notificationsContainer}>
                      <MarketingNotificationsList
                        notifications={byTime}
                        emailSummariesById={this.props.emailSummariesById}
                        onClickNotification={this.props.onClickNotification}
                      />
                    </div>
                  </div>
                )}

                {!!byCredits.length && (
                  <div className={classes.byKindContainer}>
                    <div className={classes.titleContainer}>
                      <ConfirmationNumberIcon />
                      <Typography className={classes.title}>
                        {t('notifications.paymentPackKind.credit')}
                      </Typography>
                    </div>
                    <div className={classes.notificationsContainer}>
                      <MarketingNotificationsList
                        notifications={byCredits}
                        emailSummariesById={this.props.emailSummariesById}
                        onClickNotification={this.props.onClickNotification}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  classTitle: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
  },
  paymentPackItem: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  byKindContainer: {
    marginTop: theme.spacing(2),
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    marginLeft: theme.spacing(2),
  },
  notificationsContainer: {
    marginTop: theme.spacing(1),
    paddingTop: theme.spacing(2),
    marginLeft: theme.spacing(1.5),
    paddingLeft: theme.spacing(3.5),
    borderWidth: 0,
    borderLeftWidth: 1,
    borderStyle: 'solid',
  },
  notificationContainer2: {},
});

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation(['marketing']),
)(PaymentPackNotificationList);
