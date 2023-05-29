import React, { memo } from 'react';

import {
  Avatar,
  Badge,
  ListItemAvatar,
  makeStyles,
  Theme,
} from '@material-ui/core';
import GroupIcon from '@material-ui/icons/Group';

type Props = {
  numberOfUnreadAnswers: number;
  isMuted: boolean;
  cover: string;
  relatedObjectKind: string;
};

const MAX_NUMBER_OF_UNREAD_THREADS_DISPLAYED = 9;

const ThreadAvatar: React.FC<Props> = ({
  numberOfUnreadAnswers,
  isMuted,
  cover,
  relatedObjectKind,
}) => {
  const classes = useStyles();

  return (
    <Badge
      color={isMuted ? 'secondary' : 'error'}
      badgeContent={numberOfUnreadAnswers}
      max={MAX_NUMBER_OF_UNREAD_THREADS_DISPLAYED}
      overlap="circular"
      classes={{
        badge: classes.badge,
        colorSecondary: classes.disabledBadge,
      }}
    >
      <ListItemAvatar>
        {relatedObjectKind === 'smartlist' ? (
          <GroupIcon fontSize="large" color="action" />
        ) : (
          <Avatar src={cover} />
        )}
      </ListItemAvatar>
    </Badge>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  badge: {
    borderWidth: 1,
    borderColor: 'white',
    borderStyle: 'solid',
    right: '30%',
    top: '14%',
  },
  disabledBadge: {
    backgroundColor: theme.palette.grey[400],
    color: theme.palette.common.white,
  },
}));

export default memo(ThreadAvatar);
