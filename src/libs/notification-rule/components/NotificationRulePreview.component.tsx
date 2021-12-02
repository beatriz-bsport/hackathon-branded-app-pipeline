// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { IconButton, Theme, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import InfoIcon from '@material-ui/icons/Info';
import CropFreeIcon from '@material-ui/icons/CropFree';

import { NotificationRule, NotificationRuleEventType } from '../types';
import { EmailTemplateDetail } from '#libs/email-editor/types';
import NotificationPushPreview from '#components/notification-push/NotificationPushPreview.component';
import { CompanyTheme } from '#libs/theme/types';

type Props = {
  previewEmail?: {
    [key: string | number]: EmailTemplateDetail;
  };
  className?: string;
  event?: NotificationRuleEventType & { rule: NotificationRule };
  theme?: CompanyTheme;
  displayMode?: 'notification' | 'email';
  showEmailPreviewHTML?: (html: string) => void;
  showEmailPreview?: (id: number) => void;
};

const NotificationRulePreview = (props: Props) => {
  const {
    className,
    event,
    previewEmail,
    theme,
    displayMode,
    showEmailPreviewHTML,
    showEmailPreview,
  } = props;

  const { t } = useTranslation('notificationRule');
  const classes = useStyles();

  const handleShowEmail = (rule: NotificationRule) => () => {
    if (rule && !rule.email_design) {
      showEmailPreviewHTML(rule.email_template);
    } else {
      showEmailPreview(rule.email_design);
    }
  };

  return (
    <div className={className}>
      {!event && (
        <div className={classes.center}>
          <div className={classes.emptyState}>
            <InfoIcon color="disabled" />
            <Typography className={classes.emptyText}>
              {t('preview.emptyState')}
            </Typography>
          </div>
        </div>
      )}
      {event && displayMode === 'email' && (
        <div className={classes.preview}>
          <div
            // eslint-disable-next-line
            dangerouslySetInnerHTML={{
              __html:
                previewEmail?.[event?.rule?.email_design]?.html ||
                event?.rule?.email_template,
            }}
            className={classes.html}
          />
          <IconButton
            onClick={handleShowEmail(event.rule)}
            className={classes.showMore}
          >
            <CropFreeIcon color="disabled" />
          </IconButton>
        </div>
      )}
      {displayMode === 'notification' && (
        <>
          {event?.rule &&
            event.rule.push_notification_title &&
            event.rule.push_notification_content && (
              <NotificationPushPreview
                notification={{
                  push_notification_title: event.rule.push_notification_title,
                  push_notification_content:
                    event.rule.push_notification_content,
                }}
                theme={theme}
                className={classes.fullAvailableSize}
              />
            )}
          {(!event.rule ||
            event.rule.push_notification_title === '' ||
            event.rule.push_notification_content === '') && (
            <div className={classes.emptyState}>
              <InfoIcon color="disabled" />
              <Typography className={classes.emptyText}>
                {t('preview.emptyStateNotification')}
              </Typography>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  emptyState: {
    marginTop: theme.spacing(6),
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: theme.palette.grey['500'],
    marginLeft: theme.spacing(1),
  },
  center: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  preview: {
    position: 'relative',
    backgroundColor: '#E7E7E7',
    display: 'flex',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: theme.spacing(2),
    justifyContent: 'space-around',
    flex: 1,
  },
  fullAvailableSize: {
    flex: 1,
    height: '100%',
    display: 'flex',
    borderRadius: 4,
  },
  html: {
    position: 'absolute',
  },
  showMore: {
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
  },
}));

export default NotificationRulePreview;
