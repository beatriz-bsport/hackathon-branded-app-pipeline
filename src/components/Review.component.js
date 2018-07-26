import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Grid, Typography, withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';

import { Avatar } from '../components';

const styles = (theme) => ({
  container: {},
});

export class PaymentPack extends Component<Props> {
  render() {
    const { review, classes, t } = this.props;
    const { user, comment, rating } = review;
    return (
      <Grid container direction="column" alignItems="flex-start" spacing={24}>
        <Grid item>
          <Grid container direction="row" spacing={16} alignItems="center">
            <Grid item>
              <Avatar user={user} noname />
            </Grid>
            <Grid item>
              <Typography>{user.name}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Typography>{comment}</Typography>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(translate()(PaymentPack));
