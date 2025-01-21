import React, { useMemo } from 'react';
import { DateTime } from 'luxon';
import clsx from 'clsx';
import { makeStyles, Paper, Theme, Typography } from '@material-ui/core';
import { CompanyTheme } from '#src/libs/theme/types';
import { replaceGenericTagsInTemplate } from '#src/libs/email-editor/utils';
import { ResolvedGenericTags } from '#src/libs/email-editor/types';
import { UPSELL_IDENTIFIER_PUSH_NOTIFICATION } from '#src/libs/platform-billing/upsell-identifiers';
import { FeatureList } from '#src/libs/company/types';
import { hasUpsell } from '#src/libs/platform-billing/utils';
// @ts-expect-error
import FeatureListProvider from '../../libs/company/hocs/feature-list-provider.hoc';

type OwnProps = {
  notification?: {
    push_notification_title: string;
    push_notification_content: string;
  };
  theme: CompanyTheme;
  className?: string;
  resolvedGenericTags: ResolvedGenericTags;
};

type Props = OwnProps;

const NotificationPushPreview = (props: Props) => {
  const { notification, theme, className, resolvedGenericTags } = props;

  const classes = useStyles();

  const push_notification_content: string = useMemo(
    () =>
      replaceGenericTagsInTemplate(
        resolvedGenericTags,
        notification.push_notification_content,
      ),
    [resolvedGenericTags, notification.push_notification_content],
  );

  return (
    <>
      <FeatureListProvider>
        {(featureList: FeatureList) => (
          <>
            {hasUpsell(featureList, UPSELL_IDENTIFIER_PUSH_NOTIFICATION) &&
              notification.push_notification_title !== '' &&
              notification.push_notification_content !== '' && (
                <div className={clsx(classes.greyBack, className)}>
                  <Paper className={classes.notification}>
                    <div className={classes.notificationHeader}>
                      <div className={classes.notificationCompany}>
                        {theme.company_name}
                      </div>
                      <div className={classes.notificationHour}>
                        {DateTime.now().toFormat('HH:mm')}
                      </div>
                    </div>
                    <div className={classes.notificationTitle}>
                      {notification.push_notification_title}
                    </div>
                    <Typography>{push_notification_content}</Typography>
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
