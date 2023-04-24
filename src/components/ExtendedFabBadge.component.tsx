// @ts-nocheck
import React from 'react';
import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
  badgeValue: number | string;
};

const ExtendedFabBadge: React.FC<Props> = (props: Props) => {
  const { badgeValue } = props;
  const displayBadge =
    (typeof badgeValue === 'number' && badgeValue > 0) ||
    (typeof badgeValue === 'string' && badgeValue);
  const classes = useStyles();
  return displayBadge && <div className={classes.badge}>{badgeValue}</div>;
};

const useStyles = makeStyles((theme: Theme) => ({
  badge: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    boxSizing: 'border-box',
    padding: '0 6px',
    fontSize: theme.typography.pxToRem(12),
    height: 20,
    borderRadius: 10,
    top: 5,
    right: 4,
    transform: 'scale(1) translate(50%, -50%)',
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}));

export default ExtendedFabBadge;
