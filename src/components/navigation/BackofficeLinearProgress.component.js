// @flow
import React from 'react';
import { LinearProgress, withStyles } from '@material-ui/core';

const styles = (theme) => ({
  linear: {
    margin: -theme.spacing.unit * 2,
    marginLeft: -theme.spacing.unit * 3,
    marginRight: -theme.spacing.unit * 3,
  },
});

export default withStyles(styles)((props: { classes: Object }) => {
  return <LinearProgress className={props.classes.linear} />;
});
