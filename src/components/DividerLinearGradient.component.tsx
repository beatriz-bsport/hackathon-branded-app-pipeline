import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

export const DividerLinearGradient = (props) => {
  const classes = useStyles();
  return (
    <div className={props.classes}>
      <div className={classes.divider} />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  divider: {
    height: 1,
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  },
}));

export default DividerLinearGradient;
