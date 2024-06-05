import React, { useCallback, memo } from 'react';
import { DateTime } from 'luxon';

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

import type {
  CommunicationThread,
  CommunicationThreadWithUnreadAnswersCount,
} from '#libs/communication-v2/types';
import ThreadMenu from '#libs/communication-v2/thread/InboxThreadListItem/ThreadMenu.component';
import ThreadAvatar from '#libs/communication-v2/thread/InboxThreadListItem/ThreadAvatar.component';
import type { OptionCallback } from '../../../../state/types';
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
      const momentDate = DateTime.fromISO(date);
      const now = DateTime.now();

      let display = '';

      if (now.diff(momentDate, 'hours').as('hours') < 1) {
        const minutes = Math.floor(
          now.diff(momentDate, 'minutes').as('minutes'),
        );
        display = `·\u00A0${minutes}\u00A0${t('thread.item.minutes')}`;
      } else if (now.diff(momentDate, 'days').as('days') < 1) {
        const hours = Math.floor(now.diff(momentDate, 'hours').as('hours'));
        display = `·\u00A0${hours}\u00A0${t('thread.item.hours')}`;
      } else if (now.diff(momentDate, 'weeks').as('weeks') < 1) {
        const days = Math.floor(now.diff(momentDate, 'days').as('days'));
        display = `·\u00A0${days}\u00A0${t('thread.item.days')}`;
      } else if (now.diff(momentDate, 'years').as('years') < 1) {
        const weeks = Math.floor(now.diff(momentDate, 'weeks').as('weeks'));
        display = `·\u00A0${weeks}\u00A0${t('thread.item.weeks')}`;
      } else {
        const years = Math.floor(now.diff(momentDate, 'years').as('years'));
        display = `·\u00A0${t('thread.item.year', { count: years })}`;
      }

      return display;
    },
    [t],
  );

  const unreadAnswersCount = thread?.last_communication_has_been_read
    ? thread?.numberOfUnreadAnswers ?? 0
    : 1;

  const primaryContent = () => (
    <div className={classes.inline}>
      <div className={classes.titles}>
        <Typography
          className={classes.textContent}
          color={
            thread?.last_communication_has_been_read
              ? 'textSecondary'
              : 'textPrimary'
          }
          component="span"
          variant="body1"
        >
          {thread?.title}
        </Typography>
        {!!thread?.subtitle && (
          <Typography
            className={classes.textContent}
            color={
              thread?.last_communication_has_been_read
                ? 'textSecondary'
                : 'textPrimary'
            }
            component="span"
            variant="caption"
          >
            {thread?.subtitle}
          </Typography>
        )}
      </div>
      <div className={classes.threadStatus}>
        {thread?.favorite && <StarIcon color="primary" fontSize="small" />}
        {thread?.muted && (
          <NotificationsOffIcon color="action" fontSize="small" />
        )}
      </div>
    </div>
  );

  const secondaryContent = () => (
    <div className={classes.secondary}>
      <div>
        <Typography
          className={classes.textContent}
          color={
            thread?.last_communication_has_been_read
              ? 'textSecondary'
              : 'textPrimary'
          }
          component="span"
          variant="body2"
        >
          {thread?.last_communication_content || t('thread.item.noMessage')}
        </Typography>
      </div>
      {!!thread?.last_communication_datetime && (
        <Typography
          className="momentDateDisplay"
          color={
            thread?.last_communication_has_been_read
              ? 'textSecondary'
              : 'textPrimary'
          }
          component="span"
          variant="body2"
        >
          {displayRelativeTimeDelta(thread?.last_communication_datetime)}
        </Typography>
      )}
    </div>
  );

  return (
    <>
      {isLoading ? (
        <ThreadItemSkeleton />
      ) : (
        <ListItem
          button
          disableRipple
          classes={{ root: classes.root, selected: classes.selected }}
          className={classes.listItem}
          onClick={handleClick}
          selected={isSelected}
        >
          <ThreadAvatar
            cover={thread?.cover}
            isMuted={thread?.muted}
            numberOfUnreadAnswers={unreadAnswersCount}
            relatedObjectKind={thread?.related_object_kind}
          />
          <ListItemText
            primary={primaryContent()}
            secondary={secondaryContent()}
          />

          <div className={classes.threadMenu}>
            <ThreadMenu
              flagAsUnread={flagAsUnread}
              hasBeenRead={thread?.last_communication_has_been_read}
              id={thread?.id}
              isDisabled={thread?.disabled}
              isFavorite={thread?.favorite}
              isMuted={thread?.muted}
              relatedObjectKind={thread?.related_object_kind}
              switchDisabledStatus={switchDisabledStatus}
              switchFavoriteStatus={switchFavoriteStatus}
              switchMutedStatus={switchMutedStatus}
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
    height: '76px',
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
    '&$selected': {
      backgroundColor: theme.palette.primary.main,
      borderRadius: theme.spacing(2),
    },
    '&:hover': {
      borderRadius: theme.spacing(2),
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
      borderRadius: theme.spacing(2),
    },
    '&$selected:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.15),
      borderRadius: theme.spacing(2),
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
