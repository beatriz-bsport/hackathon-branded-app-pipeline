// @ts-nocheck
// @flow
import React, { useMemo } from 'react';
import { IconButton, Theme, makeStyles, Paper } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import CropFreeIcon from '@material-ui/icons/CropFree';
import Alert from '@material-ui/lab/Alert/Alert';

import { NotificationRule, NotificationRuleEventType } from '../types';
import {
  EmailTemplateDetail,
  ResolvedGenericTags,
} from '#libs/email-editor/types';
import NotificationPushPreview from '#components/notification-push/NotificationPushPreview.component';
import { CompanyTheme } from '#libs/theme/types';
import { replaceGenericTagsInTemplate } from '#libs/email-editor/utils';

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
  resolvedGenericTags: ResolvedGenericTags;
};

const NotificationRulePreview = (props: Props) => {
  const {
    className,
    event,
    previewEmail,
    theme,
    displayMode,
    resolvedGenericTags,
    showEmailPreviewHTML,
    showEmailPreview,
  } = props;

  const { t } = useTranslation('notificationRule');
  const classes = useStyles();

  const handleShowEmail = (rule: NotificationRule) => () => {
    if (rule && !rule.email_design) {
      showEmailPreviewHTML(rule.email_template);
    } else {
      showEmailPreview(rule?.email_design);
    }
  };

  const emailPreview = useMemo(
    () =>
      replaceGenericTagsInTemplate(
        resolvedGenericTags,
        previewEmail?.[event?.rule?.email_design]?.html ||
          event?.rule?.email_template,
      ),
    [
      event?.rule?.email_design,
      event?.rule?.email_template,
      resolvedGenericTags,
      previewEmail,
    ],
  );

  return (
    <div className={className}>
      {!event && (
        <div className={classes.center}>
          <div className={classes.emptyState}>
            <Alert className={classes.alertInfo} color="grey" severity="info">
              {t('preview.emptyState')}
            </Alert>
          </div>
        </div>
      )}
      {event && displayMode === 'email' && (
        <Paper className={classes.preview}>
          <iframe
            className={classes.html}
            frameBorder="0"
            scrolling="no"
            srcDoc={emailPreview}
            title="notification-rule-preview-iframe"
          />
          <IconButton
            className={classes.showMore}
            onClick={handleShowEmail(event.rule)}
          >
            <CropFreeIcon color="disabled" />
          </IconButton>
        </Paper>
      )}
      {displayMode === 'notification' && (
        <>
          {event?.rule &&
            event.rule.push_notification_title &&
            event.rule.push_notification_content && (
              <NotificationPushPreview
                className={classes.fullAvailableSize}
                notification={{
                  push_notification_title: event.rule.push_notification_title,
                  push_notification_content:
                    event.rule.push_notification_content,
                }}
                resolvedGenericTags={resolvedGenericTags}
                theme={theme}
              />
            )}
          {(!event.rule ||
            event.rule.push_notification_title === '' ||
            event.rule.push_notification_content === '') && (
            <div className={classes.emptyState}>
              <Alert className={classes.alertInfo} color="grey" severity="info">
                {t('preview.emptyStateNotification')}
              </Alert>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  alertInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  emptyState: {
    marginTop: theme.spacing(6),
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    alignItems: 'center',
  },
  center: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  preview: {
    position: 'relative',
    display: 'flex',
    flex: 1,
    borderRadius: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      minHeight: 300,
    },
  },
  fullAvailableSize: {
    flex: 1,
    height: '100%',
    display: 'flex',
    borderRadius: 4,
  },
  html: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  showMore: {
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
  },
}));

export default NotificationRulePreview;
