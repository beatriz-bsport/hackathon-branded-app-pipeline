import React from 'react';

import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

import FormSectionSkeleton from '#components/forms/FormSection/FormSectionSkeleton.component';

const OfferFormSkeleton = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.headingContainer}>
        <Skeleton
          variant="rect"
          width={200}
          height={56}
          className={classes.skeletonBase}
        />
      </div>

      <FormSectionSkeleton fieldsCount={4} />
      <FormSectionSkeleton fieldsCount={4} />
      <FormSectionSkeleton fieldsCount={1} />

      <div className={classes.actionsContainer}>
        <Skeleton
          variant="rect"
          width={82}
          height={36}
          className={classes.skeletonBase}
        />
        <Skeleton
          variant="rect"
          width={82}
          height={36}
          className={classes.skeletonBase}
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
}));

export default OfferFormSkeleton;
