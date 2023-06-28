// @ts-nocheck
import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';

type Props = {
  additionalMargin: number;
};

const useStyles = makeStyles<Theme, { additionalMargin: number }>((theme) => ({
  linear: ({ additionalMargin }) => ({
    marginTop: theme.spacing(-2),
    marginLeft: theme.spacing(-3 + additionalMargin),
    marginRight: theme.spacing(-3 + additionalMargin),
    marginBottom: theme.spacing(2),
  }),
}));

export function BackofficeLinearProgress(props: Props) {
  const { additionalMargin } = props;
  const classes = useStyles({ additionalMargin });
  return <LinearProgress className={classes.linear} />;
}

BackofficeLinearProgress.defaultProps = {
  additionalMargin: 0,
};

export default BackofficeLinearProgress;
