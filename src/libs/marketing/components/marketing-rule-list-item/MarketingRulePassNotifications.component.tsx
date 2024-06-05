import React, { useCallback, useMemo } from 'react';
import Switch from '@material-ui/core/Switch';
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
import { NOTIFICATION_KIND } from '@bsport/common/lib/master-data/notification-rule-events';
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
import type { PaymentPack } from '#src/libs/payment-packs/types';
import type { PrivatePass } from '#src/libs/private-service/types';
import type { SmartList } from '#src/libs/smart-list/types';
import { splitPassNotificationsByTrigger } from '../../utils';
import { PreviewModal } from '../MarketingRulePreviewDialog.component';

type NotificationListProps = {
  title: string;
  passId: number;
  notifications: MarketingNotification[];
  updateNotification: (id: number, n: MarketingNotification) => void;
  emailSummariesById: Record<string, EmailTemplateSummary>;
  onNotificationPreviewOpen: (n: MarketingNotification) => void;
};

const NotificationList: React.FC<NotificationListProps> = ({
  title,
  passId,
  notifications,
  updateNotification,
  emailSummariesById,
  onNotificationPreviewOpen,
}: NotificationListProps) => {
  const classes = useStyles();
  const { t } = useTranslation('marketing');

  const switchNotificationStatus = useCallback(
    (notification: MarketingNotification) => {
      updateNotification(notification.id, {
        ...notification,
        active: !notification.active,
      });
    },
    [updateNotification],
  );

  const deletePassFromNotification = useCallback(
    (notification: MarketingNotification) => {
      let pass_ids_key: 'payment_pack_ids' | 'private_pass_ids';
      switch (notification.kind) {
        case NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_CREDIT:
        case NOTIFICATION_KIND.CONSUMER_PAYMENT_PACK_TIME:
          pass_ids_key = 'payment_pack_ids';
          break;
        case NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_CREDIT:
        case NOTIFICATION_KIND.PRIVATE_CONSUMER_PASS_TIME:
          pass_ids_key = 'private_pass_ids';
          break;
        default:
          return;
      }

      const pass_ids = notification.event_rules[pass_ids_key];

      updateNotification(notification.id, {
        ...notification,
        event_rules: {
          ...notification.event_rules,
          [pass_ids_key]: pass_ids.filter((id) => id !== passId),
        },
      });
    },
    [passId, updateNotification],
  );

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
            <ObjectLevelPermissionWrapper
              forcedBehavior="hidden"
              requiredPermission="member.allowed_actions.manageNotification"
            >
              <Switch
                checked={n.active}
                color="primary"
                edge="start"
                onClick={() => switchNotificationStatus(n)}
              />
            </ObjectLevelPermissionWrapper>
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
                      onClick={() => deletePassFromNotification(n)}
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
  pass: PaymentPack | PrivatePass;
  updateNotification: (id: number, data: any) => void;
  notifications: MarketingNotification[];
  notificationsLoading: boolean;
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
  pass,
  updateNotification,
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
    () => splitPassNotificationsByTrigger(notifications || []),
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
              passId={pass.id}
              title={t(
                'marketing:notifications.notificationTitle.remainingCredit',
              )}
              updateNotification={updateNotification}
            />
          )}
          {remainingValidityNotifications.length > 0 && (
            <NotificationList
              emailSummariesById={emailSummariesById}
              notifications={remainingValidityNotifications}
              onNotificationPreviewOpen={onNotificationPreviewOpen}
              passId={pass.id}
              title={t(
                'marketing:notifications.notificationTitle.remainingValidity',
              )}
              updateNotification={updateNotification}
            />
          )}

          {expiredValidityNotifications.length > 0 && (
            <NotificationList
              emailSummariesById={emailSummariesById}
              notifications={expiredValidityNotifications}
              onNotificationPreviewOpen={onNotificationPreviewOpen}
              passId={pass.id}
              title={t(
                'marketing:notifications.notificationTitle.expiredValidity',
              )}
              updateNotification={updateNotification}
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
