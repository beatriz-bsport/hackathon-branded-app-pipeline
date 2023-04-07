import React from 'react';

import { Theme, makeStyles } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

const MetaActivitySelectorWithCardSkeleton = () => {
  const classes = useStyles();

  const MetaActivityCardSkeleton = () => {
    return (
      <div className={classes.skeletonCardContainer}>
        <Skeleton
          animation="wave"
          variant="rect"
          className={classes.skeletonCard}
        >
          <Skeleton
            animation="wave"
            variant="circle"
            className={classes.skeletonCardAvatar}
          />
        </Skeleton>
      </div>
    );
  };

  return (
    <>
      <Skeleton
        animation="wave"
        variant="rect"
        className={classes.skeletonSearch}
      />

      <div className={classes.skeletonList}>
        <MetaActivityCardSkeleton />
        <MetaActivityCardSkeleton />
        <MetaActivityCardSkeleton />
      </div>
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  skeletonSearch: {
    display: 'flex',
    height: '56px',
    borderRadius: '5px',
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    marginBottom: theme.spacing(4),
    backgroundColor: '#eeeeee',
  },
  skeletonCardContainer: {
    display: 'flex',
    flex: 1,
  },
  skeletonCard: {
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    maxWidth: 'inherit',
    height: '75px',
    borderRadius: '5px',
    padding: theme.spacing(2),
    backgroundColor: '#eeeeee',
  },
  skeletonCardAvatar: {
    visibility: 'inherit',
    width: '56px',
    height: '56px',
    backgroundColor: '#e0e0e0',
  },
  skeletonList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

export default MetaActivitySelectorWithCardSkeleton;
