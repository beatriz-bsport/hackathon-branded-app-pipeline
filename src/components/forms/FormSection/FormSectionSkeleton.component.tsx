import React from 'react';

import { Box, Divider, makeStyles, Theme } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

type Props = {
  fieldsCount: number;
};

const FormSectionSkeleton = React.memo((props: Props) => {
  const { fieldsCount } = props;
  const classes = useStyle();

  const fields = [...Array(fieldsCount).keys()];

  return (
    <div id="offer-form-skeleton">
      <Box className={classes.container}>
        <div className={classes.titleSkeleton}>
          <Skeleton
            variant="rect"
            width={44}
            height={44}
            className={classes.skeletonBase}
          />
          <Skeleton
            variant="rect"
            width={150}
            height={27}
            className={classes.skeletonBase}
          />
        </div>

        {fields.map((field) => (
          <Skeleton
            key={field}
            variant="rect"
            width="50%"
            height={38}
            className={classes.skeletonBase}
          />
        ))}
      </Box>
      <Divider />
    </div>
  );
});

const useStyle = makeStyles((theme: Theme) => ({
  container: {
    paddingRight: theme.spacing(4.25),
    paddingLeft: theme.spacing(4.25),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    '& > *:not(:last-child)': {
      marginBottom: theme.spacing(3),
    },
    '& > *:last-child': {
      marginBottom: theme.spacing(0),
    },
  },
  skeletonBase: {
    borderRadius: '5px',
  },
  titleSkeleton: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

export default FormSectionSkeleton;
