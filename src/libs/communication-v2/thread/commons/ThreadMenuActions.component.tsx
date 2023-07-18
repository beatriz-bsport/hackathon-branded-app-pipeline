import React, { memo, useCallback, useMemo, useState } from 'react';

import type { CallHistoryMethodAction } from 'connected-react-router';
import { makeStyles } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import StarIcon from '@material-ui/icons/Star';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import EmailIcon from '@material-ui/icons/Email';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ArchiveIcon from '@material-ui/icons/Archive';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import InfoIcon from '@material-ui/icons/Info';
import FilterListIcon from '@material-ui/icons/FilterList';
import { useTranslation } from 'react-i18next';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import type { CommunicationThread } from '#libs/communication-v2/types';
import type { OptionCallback } from '../../../../state/types';
import CustomMuiDialog from '#components/genericDialog/CustomMuiDialog.component';

type Button = {
  label?: string;
  onClick: () => void;
  variant?: 'text' | 'contained' | 'outlined' | string;
  color?: 'primary' | 'secondary' | 'default' | 'inherit' | string;
  commonLabel?:
    | 'cancel'
    | 'confirm'
    | 'next'
    | 'previous'
    | 'close'
    | 'finish'
    | 'saveRecord'
    | 'delete'
    | 'download'
    | string;
};

type Props = {
  id: number;
  hasBeenRead: boolean;
  isFavorite: boolean;
  isMuted: boolean;
  isDisabled: boolean;
  relatedObjectKind?: ChatThreadKinds;
  switchFavoriteStatus: (
    id: number,
    options?: OptionCallback<CommunicationThread>,
  ) => void;
  switchMutedStatus: (
    id: number,
    options?: OptionCallback<CommunicationThread>,
  ) => void;
  switchDisabledStatus: (
    id: number,
    options?: OptionCallback<CommunicationThread>,
  ) => void;
  flagAsUnread: (
    id: number,
    options?: OptionCallback<CommunicationThread>,
  ) => void;
  isMobileMenu?: boolean;
  goToDetailPage?: (id: number) => CallHistoryMethodAction<[string, unknown?]>;
  setOpenCollapse?: () => void;
  anchorEl: HTMLElement | null;
  setAnchorEl: (ev: HTMLElement | null) => void;
};

const ThreadMenuActions: React.FC<Props> = ({
  id,
  hasBeenRead,
  isFavorite,
  isMuted,
  isDisabled,
  relatedObjectKind,
  switchFavoriteStatus,
  switchMutedStatus,
  switchDisabledStatus,
  flagAsUnread,
  isMobileMenu,
  goToDetailPage,
  setOpenCollapse,
  anchorEl,
  setAnchorEl,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('communication');

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDisableThread = useCallback(
    (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
      event.stopPropagation();
      setAnchorEl(null);
      setIsDialogOpen(true);
    },
    [setIsDialogOpen, setAnchorEl],
  );

  const confirmDisableThread = useCallback(() => {
    switchDisabledStatus(id);
    setIsDialogOpen(false);
  }, [switchDisabledStatus, id, setIsDialogOpen]);

  const getDialogButtons = useMemo((): Button[] => {
    return [
      {
        commonLabel: 'cancel',
        variant: 'text',
        color: 'default',
        onClick: () => setIsDialogOpen(false),
      },
      {
        commonLabel: 'confirm',
        variant: 'text',
        color: 'primary',
        onClick: confirmDisableThread,
      },
    ];
  }, [setIsDialogOpen, confirmDisableThread]);

  const onClose = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setAnchorEl(null);
    },
    [setAnchorEl],
  );

  const handleAction = useCallback(
    (
      event: React.MouseEvent<HTMLLIElement, MouseEvent>,
      action: (
        id: number,
        options?: OptionCallback<CommunicationThread>,
      ) => CallHistoryMethodAction<[string, unknown?]> | void,
    ) => {
      setAnchorEl(null);
      event.stopPropagation();
      if (action !== flagAsUnread || hasBeenRead) {
        action(id);
      }
    },
    [id, hasBeenRead, flagAsUnread, setAnchorEl],
  );

  return (
    <>
      <Menu
        id="thread-menu"
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={onClose}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {isMobileMenu && (
          <div>
            <MenuItem
              onClick={(ev: React.MouseEvent<HTMLLIElement, MouseEvent>) =>
                handleAction(ev, goToDetailPage)
              }
            >
              <InfoIcon color="action" />
              <Typography className={classes.action}>
                {t(`thread.item.detail.${relatedObjectKind}`)}
              </Typography>
            </MenuItem>
            <MenuItem
              onClick={(ev: React.MouseEvent<HTMLLIElement, MouseEvent>) =>
                handleAction(ev, setOpenCollapse)
              }
            >
              <FilterListIcon color="action" />
              <Typography className={classes.action}>
                {t('thread.item.filterMessages')}
              </Typography>
            </MenuItem>
          </div>
        )}
        <MenuItem
          disabled={!hasBeenRead}
          onClick={(ev: React.MouseEvent<HTMLLIElement, MouseEvent>) =>
            handleAction(ev, flagAsUnread)
          }
        >
          <EmailIcon color={hasBeenRead ? 'action' : 'disabled'} />
          <Typography
            color={hasBeenRead ? 'textPrimary' : 'textSecondary'}
            className={classes.action}
          >
            {t('thread.item.markAsRead')}
          </Typography>
        </MenuItem>

        <MenuItem
          disabled={isDisabled}
          onClick={(ev: React.MouseEvent<HTMLLIElement, MouseEvent>) =>
            handleAction(ev, switchFavoriteStatus)
          }
        >
          {isFavorite ? (
            <StarBorderIcon color="action" />
          ) : (
            <StarIcon color={isDisabled ? 'disabled' : 'action'} />
          )}
          <Typography
            className={classes.action}
            color={isDisabled ? 'textSecondary' : 'textPrimary'}
          >
            {isFavorite
              ? t('thread.item.removeFavorite')
              : t('thread.item.addToFavorite')}
          </Typography>
        </MenuItem>

        <MenuItem
          disabled={isDisabled}
          onClick={(ev: React.MouseEvent<HTMLLIElement, MouseEvent>) =>
            handleAction(ev, switchMutedStatus)
          }
        >
          {isMuted ? (
            <NotificationsIcon color="action" />
          ) : (
            <NotificationsOffIcon color={isDisabled ? 'disabled' : 'action'} />
          )}
          <Typography
            className={classes.action}
            color={isDisabled ? 'textSecondary' : 'textPrimary'}
          >
            {isMuted ? t('thread.item.unmute') : t('thread.item.mute')}
          </Typography>
        </MenuItem>

        <MenuItem
          onClick={(ev: React.MouseEvent<HTMLLIElement, MouseEvent>) =>
            handleDisableThread(ev)
          }
        >
          {isDisabled ? (
            <UnarchiveIcon color="action" />
          ) : (
            <ArchiveIcon color="action" />
          )}
          <Typography className={classes.action}>
            {isDisabled ? t('thread.item.unarchive') : t('thread.item.archive')}
          </Typography>
        </MenuItem>
      </Menu>
      <CustomMuiDialog
        open={isDialogOpen}
        title={t('thread.item.disableDialog.title')}
        buttons={getDialogButtons}
      >
        <Typography>
          {t('thread.item.disableDialog.firstContent')}
          <br />
          {t('thread.item.disableDialog.secondContent')}
          <br /> <br />
          {t('thread.item.disableDialog.thirdContent')}
        </Typography>
      </CustomMuiDialog>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  action: {
    padding: theme.spacing(1),
  },
}));

export default memo(ThreadMenuActions);
