import React from 'react';
import {
  ButtonBase,
  Paper,
  Switch,
  Theme,
  withStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { NOTIFICATION_KIND } from '@bsport/common/lib/master-data/notification-rule-events.js';

import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import { MarketingNotification } from '../types';
import { DeepPartial, MaterialStyleType } from '../../../utils/types';
import { EmailTemplateSummary } from '../../email-editor/types';
import NotificationListInner from './NotificationListInner.component';
import { SmartList } from '../../smart-list/types';

type OwnProps = {
  notifications: MarketingNotification[];
  onClickNotification: (notification: MarketingNotification) => void;
  onUpdateNotification: (
    id: number,
    data: DeepPartial<MarketingNotification>,
  ) => void;
  emailSummariesById: { [key: string]: EmailTemplateSummary };
  smartLists?: SmartList[];
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

const sortNotifications = (
  a: MarketingNotification,
  b: MarketingNotification,
) => {
  if (
    [
      NOTIFICATION_KIND.PRIVATE_BOOKING_CREATION,
      NOTIFICATION_KIND.BOOKING_CREATION,
    ].includes(a.kind)
  ) {
    return a.event_rules.hours - b.event_rules.hours;
  }
  if (
    a.kind === NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_CREATION ||
    a.kind === NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_FIRST_BILLING ||
    a.kind === NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_END
  ) {
    return (
      a.event_rules.hours +
      24 * a.event_rules.days -
      (b.event_rules.hours + 24 * b.event_rules.days)
    );
  }
  if (a.kind === NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_TIME) {
    return a.event_rules.days_left - b.event_rules.days_left;
  }
  if (a.kind === NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_TIME) {
    return a.event_rules.days_left - b.event_rules.days_left;
  }
  return a.event_rules.credits_left - b.event_rules.credits_left;
};

export class MarketingNotificationsList extends React.PureComponent<Props> {
  render() {
    const { classes, notifications, smartLists } = this.props;

    return (
      <Paper className={classes.notificationList}>
        {notifications.sort(sortNotifications).map((notif, i) => {
          let emailTitle = '';
          const email = this.props.emailSummariesById[notif.email_design];
          if (email) {
            emailTitle = email.title;
          }
          return (
            <div key={notif.id} className={classes.notificationListContainer}>
              <ButtonBase
                className={clsx({
                  [classes.notificationListItem]: true,
                  [classes.notificationListItemBorder]:
                    i !== notifications.length - 1,
                })}
                onClick={() => this.props.onClickNotification(notif)}
              >
                <NotificationListInner
                  emailTitle={emailTitle}
                  notification={notif}
                  smartLists={smartLists}
                />
                <ObjectLevelPermissionWrapper
                  forcedBehavior="hidden"
                  requiredPermission="member.allowed_actions.manageNotification"
                >
                  <div>
                    <Switch
                      checked={notif.active}
                      onChange={() =>
                        this.props.onUpdateNotification(notif.id, {
                          active: !notif.active,
                        })
                      }
                    />
                  </div>
                </ObjectLevelPermissionWrapper>
              </ButtonBase>
            </div>
          );
        })}
      </Paper>
    );
  }
}

const styles = (theme: Theme) => ({
  notificationListContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  notificationList: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    marginTop: theme.spacing(0.5),
  },
  notificationListItem: {
    display: 'flex',
    width: '100%',
    flex: 1,
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  notificationListItemBorder: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#CCC',
  },
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
});

export default compose<any, OwnProps>(
  // @ts-expect-error
  withStyles(styles),
  withTranslation(),
)(MarketingNotificationsList);
