// @ts-nocheck
import React, { useState } from 'react';
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

// @ts-ignore
import FeatureListProvider from '#libs/company/hocs/feature-list-provider.hoc';
import Config from '../../../../config';

import NestedList from '#components/NestedMenu.component';
import CommunicationThreadNumberRecipients from '../Thread/SingleMessage/CommunicationThreadNumberRecipients.component';

import { Member, MemberMinimal } from '#libs/member/types';
import { FeatureList } from '#libs/company/types';

import { getValidityTooltipMessage } from '#libs/communication-v2/utils';
import {
  WRITE_EMAIL,
  WRITE_SMS,
  WRITE_PUSH_NOTIFICATION,
  CAN_SEND_MESSAGE,
  MAX_DISPLAY,
} from '#libs/communication-v2/constants';
import {
  UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
  UPSELL_IDENTIFIER_SMS,
} from '#libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#libs/platform-billing/utils';

type Props = {
  actionType: number;
  directMember: Member;
  fullScreen: boolean;
  handleSelectTemplate: () => void;
  handleSelectRecipients: () => void;
  memberList: MemberMinimal[];
  memberListLoading: boolean;
  onBaliseItemClick: (item: string) => void;
  selectedRecipientsCount: number;
  sendMessage: (data: any) => void;
  setActionType: (actionType: number) => void;
  tags: Record<string, Array<string>>;
  validity: number;
};

const BottomBarIcons = (props: Props) => {
  const {
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
  } = props;
  const { t } = useTranslation('communication');
  const classes = useStyles();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuBalisesAnchorEl, setMenuBalisesAnchorEl] = useState(null);
  const handleCloseMenu = () => setMenuAnchorEl(null);
  const handleCloseMenuBalises = () => setMenuBalisesAnchorEl(null);
  return (
    <Toolbar className={classes.bottomActionsContainer}>
      <div className={classes.bottomFlexContainer}>
        <Tooltip placement="top" title={t('sendMessage.icons.mail')}>
          <IconButton
            onClick={() => setActionType(WRITE_EMAIL)}
            color={actionType === WRITE_EMAIL ? 'primary' : 'default'}
            className={classes.iconButton}
          >
            {actionType === WRITE_EMAIL ? <MailIcon /> : <MailOutlinedIcon />}
          </IconButton>
        </Tooltip>
        <FeatureListProvider>
          {(featureList: FeatureList) => (
            <Tooltip placement="top" title={t('sendMessage.icons.sms')}>
              <IconButton
                onClick={() => setActionType(WRITE_SMS)}
                color={actionType === WRITE_SMS ? 'primary' : 'default'}
                className={classes.iconButton}
                disabled={
                  Config.REACT_APP_SENTRY_ENVIRONMENT === 'production' &&
                  !hasUpsell(featureList, UPSELL_IDENTIFIER_SMS)
                }
              >
                {actionType === WRITE_SMS ? <SmsIcon /> : <SmsOutlinedIcon />}
              </IconButton>
            </Tooltip>
          )}
        </FeatureListProvider>
        <FeatureListProvider>
          {(featureList: FeatureList) => (
            <Tooltip
              placement="top"
              title={t('sendMessage.icons.notification')}
            >
              <IconButton
                onClick={() => setActionType(WRITE_PUSH_NOTIFICATION)}
                color={
                  actionType === WRITE_PUSH_NOTIFICATION ? 'primary' : 'default'
                }
                className={classes.iconButton}
                disabled={
                  Config.REACT_APP_SENTRY_ENVIRONMENT === 'production' &&
                  !hasUpsell(featureList, UPSELL_IDENTIFIER_PUSH_NOTIFICATION)
                }
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
            orientation="vertical"
            flexItem
            className={classes.divider}
          />
          {actionType === WRITE_EMAIL && (
            <Tooltip placement="top" title={t('sendMessage.icons.template')}>
              <IconButton onClick={handleSelectTemplate}>
                <TemplateIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip placement="top" title={t('sendMessage.icons.balise')}>
            <IconButton
              onClick={(event) => setMenuBalisesAnchorEl(event.currentTarget)}
            >
              <BaliseIcon />
            </IconButton>
          </Tooltip>
          <NestedList
            dataRecord={tags}
            onItemClick={onBaliseItemClick}
            anchorElMenu={menuBalisesAnchorEl}
            handleCloseMenu={handleCloseMenuBalises}
            forTagsSelector
          />
        </Hidden>
        <Hidden smUp>
          <IconButton
            onClick={(event) => setMenuAnchorEl(event.currentTarget)}
            className={classes.iconButton}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={menuAnchorEl}
            keepMounted
            open={Boolean(menuAnchorEl)}
            onClose={handleCloseMenu}
            MenuListProps={{
              disablePadding: true,
            }}
          >
            {actionType === WRITE_EMAIL && (
              <MenuItem
                onClick={handleSelectTemplate}
                className={classes.mobileMenuItem}
              >
                <TemplateIcon className={classes.mobileIcon} />
                <Typography variant="caption">
                  {t('sendMessage.icons.template')}
                </Typography>
              </MenuItem>
            )}
            <MenuItem
              onClick={(event) => setMenuBalisesAnchorEl(event.currentTarget)}
              className={classes.mobileMenuItem}
            >
              <BaliseIcon className={classes.mobileIcon} />
              <Typography variant="caption">
                {t('sendMessage.icons.balise')}
              </Typography>
            </MenuItem>
            <NestedList
              dataRecord={tags}
              onItemClick={onBaliseItemClick}
              anchorElMenu={menuBalisesAnchorEl}
              handleCloseMenu={handleCloseMenuBalises}
              forTagsSelector
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
              <CommunicationThreadNumberRecipients
                members={
                  memberList?.slice(
                    0,
                    Math.min(MAX_DISPLAY, memberList.length),
                  ) ?? []
                }
                numberRecipients={selectedRecipientsCount}
                compactText
                compactAvatars={fullScreen}
                loading={memberListLoading}
              />
            ) : (
              <>
                <PeopleIcon className={classes.bottomRecipientSelectorIcon} />
                <Typography
                  variant="caption"
                  className={classes.bottomRecipientSelectorText}
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
        {validity === CAN_SEND_MESSAGE ? (
          <Button color="primary" variant="contained" onClick={sendMessage}>
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
              <Button color="primary" variant="contained" disabled>
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

export default BottomBarIcons;
