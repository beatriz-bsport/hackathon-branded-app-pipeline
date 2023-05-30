import React, { memo, useCallback } from 'react';

import { Menu, MenuItem, Typography, makeStyles } from '@material-ui/core';
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

type Props = {
  hasBeenRead: boolean;
  isFavorite: boolean;
  isMuted: boolean;
  isDisabled: boolean;
  relatedObjectKind?: ChatThreadKinds;
  switchFavoriteStatus: () => void;
  switchMutedStatus: () => void;
  switchDisabledStatus: () => void;
  markAsUnread: () => void;
  isMobileMenu?: boolean;
  goToDetailPage?: () => void;
  setOpenCollapse?: () => void;
  anchorEl: HTMLElement | null;
  setAnchorEl: (ev: HTMLElement | null) => void;
};

const ThreadMenuActions: React.FC<Props> = ({
  hasBeenRead,
  isFavorite,
  isMuted,
  isDisabled,
  relatedObjectKind,
  switchFavoriteStatus,
  switchMutedStatus,
  switchDisabledStatus,
  markAsUnread,
  isMobileMenu,
  goToDetailPage,
  setOpenCollapse,
  anchorEl,
  setAnchorEl,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('communication');

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
      action: () => void,
    ) => {
      setAnchorEl(null);
      event.stopPropagation();
      if (action !== markAsUnread || hasBeenRead) {
        action();
      }
    },
    [hasBeenRead, markAsUnread, setAnchorEl],
  );

  return (
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
          handleAction(ev, markAsUnread)
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
        onClick={(ev: React.MouseEvent<HTMLLIElement, MouseEvent>) =>
          handleAction(ev, switchFavoriteStatus)
        }
      >
        {isFavorite ? (
          <StarBorderIcon color="action" />
        ) : (
          <StarIcon color="action" />
        )}
        <Typography className={classes.action}>
          {isFavorite
            ? t('thread.item.removeFavorite')
            : t('thread.item.addToFavorite')}
        </Typography>
      </MenuItem>

      <MenuItem
        onClick={(ev: React.MouseEvent<HTMLLIElement, MouseEvent>) =>
          handleAction(ev, switchMutedStatus)
        }
      >
        {isMuted ? (
          <NotificationsIcon color="action" />
        ) : (
          <NotificationsOffIcon color="action" />
        )}
        <Typography className={classes.action}>
          {isMuted ? t('thread.item.unmute') : t('thread.item.mute')}
        </Typography>
      </MenuItem>

      <MenuItem
        onClick={(ev: React.MouseEvent<HTMLLIElement, MouseEvent>) =>
          handleAction(ev, switchDisabledStatus)
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
  );
};

const useStyles = makeStyles((theme) => ({
  action: {
    padding: theme.spacing(1),
  },
}));

export default memo(ThreadMenuActions);
