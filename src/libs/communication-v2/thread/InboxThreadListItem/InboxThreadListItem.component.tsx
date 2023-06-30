import React, { useCallback, memo } from 'react';

import {
  ListItemText,
  Typography,
  makeStyles,
  Theme,
  ListItem,
  alpha,
} from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';

import type { OptionCallback } from '../../../../state/types';
import type {
  CommunicationThread,
  CommunicationThreadWithUnreadAnswersCount,
} from '#libs/communication-v2/types';
import ThreadMenu from '#libs/communication-v2/thread/InboxThreadListItem/ThreadMenu.component';
import ThreadAvatar from '#libs/communication-v2/thread/InboxThreadListItem/ThreadAvatar.component';
import ThreadItemSkeleton from './ThreadItemSkeleton.component';

export type Props = {
  thread: CommunicationThreadWithUnreadAnswersCount;
  isLoading: boolean;
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
  isSelected: boolean;
  onClick?: () => void;
};

const InboxThreadListItem: React.FC<Props> = ({
  thread,
  isLoading,
  switchFavoriteStatus,
  switchMutedStatus,
  switchDisabledStatus,
  flagAsUnread,
  isSelected,
  onClick,
}) => {
  const { t } = useTranslation('communication');

  const classes = useStyles();

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      onClick?.();
    },
    [onClick],
  );

  const displayRelativeTimeDelta = useCallback(
    (date: string) => {
      const momentDate = moment(date);
      const now = moment(Date.now());

      let display = '';

      if (now.diff(momentDate, 'hours') < 1) {
        const minutes = now.diff(momentDate, 'minutes');
        display = `·\u00A0${minutes}\u00A0${t('thread.item.minutes')}`;
      } else if (now.diff(momentDate, 'days') < 1) {
        const hours = now.diff(momentDate, 'hours');
        display = `·\u00A0${hours}\u00A0${t('thread.item.hours')}`;
      } else if (now.diff(momentDate, 'weeks') < 1) {
        const days = now.diff(momentDate, 'days');
        display = `·\u00A0${days}\u00A0${t('thread.item.days')}`;
      } else if (now.diff(momentDate, 'years') < 1) {
        const weeks = now.diff(momentDate, 'weeks');
        display = `·\u00A0${weeks}\u00A0${t('thread.item.weeks')}`;
      } else {
        const years = now.diff(momentDate, 'years');
        display = `·\u00A0${t('thread.item.year', { count: years })}`;
      }

      return display;
    },
    [t],
  );

  const primaryContent = () => (
    <div className={classes.inline}>
      <div className={classes.titles}>
        <Typography
          component="span"
          variant="body1"
          color={
            thread?.last_communication_has_been_read
              ? 'textSecondary'
              : 'textPrimary'
          }
          className={classes.textContent}
        >
          {thread?.title}
        </Typography>
        {!!thread?.subtitle && (
          <Typography
            component="span"
            variant="body2"
            color={
              thread?.last_communication_has_been_read
                ? 'textSecondary'
                : 'textPrimary'
            }
            className={classes.textContent}
          >
            {thread?.subtitle}
          </Typography>
        )}
      </div>
      <div className={classes.threadStatus}>
        {thread?.favorite && <StarIcon fontSize="small" color="primary" />}
        {thread?.muted && (
          <NotificationsOffIcon fontSize="small" color="action" />
        )}
      </div>
    </div>
  );

  const secondaryContent = () => (
    <div className={classes.secondary}>
      <div>
        <Typography
          component="span"
          variant="body2"
          color={
            thread?.last_communication_has_been_read
              ? 'textSecondary'
              : 'textPrimary'
          }
          className={classes.textContent}
        >
          {thread?.last_communication_content}
        </Typography>
      </div>
      <Typography
        component="span"
        variant="body2"
        color={
          thread?.last_communication_has_been_read
            ? 'textSecondary'
            : 'textPrimary'
        }
        className="momentDateDisplay"
      >
        {displayRelativeTimeDelta(thread?.last_communication_datetime)}
      </Typography>
    </div>
  );

  return (
    <>
      {isLoading ? (
        <ThreadItemSkeleton />
      ) : (
        <ListItem
          className={classes.listItem}
          classes={{ root: classes.root, selected: classes.selected }}
          button
          disableRipple
          selected={isSelected}
          onClick={handleClick}
        >
          <ThreadAvatar
            numberOfUnreadAnswers={thread?.numberOfUnreadAnswers || 0}
            isMuted={thread?.muted}
            cover={thread?.cover}
            relatedObjectKind={thread?.related_object_kind}
          />
          <ListItemText
            primary={primaryContent()}
            secondary={secondaryContent()}
          />

          <div className={classes.threadMenu}>
            <ThreadMenu
              id={thread?.id}
              hasBeenRead={thread?.last_communication_has_been_read}
              isFavorite={thread?.favorite}
              isMuted={thread?.muted}
              isDisabled={thread?.disabled}
              switchFavoriteStatus={switchFavoriteStatus}
              switchMutedStatus={switchMutedStatus}
              switchDisabledStatus={switchDisabledStatus}
              flagAsUnread={flagAsUnread}
              relatedObjectKind={thread?.related_object_kind}
            />
          </div>
        </ListItem>
      )}
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  listItem: {
    display: 'flex',
    border: '1px solid #E1E1E1',
    height: theme.spacing(10),
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
    '&$selected': {
      backgroundColor: theme.palette.primary.main,
    },
    [theme.breakpoints.up('md')]: {
      '&:hover $threadMenu': {
        display: 'flex',
      },
      '&:hover $threadStatus': {
        visibility: 'hidden',
      },
      '&:hover .momentDateDisplay': {
        visibility: 'hidden',
      },
    },
  },
  root: {
    '&$selected': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
    '&$selected:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.15),
    },
  },
  selected: {},
  inline: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondary: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titles: {
    display: 'flex',
    flexDirection: 'column',
  },
  disabledBadge: {
    backgroundColor: theme.palette.grey[400],
    color: theme.palette.common.white,
  },
  threadMenu: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  threadStatus: {
    visibility: 'visible',
    display: 'flex',
    flexDirection: 'row',
  },
  textContent: {
    display: '-webkit-box',
    overflow: 'hidden',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
  },
  skeleton: {
    padding: theme.spacing(1),
  },
}));

export default memo(InboxThreadListItem);
