import React, { useEffect, useMemo, useState } from 'react';

import {
  Button,
  ButtonBase,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  type Theme,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  Email,
  ExpandLess,
  ExpandMore,
  NotificationsActive,
  SupervisorAccount,
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { CustomChip } from '#src/components/chip/CustomChip.component';
import type { SmartList } from '#src/libs/smart-list/types';
import type { MarketingNotification } from '../types';
import type {
  EmailTemplateSummary,
  EmailTemplateDetail,
  ResolvedGenericTags,
} from '#src/libs/email-editor/types';
import type { CompanyTheme } from '#src/libs/theme/types';
import NotificationPushPreview from '#src/components/notification-push/NotificationPushPreview.component';
import EmailPreview from '#src/components/html/EmailPreview.component';

type SendMethodPreviewWrapperProps = {
  title: string;
  onClick: () => void;
  icon: React.ReactNode;
  isOpen: boolean;
  children: React.ReactNode;
  shouldCollapse: boolean;
};

const SendMethodPreviewWrapper: React.FC<SendMethodPreviewWrapperProps> = ({
  title,
  onClick,
  icon,
  isOpen,
  children,
  shouldCollapse,
}) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.notificationSendContainer}>
      <div className={classes.previewTitleOuter}>
        <ButtonBase
          className={classes.previewTitleInner}
          disabled={!shouldCollapse}
          onClick={onClick}
        >
          <Grid container className={classes.titleWithIcon}>
            {icon}
            <Typography color="textPrimary" variant="subtitle1">
              {title}
            </Typography>
          </Grid>
          {shouldCollapse && (isOpen ? <ExpandLess /> : <ExpandMore />)}
        </ButtonBase>
      </div>
      <Collapse
        className={classes.sendMethodCollapse}
        in={!shouldCollapse || isOpen}
      >
        {children}
      </Collapse>
    </Grid>
  );
};

type SmartListPreviewProps = {
  smartListsById: Record<number, SmartList>;
  smartListsLoading: boolean;
  smartListInclude: number[];
  smartListExclude: number[];
};

const SmartListPreview: React.FC<SmartListPreviewProps> = (
  props: SmartListPreviewProps,
) => {
  const {
    smartListsById,
    smartListsLoading,
    smartListInclude,
    smartListExclude,
  } = props;
  const { t } = useTranslation('marketing');
  const classes = useStyles();

  const includeSmartLists = useMemo(
    () => smartListInclude.map((id) => smartListsById[id]),
    [smartListInclude, smartListsById],
  );
  const excludeSmartLists = useMemo(
    () => smartListExclude.map((id) => smartListsById[id]),
    [smartListExclude, smartListsById],
  );

  if (smartListsLoading) {
    return <CircularProgress />;
  }

  return (
    <Grid container className={classes.smartListSection} direction="column">
      {includeSmartLists.length > 0 && (
        <Grid
          container
          className={classes.smartListSubsection}
          direction="column"
        >
          <Typography className={classes.smartListSubtitle} variant="subtitle2">
            {t('notifications.included')}
          </Typography>
          <Grid container className={classes.smartListChips}>
            {includeSmartLists.map((smartList) => (
              <CustomChip
                key={smartList.id}
                blackText
                displayedValue={smartList.name}
              />
            ))}
          </Grid>
        </Grid>
      )}
      {excludeSmartLists.length > 0 && (
        <Grid
          container
          className={classes.smartListSubsection}
          direction="column"
        >
          <Typography className={classes.smartListSubtitle} variant="subtitle2">
            {t('notifications.excluded')}
          </Typography>
          <Grid container className={classes.smartListChips}>
            {excludeSmartLists.map((smartList) => (
              <CustomChip
                key={smartList.id}
                blackText
                displayedValue={smartList.name}
              />
            ))}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

type PreviewModalProps = {
  onClose: () => void;
  notification: MarketingNotification;
  emailDetails: Record<string, EmailTemplateDetail>;
  emailDetailLoading: boolean;
  emailSummariesById: Record<string, EmailTemplateSummary>;
  smartListsById: Record<string, SmartList>;
  smartListsLoading: boolean;
  resolvedGenericTags: ResolvedGenericTags;
  getEmailDetail: (id: number) => void;
  theme: CompanyTheme;
};

export const PreviewModal: React.FC<PreviewModalProps> = ({
  onClose,
  notification,
  emailDetails,
  emailDetailLoading,
  emailSummariesById,
  smartListsById,
  smartListsLoading,
  resolvedGenericTags,
  getEmailDetail,
  theme,
}: PreviewModalProps) => {
  const {
    email_design,
    event_rules: { name, smartlist_include, smartlist_exclude },
    push_notification_title,
  } = notification;

  const { t } = useTranslation('marketing');
  const classes = useStyles();
  const [emailPreviewOpen, setEmailPreviewOpen] = useState(false);
  const [pushPreviewOpen, setPushPreviewOpen] = useState(false);
  const [smartListPreviewOpen, setSmartListPreviewOpen] = useState(false);

  useEffect(() => {
    if (email_design) {
      getEmailDetail(email_design);
    }
  }, [email_design, getEmailDetail]);

  const emailDetail = useMemo(
    () => email_design && emailDetails && emailDetails[email_design.toString()],
    [email_design, emailDetails],
  );
  const emailSummary = useMemo(
    () =>
      email_design &&
      emailSummariesById &&
      emailSummariesById[email_design.toString()],
    [email_design, emailSummariesById],
  );

  const hasEmailDesign = !(email_design == null);
  const hasPushNotification = push_notification_title !== '';
  const hasSmartList =
    smartlist_include.length > 0 || smartlist_exclude.length > 0;

  const shouldCollapse =
    (hasEmailDesign && hasPushNotification) ||
    (hasPushNotification && hasSmartList) ||
    (hasEmailDesign && hasSmartList);

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{`${t('notifications.preview')} ${name}`}</DialogTitle>
      <DialogContent className={classes.previewDialogContent}>
        {((smartlist_include && smartlist_include.length > 0) ||
          (smartlist_exclude && smartlist_exclude.length > 0)) && (
          <SendMethodPreviewWrapper
            icon={<SupervisorAccount />}
            isOpen={smartListPreviewOpen}
            onClick={() => setSmartListPreviewOpen(!smartListPreviewOpen)}
            shouldCollapse={shouldCollapse}
            title={`${t('marketing:notifications.smartListTitle')}`}
          >
            <SmartListPreview
              smartListExclude={smartlist_exclude}
              smartListInclude={smartlist_include}
              smartListsById={smartListsById}
              smartListsLoading={smartListsLoading}
            />
          </SendMethodPreviewWrapper>
        )}
        {push_notification_title && (
          <SendMethodPreviewWrapper
            icon={<NotificationsActive />}
            isOpen={pushPreviewOpen}
            onClick={() => setPushPreviewOpen(!pushPreviewOpen)}
            shouldCollapse={shouldCollapse}
            title={`${t('notifications.pushNotificationTitle')}`}
          >
            <NotificationPushPreview
              notification={notification}
              resolvedGenericTags={resolvedGenericTags}
              theme={theme}
            />
          </SendMethodPreviewWrapper>
        )}
        {emailDetail && (
          <SendMethodPreviewWrapper
            icon={<Email />}
            isOpen={emailPreviewOpen}
            onClick={() => setEmailPreviewOpen(!emailPreviewOpen)}
            shouldCollapse={shouldCollapse}
            title={`${t('marketing:notifications.mailTitle')}: ${
              emailSummary.title
            }`}
          >
            <EmailPreview
              html={emailDetail.html}
              loading={emailDetailLoading}
              resolvedGenericTags={resolvedGenericTags}
            />
          </SendMethodPreviewWrapper>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  sendMethodCollapse: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  titleWithIcon: {
    gap: theme.spacing(1),
  },
  smartListSection: {
    gap: theme.spacing(2),
  },
  smartListSubsection: {
    gap: theme.spacing(1),
  },
  smartListSubtitle: {
    color: 'primary',
    width: '100%',
  },
  smartListChips: {
    gap: theme.spacing(1),
  },
  previewTitleInner: {
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
    width: '100%',
  },
  notificationSendContainer: {
    gap: theme.spacing(2),
    flexDirection: 'column',
  },
  previewDialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    padding: 0,
  },
  previewTitleOuter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
}));
