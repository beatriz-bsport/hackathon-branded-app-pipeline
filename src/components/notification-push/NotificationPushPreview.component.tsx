import React from 'react';
import moment from 'moment-timezone';
import classNames from 'classnames';
import { makeStyles, Paper, Theme, Typography } from '@material-ui/core';
import FeatureListProvider from '../../libs/company/hocs/feature-list-provider.hoc';
import { CompanyTheme } from '#libs/theme/types';

type OwnProps = {
  notification?: {
    push_notification_title: string;
    push_notification_content: string;
  };
  theme: CompanyTheme;
  className?: string;
};

type Props = OwnProps;

const NotificationPushPreview = (props: Props) => {
  const { notification, theme, className } = props;

  const classes = useStyles();

  return (
    <>
      <FeatureListProvider>
        {(featureList) => (
          <>
            {featureList.upsell &&
              featureList.upsell.find(
                (f) => f.readable_identifier === 'push_notification',
              ) &&
              notification.push_notification_title !== '' &&
              notification.push_notification_content !== '' && (
                <div className={classNames(classes.greyBack, className)}>
                  <Paper className={classes.notification}>
                    <div className={classes.notificationHeader}>
                      <div className={classes.notificationCompany}>
                        {theme.company_name}
                      </div>
                      <div className={classes.notificationHour}>
                        {moment().format('HH:mm')}
                      </div>
                    </div>
                    <div className={classes.notificationTitle}>
                      {notification.push_notification_title}
                    </div>
                    <Typography>
                      {notification.push_notification_content}
                    </Typography>
                  </Paper>
                </div>
              )}
          </>
        )}
      </FeatureListProvider>
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  greyBack: {
    background: theme.palette.grey[300],
    boxShadow: theme.shadows[1],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  notification: {
    width: 360,
    padding: theme.spacing(2),
    borderRadius: 12,
    boxShadow: theme.shadows[2],
  },
  notificationTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  notificationHeader: {
    display: 'flex',
    alignItem: 'center',
    justifyContent: 'space-between',
  },
  notificationCompany: {
    fontSize: 13,
    color: theme.palette.grey[500],
  },
  notificationHour: {
    fontSize: 13,
    color: theme.palette.grey[700],
  },
}));

export default NotificationPushPreview;
