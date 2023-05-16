import React, { useState, memo, useCallback } from 'react';
import {
  IconButton,
  MenuItem,
  Menu,
  Typography,
  makeStyles,
  Theme,
} from '@material-ui/core';

import { useTranslation } from 'react-i18next';

import StarIcon from '@material-ui/icons/Star';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EmailIcon from '@material-ui/icons/Email';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ArchiveIcon from '@material-ui/icons/Archive';
import UnarchiveIcon from '@material-ui/icons/Unarchive';

type Props = {
  hasBeenRead: boolean;
  isFavorite: boolean;
  isMuted: boolean;
  isDisabled: boolean;
  switchFavoriteStatus: () => void;
  switchMutedStatus: () => void;
  switchDisabledStatus: () => void;
  markAsUnread: () => void;
};

const ThreadMenu: React.FC<Props> = ({
  hasBeenRead,
  isFavorite,
  isMuted,
  isDisabled,
  switchFavoriteStatus,
  switchMutedStatus,
  switchDisabledStatus,
  markAsUnread,
}) => {
  const { t } = useTranslation('communication');

  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
      event.stopPropagation();
    },
    [],
  );

  const onClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

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
    [hasBeenRead, markAsUnread],
  );

  return (
    <>
      <IconButton
        aria-controls="thread-menu"
        aria-haspopup="true"
        onClick={(ev) => handleClick(ev)}
      >
        <MoreVertIcon fontSize="medium" />
      </IconButton>
      <Menu
        id="thread-menu"
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={onClose}
      >
        <MenuItem
          disabled={!hasBeenRead}
          onClick={(ev) => handleAction(ev, markAsUnread)}
        >
          <EmailIcon color={hasBeenRead ? 'action' : 'disabled'} />
          <Typography
            color={hasBeenRead ? 'textPrimary' : 'textSecondary'}
            className={classes.action}
          >
            {t('thread.item.markAsRead')}
          </Typography>
        </MenuItem>

        <MenuItem onClick={(ev) => handleAction(ev, switchFavoriteStatus)}>
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

        <MenuItem onClick={(ev) => handleAction(ev, switchMutedStatus)}>
          {isMuted ? (
            <NotificationsIcon color="action" />
          ) : (
            <NotificationsOffIcon color="action" />
          )}
          <Typography className={classes.action}>
            {isMuted ? t('thread.item.unmute') : t('thread.item.mute')}
          </Typography>
        </MenuItem>

        <MenuItem onClick={(ev) => handleAction(ev, switchDisabledStatus)}>
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
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  action: {
    padding: theme.spacing(1),
  },
}));

export default memo(ThreadMenu);
