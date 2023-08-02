import React from 'react';

import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/styles';
import { Box, Theme } from '@material-ui/core';

import FormSectionSkeleton from '#components/forms/FormSection/FormSectionSkeleton.component';

const UniqueCouponFormSkeleton: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.headingContainer}>
        <Skeleton
          className={classes.skeletonBase}
          height={56}
          variant="rect"
          width={200}
        />
      </div>

      <FormSectionSkeleton withoutIcon fieldsCount={2} />
      <FormSectionSkeleton withoutIcon fieldsCount={5} />
      <FormSectionSkeleton withoutIcon fieldsCount={3} />
      <FormSectionSkeleton withoutIcon fieldsCount={2} />
      <Box className={classes.container}>
        <div className={classes.titleSkeleton}>
          <Skeleton
            className={classes.skeletonBase}
            height={27}
            variant="rect"
            width={150}
          />
        </div>
        <Skeleton
          className={classes.skeletonBase}
          height={81}
          variant="rect"
          width="100%"
        />
      </Box>

      <div className={classes.actionsContainer}>
        <Skeleton
          className={classes.skeletonBase}
          height={36}
          variant="rect"
          width={82}
        />
        <Skeleton
          className={classes.skeletonBase}
          height={36}
          variant="rect"
          width={82}
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  skeletonBase: {
    borderRadius: '5px',
  },
  headingContainer: {
    padding: theme.spacing(4),
  },
  actionsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1.25),
    padding: theme.spacing(4),
  },
  titleSkeleton: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

export default React.memo(UniqueCouponFormSkeleton);
