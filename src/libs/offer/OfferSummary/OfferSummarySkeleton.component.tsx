import React from 'react';

import { Skeleton } from '@material-ui/lab';

import { ClassNameMap } from '@material-ui/styles';

type OfferSummarySkeletonProps = {
  classes: ClassNameMap;
};

const OfferSummarySkeleton: React.FC<OfferSummarySkeletonProps> = ({
  classes,
}) => {
  return (
    <div className={classes.grid}>
      <div className={classes.columnGap2}>
        <div className={classes.columnGap1}>
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
        </div>
        <div className={classes.columnGap2}>
          <div className={classes.lineGap1}>
            <Skeleton
              animation="wave"
              variant="circle"
              className={classes.avatar}
            />
            <Skeleton animation="wave" width="50%" />
          </div>
          <div className={classes.lineGap1}>
            <Skeleton
              animation="wave"
              variant="circle"
              className={classes.avatar}
            />
            <Skeleton animation="wave" width="50%" />
          </div>
          <div className={classes.lineGap1}>
            <Skeleton
              animation="wave"
              variant="circle"
              className={classes.avatar}
            />
            <Skeleton animation="wave" width="50%" />
          </div>
        </div>
        <div className={classes.columnGap2}>
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
        </div>
      </div>
    </div>
  );
};

export default OfferSummarySkeleton;
