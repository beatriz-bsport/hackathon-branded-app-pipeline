import React, { Component } from 'react';

import { Paper, Grid } from '@material-ui/core';

import B_ASSET from '../public/images/b_dark.jpg';

export default class LoginBase extends Component<{}> {
  render() {
    return (
      <Grid container direction="column" justify="center" alignItems="center">
        <Paper style={{ margin: 50, padding: 30 }}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <img style={{ height: 80, width: 80 }} src={B_ASSET} />
            {this.props.children}
            <Grid container direction="column" />
          </Grid>
        </Paper>
      </Grid>
    );
  }
}
