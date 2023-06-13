import React from 'react';

import { Grid } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

import { ClassNameMap } from '@material-ui/styles';

type OfferSummarySkeletonProps = {
  classes: ClassNameMap;
};

const OfferSummarySkeleton: React.FC<OfferSummarySkeletonProps> = ({
  classes,
}) => {
  return (
    <Grid container direction="column" className={classes.grid}>
      <Grid container item direction="column" className={classes.columnGap2}>
        <Grid container item direction="column" className={classes.columnGap1}>
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
        </Grid>
        <Grid container item direction="column" className={classes.columnGap2}>
          <Grid container item className={classes.lineGap1}>
            <Skeleton
              animation="wave"
              variant="circle"
              className={classes.avatar}
            />
            <Skeleton animation="wave" width="50%" />
          </Grid>
          <Grid container item className={classes.lineGap1}>
            <Skeleton
              animation="wave"
              variant="circle"
              className={classes.avatar}
            />
            <Skeleton animation="wave" width="50%" />
          </Grid>
          <Grid container item className={classes.lineGap1}>
            <Skeleton
              animation="wave"
              variant="circle"
              className={classes.avatar}
            />
            <Skeleton animation="wave" width="50%" />
          </Grid>
        </Grid>
        <Grid container item direction="column" className={classes.columnGap2}>
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default OfferSummarySkeleton;
