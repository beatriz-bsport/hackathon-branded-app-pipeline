import React, { useMemo } from 'react';

import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core';
import { SIMILAR_OFFERS_PAGE_SIZE } from '../constants';

const SimilarOffersListSkeleton = () => {
  const classes = useStyle();

  const similarOfferSkeletons: number[] = useMemo(
    () => [...Array(SIMILAR_OFFERS_PAGE_SIZE).keys()],
    [],
  );

  return (
    <div className={classes.skeletonList}>
      {similarOfferSkeletons.map((key) => (
        <Skeleton
          key={key}
          variant="rect"
          width="100%"
          height={70}
          className={classes.skeletonBase}
        />
      ))}
      <Skeleton
        variant="rect"
        width="50%"
        height={30}
        className={classes.skeletonBase}
      />
    </div>
  );
};

const useStyle = makeStyles((theme) => ({
  skeletonList: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
  },
  skeletonBase: {
    borderRadius: '5px',
  },
}));

export default SimilarOffersListSkeleton;
