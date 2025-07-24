import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Theme, makeStyles } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import {
  Mail as MailIcon,
  MailOutlined as MailOutlinedIcon,
  Notifications as NotificationIcon,
  NotificationsNone as NotificationOutlinedIcon,
  Sms as SmsIcon,
  SmsOutlined as SmsOutlinedIcon,
  MoreVert as MenuIcon,
  LibraryBooks as TemplateIcon,
  SettingsEthernet as BaliseIcon,
  Send as SendIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
} from '@material-ui/icons';
import RepeatIcon from '@material-ui/icons/Repeat';

// @ts-expect-error
import FeatureListProvider from '#src/libs/company/hocs/feature-list-provider.hoc';

import NestedList from '#src/components/NestedMenu.component';

import { Member, MemberMinimal } from '#src/libs/member/types';
import { FeatureList } from '#src/libs/company/types';

import { getValidityTooltipMessage } from '#src/libs/communication-v2/utils';
import {
  WRITE_EMAIL,
  WRITE_SMS,
  WRITE_PUSH_NOTIFICATION,
  CAN_SEND_MESSAGE,
  MAX_DISPLAY,
  CONTEXT_SMARTLIST,
  CONTEXT_MEMBER,
} from '#src/libs/communication-v2/constants';
import {
  UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
  UPSELL_IDENTIFIER_SMS,
} from '#src/libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#src/libs/platform-billing/utils';
import CommunicationWarningModal from './WarningModal/CommunicationWarningModal.component';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import CommunicationMessageNumberRecipients from '#src/libs/communication-v2/components/MessageList/SingleMessage/CommunicationMessageNumberRecipients.component';
import Config from '#src/config';
import { useCommunicationContext } from '#src/libs/communication-v2/context/CommunicationDrawer.context';
import {
  useSMSVerification,
  useTheme,
} from '#src/libs/communication-v2/hooks/useCommunicationsTools.hooks';

type Props = {
  actionType: number;
  directMember?: Member;
  handleSelectTemplate: () => void;
  handleSelectRecipients: () => void;
  memberList: MemberMinimal[];
  memberListLoading: boolean;
  onBaliseItemClick: (item: string) => void;
  selectedRecipientsCount: number;
  sendMessage: () => void;
  setActionType: (actionType: number) => void;
  tags: Record<string, Array<string>>;
  validity: number;
  communicationIdentifier?: number;
  openResendConfigDialog?: () => void;
  openMessageSchedulingModal?: () => void;
  isMessageSchedulingOpen?: boolean;
  isInboxContext: boolean;
  hasRecipientsListLoaded?: boolean;
};

const BottomBarIcons: React.FC<Props> = ({
  actionType,
  directMember,
  handleSelectTemplate,
  handleSelectRecipients,
  memberList,
  memberListLoading,
  onBaliseItemClick,
  selectedRecipientsCount,
  sendMessage,
  setActionType,
  tags,
  validity,
  communicationIdentifier,
  openResendConfigDialog,
  openMessageSchedulingModal,
  isMessageSchedulingOpen,
  isInboxContext,
  hasRecipientsListLoaded,
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<Element | undefined>(
    undefined,
  );
  const [tagsMenuAnchorEl, setTagsMenuAnchorEl] = useState<Element | undefined>(
    undefined,
  );
  const [shouldDisplaySmsCostWarning, setShouldDisplaySmsCostWarning] =
    useState(false);
  const [shouldDisplayRecipientsWarning, setShouldDisplayRecipientsWarning] =
    useState(false);
  const { fullScreen, scheduledCommunicationDraft } = useCommunicationContext();
  const { isAutoResendHidden } = useTheme();
  const { smsVerificationProvider } = useSMSVerification();
  const { t } = useTranslation('communication');
  const classes = useStyles();

  const handleOpenMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setMenuAnchorEl(undefined);
  }, []);

  const handleOpenTagsMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setTagsMenuAnchorEl(event.currentTarget);
    },
    [],
  );

  const handleCloseTagsMenu = useCallback(() => {
    setTagsMenuAnchorEl(undefined);
  }, []);

  const handleHideSmsWarning = useCallback(
    () => setShouldDisplaySmsCostWarning(false),
    [],
  );

  const handleDisplaySmsWarning = useCallback(
    () => setShouldDisplaySmsCostWarning(true),
    [],
  );

  const handleHideRecipientsWarning = useCallback(
    () => setShouldDisplayRecipientsWarning(false),
    [],
  );

  const handleDisplayRecipientsWarning = useCallback(
    () => setShouldDisplayRecipientsWarning(true),
    [],
  );

  const handleSendCommunication = useCallback(() => {
    const shouldShowSmsWarning =
      communicationIdentifier !== CONTEXT_MEMBER && actionType === WRITE_SMS;
    const shouldShowRecipientsWarning =
      communicationIdentifier === CONTEXT_SMARTLIST &&
      !hasRecipientsListLoaded &&
      !scheduledCommunicationDraft;
    if (!shouldShowSmsWarning && !shouldShowRecipientsWarning) {
      sendMessage();
    }
    if (shouldShowSmsWarning) {
      handleDisplaySmsWarning();
    }
    if (shouldShowRecipientsWarning) {
      handleDisplayRecipientsWarning();
    }
  }, [
    hasRecipientsListLoaded,
    sendMessage,
    actionType,
    communicationIdentifier,
    handleDisplaySmsWarning,
    handleDisplayRecipientsWarning,
    scheduledCommunicationDraft,
  ]);

  const handleCloseCommunicationWarningModal = useCallback(() => {
    if (shouldDisplaySmsCostWarning) {
      handleHideSmsWarning();
    }
    if (shouldDisplayRecipientsWarning) {
      handleHideRecipientsWarning();
    }
  }, [
    shouldDisplaySmsCostWarning,
    shouldDisplayRecipientsWarning,
    handleHideSmsWarning,
    handleHideRecipientsWarning,
  ]);

  const handleValidateSendCommunication = useCallback(() => {
    sendMessage();
    handleCloseCommunicationWarningModal();
  }, [sendMessage, handleCloseCommunicationWarningModal]);

  const setCommunicationTypeToMail = useCallback(() => {
    setActionType(WRITE_EMAIL);
  }, [setActionType]);

  const setCommunicationTypeToSMS = useCallback(() => {
    setActionType(WRITE_SMS);
  }, [setActionType]);

  const setCommunicationTypeToPushNotification = useCallback(() => {
    setActionType(WRITE_PUSH_NOTIFICATION);
  }, [setActionType]);

  const sendButtonText = useMemo(() => {
    if (scheduledCommunicationDraft && isMessageSchedulingOpen) {
      return t('sendMessage.buttons.updateScheduled');
    }
    if (isMessageSchedulingOpen) {
      return t('sendMessage.buttons.scheduleCommunication');
    }
    return t('sendMessage.buttons.send');
  }, [scheduledCommunicationDraft, isMessageSchedulingOpen, t]);

  const isRecipientSelectorDisabled =
    isMessageSchedulingOpen || !!scheduledCommunicationDraft;

  return (
    <ObjectLevelPermissionProvider requiredPermission="member.allowed_actions.communication">
      {(hasCommunicationPermission: boolean) => (
        <Toolbar className={classes.bottomActionsContainer}>
          <div className={classes.bottomFlexContainer}>
            <Tooltip
              placement="top"
              title={t('sendMessage.icons.mail') as string}
            >
              <IconButton
                className={classes.iconButton}
                color={actionType === WRITE_EMAIL ? 'primary' : 'default'}
                onClick={setCommunicationTypeToMail}
              >
                {actionType === WRITE_EMAIL ? (
                  <MailIcon />
                ) : (
                  <MailOutlinedIcon />
                )}
              </IconButton>
            </Tooltip>
            <FeatureListProvider>
              {(featureList: FeatureList) => (
                <>
                  <Tooltip
                    placement="top"
                    title={t('sendMessage.icons.sms') as string}
                  >
                    <IconButton
                      className={classes.iconButton}
                      color={actionType === WRITE_SMS ? 'primary' : 'default'}
                      disabled={!hasUpsell(featureList, UPSELL_IDENTIFIER_SMS)}
                      onClick={setCommunicationTypeToSMS}
                    >
                      {actionType === WRITE_SMS ? (
                        <SmsIcon />
                      ) : (
                        <SmsOutlinedIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                  {shouldDisplaySmsCostWarning ||
                  shouldDisplayRecipientsWarning ? (
                    <CommunicationWarningModal
                      handleClose={handleCloseCommunicationWarningModal}
                      isEditingScheduledCommunication={
                        !!scheduledCommunicationDraft && isMessageSchedulingOpen
                      }
                      recipientsPreviewWarning={shouldDisplayRecipientsWarning}
                      sendMessageOnClick={handleValidateSendCommunication}
                      smsWarning={shouldDisplaySmsCostWarning}
                    />
                  ) : null}
                </>
              )}
            </FeatureListProvider>
            <FeatureListProvider>
              {(featureList: FeatureList) => (
                <Tooltip
                  placement="top"
                  title={t('sendMessage.icons.notification') as string}
                >
                  <IconButton
                    className={classes.iconButton}
                    color={
                      actionType === WRITE_PUSH_NOTIFICATION
                        ? 'primary'
                        : 'default'
                    }
                    disabled={
                      Config.REACT_APP_SENTRY_ENVIRONMENT === 'production' &&
                      !hasUpsell(
                        featureList,
                        UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
                      )
                    }
                    onClick={setCommunicationTypeToPushNotification}
                  >
                    {actionType === WRITE_PUSH_NOTIFICATION ? (
                      <NotificationIcon />
                    ) : (
                      <NotificationOutlinedIcon />
                    )}
                  </IconButton>
                </Tooltip>
              )}
            </FeatureListProvider>
            <Hidden xsDown>
              <Divider
                flexItem
                className={classes.divider}
                orientation="vertical"
              />
              {actionType === WRITE_EMAIL && (
                <Tooltip
                  placement="top"
                  title={t('sendMessage.icons.template') as string}
                >
                  <IconButton onClick={handleSelectTemplate}>
                    <TemplateIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip
                placement="top"
                title={t('sendMessage.icons.balise') as string}
              >
                <IconButton onClick={handleOpenTagsMenu}>
                  <BaliseIcon />
                </IconButton>
              </Tooltip>
              {!isAutoResendHidden &&
                communicationIdentifier === CONTEXT_SMARTLIST &&
                actionType === WRITE_EMAIL &&
                openResendConfigDialog && (
                  <Tooltip
                    placement="top"
                    title={t('sendMessage.icons.autoResend') as string}
                  >
                    <IconButton onClick={openResendConfigDialog}>
                      <RepeatIcon />
                    </IconButton>
                  </Tooltip>
                )}

              {communicationIdentifier === CONTEXT_SMARTLIST &&
                !isInboxContext &&
                openMessageSchedulingModal && (
                  <Tooltip
                    placement="top"
                    title={t('sendMessage.icons.messageScheduling') as string}
                  >
                    <IconButton onClick={openMessageSchedulingModal}>
                      <ScheduleIcon />
                    </IconButton>
                  </Tooltip>
                )}
              <NestedList
                forTagsSelector
                anchorElMenu={tagsMenuAnchorEl}
                dataRecord={tags}
                handleCloseMenu={handleCloseTagsMenu}
                onItemClick={onBaliseItemClick}
              />
            </Hidden>
            <Hidden smUp>
              <IconButton
                className={classes.iconButton}
                onClick={handleOpenMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                keepMounted
                anchorEl={menuAnchorEl}
                id="simple-menu"
                MenuListProps={{
                  disablePadding: true,
                }}
                onClose={handleCloseMenu}
                open={Boolean(menuAnchorEl)}
              >
                {actionType === WRITE_EMAIL && (
                  <MenuItem
                    className={classes.mobileMenuItem}
                    onClick={handleSelectTemplate}
                  >
                    <TemplateIcon className={classes.mobileIcon} />
                    <Typography variant="caption">
                      {t('sendMessage.icons.template')}
                    </Typography>
                  </MenuItem>
                )}
                <MenuItem
                  className={classes.mobileMenuItem}
                  onClick={handleOpenTagsMenu}
                >
                  <BaliseIcon className={classes.mobileIcon} />
                  <Typography variant="caption">
                    {t('sendMessage.icons.balise')}
                  </Typography>
                </MenuItem>

                {!isAutoResendHidden &&
                  communicationIdentifier === CONTEXT_SMARTLIST &&
                  actionType === WRITE_EMAIL &&
                  openResendConfigDialog && (
                    <MenuItem
                      className={classes.mobileMenuItem}
                      onClick={openResendConfigDialog}
                    >
                      <RepeatIcon className={classes.mobileIcon} />
                      <Typography variant="caption">
                        {t('sendMessage.icons.autoResend')}
                      </Typography>
                    </MenuItem>
                  )}

                <NestedList
                  forTagsSelector
                  anchorElMenu={tagsMenuAnchorEl}
                  dataRecord={tags}
                  handleCloseMenu={handleCloseTagsMenu}
                  onItemClick={onBaliseItemClick}
                />
              </Menu>
            </Hidden>
          </div>
          <div className={classes.bottomFlexContainer}>
            {!directMember && (
              <ButtonBase
                className={clsx(
                  classes.bottomRecipientSelector,
                  classes.bottomFlexContainer,
                  {
                    [classes.disabledButton]: isRecipientSelectorDisabled,
                  },
                )}
                disabled={isRecipientSelectorDisabled}
                disableTouchRipple={isRecipientSelectorDisabled}
                onClick={handleSelectRecipients}
              >
                {selectedRecipientsCount ? (
                  <CommunicationMessageNumberRecipients
                    compactText
                    compactAvatars={fullScreen}
                    loading={memberListLoading}
                    members={
                      memberList?.slice(
                        0,
                        Math.min(MAX_DISPLAY, memberList.length),
                      ) ?? []
                    }
                    numberRecipients={selectedRecipientsCount}
                  />
                ) : (
                  <>
                    <PeopleIcon
                      className={classes.bottomRecipientSelectorIcon}
                    />
                    <Typography
                      className={classes.bottomRecipientSelectorText}
                      variant="caption"
                    >
                      <Hidden xsDown>
                        {t('sendMessage.buttons.selectRecipients')}
                      </Hidden>
                      <Hidden smUp>
                        {t('sendMessage.buttons.selectRecipientsMobile')}
                      </Hidden>
                    </Typography>
                  </>
                )}
              </ButtonBase>
            )}
            {validity &&
            validity === CAN_SEND_MESSAGE &&
            hasCommunicationPermission ? (
              <Button
                color="primary"
                disabled={
                  actionType == WRITE_SMS && !smsVerificationProvider.isVerified
                }
                onClick={handleSendCommunication}
                variant="contained"
              >
                <Hidden xsDown>
                  <p className={classes.buttonSendText}>{sendButtonText}</p>
                </Hidden>
                <SendIcon fontSize="small" />
              </Button>
            ) : (
              <Tooltip title={getValidityTooltipMessage(validity, t)}>
                <span id="need-this-span-to-display-tooltip-with-disabled-button">
                  <Button disabled color="primary" variant="contained">
                    <Hidden xsDown>
                      <p className={classes.buttonSendText}>{sendButtonText}</p>
                    </Hidden>
                    <SendIcon fontSize="small" />
                  </Button>
                </span>
              </Tooltip>
            )}
          </div>
        </Toolbar>
      )}
    </ObjectLevelPermissionProvider>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  bottomActionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      paddingRight: theme.spacing(1),
      paddingLeft: theme.spacing(1),
    },
  },
  bottomFlexContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomRecipientSelector: {
    borderRadius: theme.spacing(1),
    border: 'solid 1px',
    borderColor: theme.palette.grey[100],
    marginRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    [theme.breakpoints.down('xs')]: {
      marginRight: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  },
  bottomRecipientSelectorText: {
    color: theme.palette.text.secondary,
    width: 'min-content',
    lineHeight: 'normal',
    marginLeft: theme.spacing(1),
  },
  bottomRecipientSelectorIcon: {
    color: theme.palette.text.secondary,
  },
  buttonSendText: {
    padding: 0,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: theme.spacing(1),
  },
  divider: {
    margin: theme.spacing(1),
  },
  iconButton: {
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.5),
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1),
    },
  },
  mobileIcon: {
    marginRight: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  mobileMenuItem: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: '0.3',
    transition: 'opacity 0.3s',
  },
}));

export default React.memo(BottomBarIcons);
