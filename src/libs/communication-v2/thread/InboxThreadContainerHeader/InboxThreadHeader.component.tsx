import React, { memo, useCallback } from 'react';

import {
  Avatar,
  IconButton,
  Paper,
  Typography,
  makeStyles,
} from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import StarIcon from '@material-ui/icons/Star';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import ThreadMenu from '#libs/communication-v2/thread/InboxThreadListItem/ThreadMenu.component';

type Props = {
  cover: string;
  name: string;
  subtitle?: string;
  isFavorite: boolean;
  isMuted: boolean;
  hasBeenRead: boolean;
  isDisabled: boolean;
  relatedObjectKind: ChatThreadKinds;

  isCollapseOpen: boolean;
  setIsCollapseOpen: (isOpen: boolean) => void;

  switchFavoriteStatus: () => void;
  switchMutedStatus: () => void;
  switchDisabledStatus: () => void;
  markAsUnread: () => void;
  goToDetailPage: () => void;
  goToThreadListPage: () => void;
};

const InboxThreadHeader: React.FC<Props> = ({
  cover,
  name,
  subtitle,
  isFavorite,
  isMuted,
  hasBeenRead,
  isDisabled,
  relatedObjectKind,
  isCollapseOpen,
  setIsCollapseOpen,
  switchFavoriteStatus,
  switchMutedStatus,
  switchDisabledStatus,
  markAsUnread,
  goToDetailPage,
  goToThreadListPage,
}) => {
  const classes = useStyles();

  const handleClick = useCallback(() => {
    setIsCollapseOpen(!isCollapseOpen);
  }, [isCollapseOpen, setIsCollapseOpen]);

  return (
    <Paper className={classes.header} variant="outlined">
      <div className={classes.left}>
        <div className={classes.arrowBack}>
          <IconButton onClick={goToThreadListPage}>
            <ArrowBackIcon color="action" />
          </IconButton>
        </div>
        {[ChatThreadKinds.Member, ChatThreadKinds.Offer].includes(
          relatedObjectKind,
        ) && <Avatar src={cover} />}
        {subtitle ? (
          <div
            className={
              relatedObjectKind === ChatThreadKinds.Smartlist
                ? classes.titlesSmartlist
                : classes.titles
            }
          >
            <Typography variant="h5" className={classes.offerTexts}>
              {name}
            </Typography>
            <Typography variant="body1" className={classes.offerTexts}>
              {subtitle}
            </Typography>
          </div>
        ) : (
          <Typography
            className={
              relatedObjectKind === ChatThreadKinds.Smartlist
                ? classes.textSmartlist
                : classes.text
            }
            variant="h5"
          >
            {name}
          </Typography>
        )}
        {isFavorite && <StarIcon fontSize="small" color="primary" />}
        {isMuted && <NotificationsOffIcon fontSize="small" color="action" />}
      </div>

      <div className={classes.right}>
        <IconButton onClick={handleClick} className={classes.filterIcon}>
          <FilterListIcon />
        </IconButton>
        <div className={classes.threadStatus}>
          <ThreadMenu
            hasBeenRead={hasBeenRead}
            isFavorite={isFavorite}
            isMuted={isMuted}
            isDisabled={isDisabled}
            relatedObjectKind={relatedObjectKind}
            switchFavoriteStatus={switchFavoriteStatus}
            switchMutedStatus={switchMutedStatus}
            switchDisabledStatus={switchDisabledStatus}
            markAsUnread={markAsUnread}
            isMobileMenu
            goToDetailPage={goToDetailPage}
            setOpenCollapse={handleClick}
          />
        </div>
      </div>
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    height: theme.spacing(10),
  },
  left: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(1),
      paddingRight: 0,
    },
  },
  arrowBack: {
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
    },
  },
  titles: {
    display: 'flex',
    flexDirection: 'column',
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
  titlesSmartlist: {
    display: 'flex',
    flexDirection: 'column',
    paddingRight: theme.spacing(2),
  },
  offerTexts: {
    display: '-webkit-box',
    overflow: 'hidden',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
  },
  text: {
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    display: '-webkit-box',
    overflow: 'hidden',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  textSmartlist: {
    paddingRight: theme.spacing(2),
  },
  right: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      paddingRight: theme.spacing(1),
      paddingLeft: 0,
    },
  },
  filterIcon: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  threadStatus: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export default memo(InboxThreadHeader);
