// @ts-nocheck
import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import HourglassEmpty from '@material-ui/icons/HourglassEmpty';
import blue from '@material-ui/core/colors/blue';
import { useTheme } from '@material-ui/core';

type Props = {
  height?: number;
  width?: number;
};

export const ReplacementRequestStatusChip: React.FC<Props> = ({
  height,
  width,
}) => {
  const classes = useStyles();

  const theme = useTheme();

  return (
    <div
      className={classes.chipStatus}
      style={width ? { width: `${width}px` } : {}}
    >
      <HourglassEmpty
        style={
          height
            ? { height: `calc(${height}px - ${theme.spacing(0.5)}px)` }
            : {}
        }
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  chipStatus: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: `${theme.spacing(0.25)}px ${theme.spacing(0.75)}px`,
    borderRadius: theme.spacing(0.5),
    backgroundColor: blue[50],
    color: theme.palette.info.dark,
  },
}));

export default ReplacementRequestStatusChip;
