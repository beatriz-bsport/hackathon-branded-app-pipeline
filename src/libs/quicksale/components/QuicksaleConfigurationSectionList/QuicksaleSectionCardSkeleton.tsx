import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core';
import { QuicksaleSectionCardStyle } from '../../constants';

const QuicksaleSectionCardSkeleton: React.FC = () => {
  const classes = useStyle();
  return (
    <div className={classes.skeletonContainer}>
      <Skeleton
        variant="rect"
        animation="wave"
        width="100%"
        height="100%"
        className={classes.skeleton}
      />
    </div>
  );
};

const useStyle = makeStyles((theme) => ({
  skeletonContainer: {
    minWidth: QuicksaleSectionCardStyle.minWidth,
    minHeight: QuicksaleSectionCardStyle.minHeight,
    aspectRatio: QuicksaleSectionCardStyle.aspectRatio.toString(),
  },
  skeleton: {
    borderRadius: theme.spacing(1.5),
  },
}));

export default React.memo(QuicksaleSectionCardSkeleton);
