// @flow
import React, { useMemo } from 'react';
import Typography from '@material-ui/core/Typography';
import { IconButton, Theme, makeStyles, Paper } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import InfoIcon from '@material-ui/icons/Info';
import CropFreeIcon from '@material-ui/icons/CropFree';

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
            <InfoIcon color="disabled" />
            <Typography className={classes.emptyText}>
              {t('preview.emptyState')}
            </Typography>
          </div>
        </div>
      )}
      {event && displayMode === 'email' && (
        <Paper className={classes.preview}>
          <iframe
            title="notification-rule-preview-iframe"
            srcDoc={emailPreview}
            className={classes.html}
            scrolling="no"
            frameBorder="0"
          />
          <IconButton
            onClick={handleShowEmail(event.rule)}
            className={classes.showMore}
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
                notification={{
                  push_notification_title: event.rule.push_notification_title,
                  push_notification_content:
                    event.rule.push_notification_content,
                }}
                theme={theme}
                className={classes.fullAvailableSize}
                resolvedGenericTags={resolvedGenericTags}
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
