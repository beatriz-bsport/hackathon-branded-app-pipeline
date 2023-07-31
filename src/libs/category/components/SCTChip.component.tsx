// @flow
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import SPORTS from '@bsport/common/lib/master-data/sports';
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
      classes={{
        avatar: classes.avatar,
      }}
      label={SCTName || sport.text}
      size={size || 'medium'}
      color="primary"
      onDelete={onDelete}
      onClick={onClick}
      avatar={
        sport?.icon ? (
          <img
            src={sport.icon}
            height={SIZE}
            width={SIZE}
            alt="coach profile"
          />
        ) : null
      }
      variant={variant || 'default'}
      className={classes.chip}
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
