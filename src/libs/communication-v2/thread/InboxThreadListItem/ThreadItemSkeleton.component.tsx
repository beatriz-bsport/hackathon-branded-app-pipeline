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
    height: '64px',
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
  content: {
    padding: theme.spacing(1),
  },
}));

export default memo(ThreadItemSkeleton);
