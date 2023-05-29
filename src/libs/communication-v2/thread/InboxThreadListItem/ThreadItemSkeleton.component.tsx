import React, { memo } from 'react';

import {
  ListItem,
  Avatar,
  ListItemText,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

const ThreadItemSkeleton: React.FC = () => {
  const classes = useStyles();

  return (
    <ListItem className={classes.listItem}>
      <Skeleton animation="wave" variant="circle">
        <Avatar />
      </Skeleton>
      <ListItemText
        primary={
          <Skeleton
            variant="text"
            animation="wave"
            height="100%"
            width="100%"
          />
        }
        secondary={
          <Skeleton
            variant="text"
            animation="wave"
            height="100%"
            width="100%"
          />
        }
        className={classes.content}
      />
    </ListItem>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  listItem: {
    display: 'flex',
    border: '1px solid #E1E1E1',
    height: '78px',
    padding: '8px',
  },
  content: {
    padding: theme.spacing(1),
  },
}));

export default memo(ThreadItemSkeleton);
