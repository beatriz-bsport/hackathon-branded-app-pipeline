import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import SPORTS from '@bsport/common/lib/master-data/sports.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Chip } from '@material-ui/core';

const SIZE = 26;
type Props = {
  parentCategory: number;
  SCTName: string;

  variant?: 'default' | 'outlined';

  size?: 'medium' | 'small';
  onDelete?: () => void;
  onClick?: () => void;
};

export function SCTChip(props: Props) {
  const {
    parentCategory,
    variant,
    SCTName,

    size,
    onClick,
    onDelete,
  } = props;
  const sport = SPORTS.filter((s) => s.id === parentCategory)[0];
  const classes = useStyles();

  if (!sport) {
    return <CircularProgress />;
  }
  return (
    <Chip
      avatar={
        sport?.icon ? (
          <img
            alt="coach profile"
            height={SIZE}
            src={sport.icon}
            width={SIZE}
          />
        ) : null
      }
      classes={{
        avatar: classes.avatar,
      }}
      className={classes.chip}
      color="primary"
      label={SCTName || sport.text}
      onClick={onClick}
      onDelete={onDelete}
      size={size || 'medium'}
      variant={variant || 'default'}
    />
  );
}

const useStyles = makeStyles(() => ({
  chip: {
    maxWidth: '100%',
  },

  avatar: {
    backgroundColor: 'transparent!important',
  },
}));

export default SCTChip;
