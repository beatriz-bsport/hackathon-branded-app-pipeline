import React from 'react';

import type { Theme } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import makeStyles from '@material-ui/styles/makeStyles';

type StylesProps = {
  borderRadius?: string;
  height?: string;
  width?: string;
};

const customMuiSkeletonStyles = makeStyles<Theme, StylesProps>((theme) => ({
  customMuiSkeleton: {
    borderRadius: ({ borderRadius }) => borderRadius || '4px',
    height: ({ height }) => height || theme.spacing(2),
    width: ({ width }) => width || '100%',
    transform: 'none',
    transformOrigin: 'none',
  },
}));

export const CustomMuiSkeletonText: React.FC<StylesProps> = ({
  borderRadius,
  height,
  width,
}) => {
  const classes = customMuiSkeletonStyles({ borderRadius, height, width });
  return <Skeleton className={classes.customMuiSkeleton} variant="text" />;
};

export default React.memo(CustomMuiSkeletonText);
