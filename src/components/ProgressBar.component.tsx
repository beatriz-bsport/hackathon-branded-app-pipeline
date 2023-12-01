import React from 'react';

import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';

type Props = {
  count: number;
  customColor?: string;
  disabled?: boolean;
  minimumWidth?: boolean;
};

type StylesProps = {
  customColor?: string;
  disabled?: boolean;
  minimumWidth?: boolean;
};

export const ProgressBar: React.FC<Props> = ({
  count,
  customColor,
  disabled,
  minimumWidth,
}) => {
  const classes = useStyles({ customColor, disabled, minimumWidth });

  return (
    <div className={classes.progressBarContainer}>
      <div className={classes.bar} />
      <div className={classes.count}>{count}</div>
    </div>
  );
};

const useStyles = makeStyles<Theme, StylesProps>((theme) => ({
  progressBarContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
    color: ({ customColor }) => customColor ?? theme.palette.info.main,
    height: '28px',
    alignItems: 'center',
    opacity: ({ disabled }) => (disabled ? 0.5 : 1),
  },
  bar: {
    backgroundColor: ({ customColor }) =>
      customColor ?? theme.palette.info.main,
    width: ({ minimumWidth }) => (minimumWidth ? theme.spacing(1) : '100%'),
    borderBottomRightRadius: theme.spacing(2),
    borderTopRightRadius: theme.spacing(2),
    height: theme.spacing(2),
  },
  count: {
    lineHeight: 'normal',
    fontSize: theme.spacing(2),
  },
}));

export default React.memo(ProgressBar);
