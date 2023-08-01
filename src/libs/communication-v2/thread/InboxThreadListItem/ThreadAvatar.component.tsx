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
      badgeContent={numberOfUnreadAnswers}
      classes={{
        badge: classes.badge,
        colorSecondary: classes.disabledBadge,
      }}
      color={isMuted ? 'secondary' : 'error'}
      max={MAX_NUMBER_OF_UNREAD_THREADS_DISPLAYED}
      overlap="circular"
    >
      <ListItemAvatar>
        {relatedObjectKind === 'smartlist' ? (
          <GroupIcon color="action" fontSize="large" />
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
