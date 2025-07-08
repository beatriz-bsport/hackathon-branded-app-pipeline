import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Theme, makeStyles } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
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
  RemoveCircle as RemoveCircleIcon,
  Repeat as RepeatIcon,
} from '@material-ui/icons';

// @ts-expect-error
import FeatureListProvider from '#src/libs/company/hocs/feature-list-provider.hoc';

import NestedList from '#src/components/NestedMenu.component';

import type { FeatureList } from '#src/libs/company/types';

import { getValidityTooltipMessage } from '#src/libs/communication-v2/utils';
import {
  WRITE_EMAIL,
  WRITE_SMS,
  WRITE_PUSH_NOTIFICATION,
  CAN_SEND_MESSAGE,
} from '#src/libs/communication-v2/constants';
import {
  UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
  UPSELL_IDENTIFIER_SMS,
} from '#src/libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#src/libs/platform-billing/utils';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import Config from '#src/config';
import { useCommunicationContext } from '#src/libs/communication-v2/context/CommunicationDrawer.context';
import {
  useSMSVerification,
  useTheme,
} from '#src/libs/communication-v2/hooks/useCommunicationsTools.hooks';
import { CommunicationWarningModal } from '../WarningModal/CommunicationWarningModal.component';

type Props = {
  actionType: number;
  handleSelectTemplate: () => void;
  onBaliseItemClick: (item: string) => void;
  sendMessage: () => void;
  setActionType: (actionType: number) => void;
  tags: Record<string, Array<string>>;
  validity: number;
  openAutomatedCampaignLimitModal: () => void;
  openResendConfigDialog?: () => void;
};

const AutomatedCampaignSetterBottomBar: React.FC<Props> = ({
  actionType,
  handleSelectTemplate,
  onBaliseItemClick,
  sendMessage,
  setActionType,
  tags,
  validity,
  openAutomatedCampaignLimitModal,
  openResendConfigDialog,
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<Element | undefined>(
    undefined,
  );
  const [tagsMenuAnchorEl, setTagsMenuAnchorEl] = useState<Element | undefined>(
    undefined,
  );
  const [shouldDisplaySmsWarningModal, setShouldDisplaySmsWarningModal] =
    useState(false);
  const { automatedCommunicationDraft, usedAutoCampaignCommMethods } =
    useCommunicationContext();
  const { smsVerificationProvider } = useSMSVerification();
  const { isAutoResendHidden } = useTheme();
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

  const handleCostReminderModalOnClose = useCallback(
    () => setShouldDisplaySmsWarningModal(false),
    [],
  );
  const handleCostReminderModalOpen = useCallback(
    () => setShouldDisplaySmsWarningModal(true),
    [],
  );

  const handleSendSmsOnClick = useCallback(() => {
    sendMessage();
    setShouldDisplaySmsWarningModal(false);
  }, [sendMessage]);

  const setCommunicationTypeToMail = useCallback(() => {
    setActionType(WRITE_EMAIL);
  }, [setActionType]);

  const setCommunicationTypeToSMS = useCallback(() => {
    setActionType(WRITE_SMS);
  }, [setActionType]);

  const setCommunicationTypeToPushNotification = useCallback(() => {
    setActionType(WRITE_PUSH_NOTIFICATION);
  }, [setActionType]);

  const getIsEmailDisabled = useCallback(() => {
    return (
      usedAutoCampaignCommMethods.includes(WRITE_EMAIL) ||
      !!automatedCommunicationDraft
    );
  }, [automatedCommunicationDraft, usedAutoCampaignCommMethods]);

  const getIsSMSDisabled = useCallback(
    (featureList: FeatureList) => {
      return (
        !hasUpsell(featureList, UPSELL_IDENTIFIER_SMS) ||
        usedAutoCampaignCommMethods.includes(WRITE_SMS) ||
        !!automatedCommunicationDraft
      );
    },
    [automatedCommunicationDraft, usedAutoCampaignCommMethods],
  );

  const getIsPushNotificationDisabled = useCallback(
    (featureList: FeatureList) => {
      return (
        (Config.REACT_APP_SENTRY_ENVIRONMENT === 'production' &&
          !hasUpsell(featureList, UPSELL_IDENTIFIER_PUSH_NOTIFICATION)) ||
        usedAutoCampaignCommMethods.includes(WRITE_PUSH_NOTIFICATION) ||
        !!automatedCommunicationDraft
      );
    },
    [automatedCommunicationDraft, usedAutoCampaignCommMethods],
  );

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
                disabled={getIsEmailDisabled()}
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
                      disabled={getIsSMSDisabled(featureList)}
                      onClick={setCommunicationTypeToSMS}
                    >
                      {actionType === WRITE_SMS ? (
                        <SmsIcon />
                      ) : (
                        <SmsOutlinedIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                  {shouldDisplaySmsWarningModal ? (
                    <CommunicationWarningModal
                      handleClose={handleCostReminderModalOnClose}
                      sendMessageOnClick={handleSendSmsOnClick}
                      smsWarning={shouldDisplaySmsWarningModal}
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
                    disabled={getIsPushNotificationDisabled(featureList)}
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
              <Tooltip
                placement="top"
                title={
                  t('sendMessage.icons.automaticCommunicationLimit') as string
                }
              >
                <IconButton onClick={openAutomatedCampaignLimitModal}>
                  <RemoveCircleIcon />
                </IconButton>
              </Tooltip>
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
            {validity &&
            validity === CAN_SEND_MESSAGE &&
            hasCommunicationPermission ? (
              <Button
                color="primary"
                disabled={
                  actionType == WRITE_SMS && !smsVerificationProvider.isVerified
                }
                onClick={
                  actionType === WRITE_SMS
                    ? handleCostReminderModalOpen
                    : sendMessage
                }
                variant="contained"
              >
                <Hidden xsDown>
                  <p className={classes.buttonSendText}>
                    {t('common.confirm')}
                  </p>
                </Hidden>
              </Button>
            ) : (
              <Tooltip title={getValidityTooltipMessage(validity, t)}>
                <span id="need-this-span-to-display-tooltip-with-disabled-button">
                  <Button disabled color="primary" variant="contained">
                    <Hidden xsDown>
                      <p className={classes.buttonSendText}>
                        {t('common.confirm')}
                      </p>
                    </Hidden>
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

export default React.memo(AutomatedCampaignSetterBottomBar);
