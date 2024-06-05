import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
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
import CommunicationSMSCostReminderModal from '#src/libs/communication-v2/CommunicationSMSCostReminderModal.component';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import CommunicationMessageNumberRecipients from '../MessageList/SingleMessage/CommunicationMessageNumberRecipients.component';
import Config from '../../../../config';

type Props = {
  actionType: number;
  directMember: Member;
  fullScreen?: boolean;
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
  contextIdentifier?: number;
  openResendConfigDialog?: () => void;
};

const BottomBarIcons: React.FC<Props> = ({
  actionType,
  directMember,
  fullScreen,
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
  contextIdentifier,
  openResendConfigDialog,
}) => {
  const { t } = useTranslation('communication');
  const classes = useStyles();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuBalisesAnchorEl, setMenuBalisesAnchorEl] = useState(null);
  const [isSmsCostReminderModalOpen, setIsSmsCostReminderModalOpen] =
    useState(false);
  const handleCloseMenu = () => setMenuAnchorEl(null);
  const handleCloseMenuBalises = () => setMenuBalisesAnchorEl(null);
  const handleCostReminderModalOnClose = React.useCallback(
    () => setIsSmsCostReminderModalOpen(false),
    [],
  );
  const handleCostReminderModalOpen = React.useCallback(
    () => setIsSmsCostReminderModalOpen(true),
    [],
  );
  const handleSendSmsOnClick = React.useCallback(() => {
    sendMessage();
    setIsSmsCostReminderModalOpen(false);
  }, [sendMessage]);

  return (
    <ObjectLevelPermissionProvider requiredPermission="member.allowed_actions.communication">
      {(hasCommunicationPermission: boolean) => (
        <Toolbar className={classes.bottomActionsContainer}>
          <div className={classes.bottomFlexContainer}>
            <Tooltip placement="top" title={t('sendMessage.icons.mail')}>
              <IconButton
                className={classes.iconButton}
                color={actionType === WRITE_EMAIL ? 'primary' : 'default'}
                onClick={() => setActionType(WRITE_EMAIL)}
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
                  <Tooltip placement="top" title={t('sendMessage.icons.sms')}>
                    <IconButton
                      className={classes.iconButton}
                      color={actionType === WRITE_SMS ? 'primary' : 'default'}
                      disabled={!hasUpsell(featureList, UPSELL_IDENTIFIER_SMS)}
                      onClick={() => setActionType(WRITE_SMS)}
                    >
                      {actionType === WRITE_SMS ? (
                        <SmsIcon />
                      ) : (
                        <SmsOutlinedIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                  <CommunicationSMSCostReminderModal
                    handleClose={handleCostReminderModalOnClose}
                    open={isSmsCostReminderModalOpen}
                    sendMessageOnClick={handleSendSmsOnClick}
                  />
                </>
              )}
            </FeatureListProvider>
            <FeatureListProvider>
              {(featureList: FeatureList) => (
                <Tooltip
                  placement="top"
                  title={t('sendMessage.icons.notification')}
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
                    onClick={() => setActionType(WRITE_PUSH_NOTIFICATION)}
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
                  title={t('sendMessage.icons.template')}
                >
                  <IconButton onClick={handleSelectTemplate}>
                    <TemplateIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip placement="top" title={t('sendMessage.icons.balise')}>
                <IconButton
                  onClick={(event) =>
                    setMenuBalisesAnchorEl(event.currentTarget)
                  }
                >
                  <BaliseIcon />
                </IconButton>
              </Tooltip>

              {contextIdentifier === CONTEXT_SMARTLIST &&
                actionType === WRITE_EMAIL &&
                openResendConfigDialog && (
                  <Tooltip
                    placement="top"
                    title={t('sendMessage.icons.autoResend')}
                  >
                    <IconButton onClick={openResendConfigDialog}>
                      <RepeatIcon />
                    </IconButton>
                  </Tooltip>
                )}

              <NestedList
                forTagsSelector
                anchorElMenu={menuBalisesAnchorEl}
                dataRecord={tags}
                handleCloseMenu={handleCloseMenuBalises}
                onItemClick={onBaliseItemClick}
              />
            </Hidden>
            <Hidden smUp>
              <IconButton
                className={classes.iconButton}
                onClick={(event) => setMenuAnchorEl(event.currentTarget)}
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
                  onClick={(event) =>
                    setMenuBalisesAnchorEl(event.currentTarget)
                  }
                >
                  <BaliseIcon className={classes.mobileIcon} />
                  <Typography variant="caption">
                    {t('sendMessage.icons.balise')}
                  </Typography>
                </MenuItem>

                {contextIdentifier === CONTEXT_SMARTLIST &&
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
                  anchorElMenu={menuBalisesAnchorEl}
                  dataRecord={tags}
                  handleCloseMenu={handleCloseMenuBalises}
                  onItemClick={onBaliseItemClick}
                />
              </Menu>
            </Hidden>
          </div>
          <div className={classes.bottomFlexContainer}>
            {!directMember && (
              <ButtonBase
                className={classNames(
                  classes.bottomRecipientSelector,
                  classes.bottomFlexContainer,
                )}
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
            {validity === CAN_SEND_MESSAGE && hasCommunicationPermission ? (
              <Button
                color="primary"
                onClick={
                  actionType === WRITE_SMS &&
                  contextIdentifier !== CONTEXT_MEMBER
                    ? handleCostReminderModalOpen
                    : sendMessage
                }
                variant="contained"
              >
                <Hidden xsDown>
                  <p className={classes.buttonSendText}>
                    {t('sendMessage.buttons.send')}
                  </p>
                </Hidden>
                <SendIcon fontSize="small" />
              </Button>
            ) : (
              <Tooltip title={getValidityTooltipMessage(validity, t)}>
                <span id="need-this-span-to-display-tooltip-with-disabled-button">
                  <Button disabled color="primary" variant="contained">
                    <Hidden xsDown>
                      <p className={classes.buttonSendText}>
                        {t('sendMessage.buttons.send')}
                      </p>
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
}));

export default memo(BottomBarIcons);
