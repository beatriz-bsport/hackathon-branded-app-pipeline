import React from 'react';
import { makeStyles } from '@material-ui/core';
import chroma from 'chroma-js';
import MuiIconComponent from '#components/MuiIcon.component';

export const CustomStarIcon: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.upsellIconContainer}>
      <MuiIconComponent className={classes.upsellIcon} icon="Star" />
    </div>
  );
};

const useStyles = makeStyles(() => ({
  upsellIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    backgroundColor: chroma('#FFD600').alpha(0.09).hex(),
    width: '110px',
    height: '110px',
  },
  upsellIcon: {
    fontSize: '72px',
    color: '#FFD600',
  },
}));

export default React.memo(CustomStarIcon);
