import React from 'react';

import type { Theme } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import makeStyles from '@material-ui/styles/makeStyles';

type StylesProps = {
  borderRadius?: string;
  size?: string;
};

const customMuiSkeletonStyles = makeStyles<Theme, StylesProps>((theme) => ({
  customMuiSkeleton: {
    display: 'flex',
    borderRadius: ({ borderRadius }) => borderRadius || theme.spacing(1),
    height: ({ size }) => size || theme.spacing(5),
    width: ({ size }) => size || theme.spacing(5),
    minHeight: ({ size }) => size || theme.spacing(5),
    minWidth: ({ size }) => size || theme.spacing(5),
  },
}));

export const CustomMuiSkeletonIconContainer: React.FC<StylesProps> = ({
  borderRadius,
  size,
}) => {
  const classes = customMuiSkeletonStyles({ borderRadius, size });
  return <Skeleton className={classes.customMuiSkeleton} variant="rect" />;
};

export default React.memo(CustomMuiSkeletonIconContainer);
