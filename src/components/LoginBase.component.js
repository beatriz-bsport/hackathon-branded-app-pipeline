// @flow
import React, { Component } from 'react';

import { Paper, Grid, withStyles } from '@material-ui/core';

import B_ASSET from '../public/images/b_dark.jpg';

const styles = () => ({
  container: {
    marginTop: 50,
    marginBottom: 50,
  },
  bsportLogo: {
    marginTop: 30,
    height: 80,
    width: 80,
  },
});

type Props = {
  children: Object,
  classes: Object,
};
export class LoginBase extends Component<Props> {
  render() {
    const { classes } = this.props;
    return (
      <Grid
        container
        item
        justify="center"
        alignItems="center"
        className={classes.container}
      >
        <Paper>
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <img
                className={classes.bsportLogo}
                src={B_ASSET}
                alt="bsport logo"
              />
            </Grid>
            <Grid item>{this.props.children}</Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  }
}

export default withStyles(styles)(LoginBase);
