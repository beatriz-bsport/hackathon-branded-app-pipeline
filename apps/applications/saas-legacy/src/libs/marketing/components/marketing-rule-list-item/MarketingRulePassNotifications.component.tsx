import React, { useCallback, useMemo } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import { makeStyles } from '@material-ui/core/styles';

import { useTranslation } from 'react-i18next';

import { Grid, List, Tooltip, Typography } from '@material-ui/core';
import { RemoveRedEye } from '@material-ui/icons';
import Immutable from 'seamless-immutable';
import type {
  EmailTemplateDetail,
  ResolvedGenericTags,
  EmailTemplateSummary,
} from '#src/libs/email-editor/types';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import type { MarketingNotification } from '../../types';
import MarketingRulePassNotificationItem from '../MarketingRulePassNotificationItem.component';
import type { CompanyTheme } from '#src/libs/theme/types';
import type { SmartList } from '#src/libs/smart-list/types';
import { splitPassNotificationsByTrigger } from '../../utils';
import { PreviewModal } from '../MarketingRulePreviewDialog.component';

type NotificationListProps = {
  title: string;
  notifications: MarketingNotification[];
  removeNotification: (n: MarketingNotification) => void;
  emailSummariesById: Record<string, EmailTemplateSummary>;
  onNotificationPreviewOpen: (n: MarketingNotification) => void;
};

const NotificationList: React.FC<NotificationListProps> = ({
  title,
  notifications,
  removeNotification,
  emailSummariesById,
  onNotificationPreviewOpen,
}: NotificationListProps) => {
  const classes = useStyles();
  const { t } = useTranslation('marketing');

  return (
    <Grid container direction="column">
      <Typography
        className={classes.sectionTitle}
        color="textPrimary"
        variant="subtitle1"
      >
        {title}
      </Typography>
      <List disablePadding>
        {notifications.map((n) => (
          <ListItem key={n.id} className={classes.notificationListItem}>
            <MarketingRulePassNotificationItem
              emailSummariesById={emailSummariesById}
              notification={Immutable(n)}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => onNotificationPreviewOpen(n)}
              >
                <Tooltip title={t('notifications.viewPreview')}>
                  <RemoveRedEye color="primary" />
                </Tooltip>
              </IconButton>
              {!n.event_rules.contains_all_payment_packs &&
                !n.event_rules.contains_all_private_passes && (
                  <ObjectLevelPermissionWrapper
                    forcedBehavior="hidden"
                    requiredPermission="member.allowed_actions.manageNotification"
                  >
                    <IconButton
                      edge="end"
                      onClick={() => removeNotification(n)}
                    >
                      <Tooltip title={t('notifications.delete')}>
                        <DeleteIcon />
                      </Tooltip>
                    </IconButton>
                  </ObjectLevelPermissionWrapper>
                )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Grid>
  );
};

type Props = {
  notifications: MarketingNotification[];
  notificationsLoading?: boolean;
  removeNotification: (n: MarketingNotification) => void;
  emailSummariesById: Record<string, EmailTemplateSummary>;
  emailDetails: Record<string, EmailTemplateDetail>;
  emailDetailLoading: boolean;
  resolvedGenericTags: ResolvedGenericTags;
  getEmailDetail: (id: number) => void;
  theme: CompanyTheme;
  smartListsById: Record<string, SmartList>;
  smartListsLoading: boolean;
};

const PassNotifications = ({
  removeNotification,
  notifications,
  emailSummariesById,
  emailDetails,
  emailDetailLoading,
  resolvedGenericTags,
  getEmailDetail,
  theme,
  smartListsById,
  smartListsLoading,
  notificationsLoading,
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['paymentPack', 'marketing']);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = React.useState(false);
  const [selectedNotification, setSelectedNotification] =
    React.useState<MarketingNotification>(null);

  const onNotificationPreviewOpen = useCallback((n: MarketingNotification) => {
    setSelectedNotification(n);
    setIsPreviewModalOpen(true);
  }, []);
  const onPreviewClose = useCallback(() => {
    setSelectedNotification(null);
    setIsPreviewModalOpen(false);
  }, []);

  const {
    remainingCreditNotifications,
    remainingValidityNotifications,
    expiredValidityNotifications,
  } = useMemo(
    () => splitPassNotificationsByTrigger(notifications ?? []),
    [notifications],
  );

  if (notificationsLoading) {
    return (
      <div className={classes.loading}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      {notifications.length > 0 && (
        <Paper className={classes.paper}>
          {remainingCreditNotifications.length > 0 && (
            <NotificationList
              emailSummariesById={emailSummariesById}
              notifications={remainingCreditNotifications}
              onNotificationPreviewOpen={onNotificationPreviewOpen}
              removeNotification={removeNotification}
              title={t(
                'marketing:notifications.notificationTitle.remainingCredit',
              )}
            />
          )}
          {remainingValidityNotifications.length > 0 && (
            <NotificationList
              emailSummariesById={emailSummariesById}
              notifications={remainingValidityNotifications}
              onNotificationPreviewOpen={onNotificationPreviewOpen}
              removeNotification={removeNotification}
              title={t(
                'marketing:notifications.notificationTitle.remainingValidity',
              )}
            />
          )}

          {expiredValidityNotifications.length > 0 && (
            <NotificationList
              emailSummariesById={emailSummariesById}
              notifications={expiredValidityNotifications}
              onNotificationPreviewOpen={onNotificationPreviewOpen}
              removeNotification={removeNotification}
              title={t(
                'marketing:notifications.notificationTitle.expiredValidity',
              )}
            />
          )}
        </Paper>
      )}
      {isPreviewModalOpen && (
        <PreviewModal
          emailDetailLoading={emailDetailLoading}
          emailDetails={emailDetails}
          emailSummariesById={emailSummariesById}
          getEmailDetail={getEmailDetail}
          notification={selectedNotification}
          onClose={onPreviewClose}
          resolvedGenericTags={resolvedGenericTags}
          smartListsById={smartListsById}
          smartListsLoading={smartListsLoading}
          theme={theme}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  sectionTitle: {
    fontWeight: 500,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    gap: theme.spacing(2),
  },
  notificationListItem: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    paddingLeft: 0,
    paddingTop: theme.spacing(1),
    paddingRight: 0,
    paddingBottom: theme.spacing(2),
    gap: theme.spacing(1),
  },
}));

export default React.memo(PassNotifications);
