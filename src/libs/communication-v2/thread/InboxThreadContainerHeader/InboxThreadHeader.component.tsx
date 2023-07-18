import React, { memo, useCallback } from 'react';

import type { CallHistoryMethodAction } from 'connected-react-router';
import { makeStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FilterListIcon from '@material-ui/icons/FilterList';
import StarIcon from '@material-ui/icons/Star';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';

import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import type { CommunicationThread } from '#libs/communication-v2/types';
import ThreadMenu from '#libs/communication-v2/thread/InboxThreadListItem/ThreadMenu.component';
import type { OptionCallback } from '../../../../state/types';

type Props = {
  id: number;
  cover: string;
  title: string;
  subtitle?: string;
  isFavorite: boolean;
  isMuted: boolean;
  hasBeenRead: boolean;
  isDisabled: boolean;
  relatedObjectKind: ChatThreadKinds;

  onShowFilterModal?: () => void;

  switchFavoriteStatus?: (
    id: number,
    options?: OptionCallback<CommunicationThread>,
  ) => void;
  switchMutedStatus?: (
    id: number,
    options?: OptionCallback<CommunicationThread>,
  ) => void;
  switchDisabledStatus?: (
    id: number,
    options?: OptionCallback<CommunicationThread>,
  ) => void;
  flagAsUnread?: (
    id: number,
    options?: OptionCallback<CommunicationThread>,
  ) => void;
  goToDetailPage?: (id: number) => CallHistoryMethodAction<[string, unknown?]>;
  goToThreadListPage?: () => void;
  closeInboxPanel?: (id: number) => CallHistoryMethodAction<[string, unknown?]>;
};

const InboxThreadHeader: React.FC<Props> = ({
  id,
  cover,
  title,
  subtitle,
  isFavorite,
  isMuted,
  hasBeenRead,
  isDisabled,
  relatedObjectKind,
  onShowFilterModal,
  switchFavoriteStatus,
  switchMutedStatus,
  switchDisabledStatus,
  flagAsUnread,
  goToDetailPage,
  goToThreadListPage,
  closeInboxPanel,
}) => {
  const classes = useStyles();

  const handleClosePanel = useCallback(
    () => closeInboxPanel(id),
    [id, closeInboxPanel],
  );

  const isMobilePanel = !!closeInboxPanel;

  return (
    <Paper className={classes.header} variant="outlined">
      <div className={classes.left}>
        {!isMobilePanel && (
          <div className={classes.arrowBack}>
            <IconButton onClick={goToThreadListPage}>
              <ArrowBackIcon color="action" />
            </IconButton>
          </div>
        )}
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
              {title}
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
            {title}
          </Typography>
        )}
        {isFavorite && <StarIcon fontSize="small" color="primary" />}
        {isMuted && <NotificationsOffIcon fontSize="small" color="action" />}
      </div>

      <div className={classes.right}>
        <IconButton onClick={onShowFilterModal} className={classes.filterIcon}>
          <FilterListIcon />
        </IconButton>
        <div className={classes.threadStatus}>
          {isMobilePanel ? (
            <IconButton onClick={handleClosePanel}>
              <CloseIcon />
            </IconButton>
          ) : (
            <>
              <ThreadMenu
                id={id}
                hasBeenRead={hasBeenRead}
                isFavorite={isFavorite}
                isMuted={isMuted}
                isDisabled={isDisabled}
                relatedObjectKind={relatedObjectKind}
                switchFavoriteStatus={switchFavoriteStatus}
                switchMutedStatus={switchMutedStatus}
                switchDisabledStatus={switchDisabledStatus}
                flagAsUnread={flagAsUnread}
                isMobileMenu
                goToDetailPage={goToDetailPage}
                setOpenCollapse={onShowFilterModal}
              />
            </>
          )}
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
    borderRadius: 0,
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
