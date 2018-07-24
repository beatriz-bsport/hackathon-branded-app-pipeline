import React from 'react';

import { Paper, Typography, withStyles } from '@material-ui/core';

const styles = (theme) => ({
  paper: {
    spacing: theme.spacing.unit * 2,
  },
});

export function Camembert(props) {
  const { classes } = props;
  return (
    <Paper className={classes.paper}>
      <Typography variant="title">Camembert</Typography>
      <Typography>
        <br />
        <br />
        fezfjeiofjezoifj<br />eziofjeoizjf<br />
        <br />
      </Typography>
    </Paper>
  );
}

export default withStyles(styles)(Camembert);
