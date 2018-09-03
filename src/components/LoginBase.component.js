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
export class LoginBase extends Component<{}> {
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
              <img className={classes.bsportLogo} src={B_ASSET} />
            </Grid>
            <Grid item>{this.props.children}</Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  }
}

export default withStyles(styles)(LoginBase);
