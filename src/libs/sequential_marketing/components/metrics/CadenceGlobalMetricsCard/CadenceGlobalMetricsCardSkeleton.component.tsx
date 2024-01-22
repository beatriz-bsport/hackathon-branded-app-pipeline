import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Skeleton from '@material-ui/lab/Skeleton';

import { CadenceMetricsSizes } from '#libs/sequential_marketing/constants';

const CadenceGlobalMetricsCardSkeleton: React.FC = React.memo(() => {
  const classes = useSkeletonStyles();

  return (
    <div className={classes.cardContainer}>
      <div className={classes.topContainer}>
        <div className={classes.iconAndTitleContainer}>
          <Skeleton
            animation="wave"
            className={classes.iconContainer}
            variant="circle"
          />
          <Skeleton animation="wave" className={classes.title} variant="text" />
        </div>
        <Skeleton animation="wave" variant="text" />
      </div>
      <div className={classes.lowContainer}>
        <Skeleton animation="wave" className={classes.number} variant="text" />
        <Skeleton animation="wave" className={classes.label} variant="text" />
      </div>
    </div>
  );
});

const useSkeletonStyles = makeStyles((theme) => ({
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    gap: theme.spacing(2),
    backgroundColor: theme.palette.common.white,
  },
  topContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    height: CadenceMetricsSizes.GLOBAL_METRICS_CARD_DESCRIPTION_SIZE,
  },
  iconAndTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
    height: CadenceMetricsSizes.ICON_CONTAINER_SIZE,
    alignItems: 'center',
  },
  title: {
    width: '40%',
  },
  lowContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
    alignItems: 'end',
  },
  number: {
    width: theme.spacing(3),
    fontSize: theme.spacing(4),
  },
  label: {
    width: '30%',
    marginBottom: theme.spacing(0.5),
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.spacing(1),
    height: CadenceMetricsSizes.ICON_CONTAINER_SIZE,
    width: CadenceMetricsSizes.ICON_CONTAINER_SIZE,
    minWidth: CadenceMetricsSizes.ICON_CONTAINER_SIZE,
  },
}));

export default CadenceGlobalMetricsCardSkeleton;
