import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Grid, Typography, withStyles } from '@material-ui/core';
import StarFull from '@material-ui/icons/Star';
import StarEmpty from '@material-ui/icons/StarBorder';
import { translate } from 'react-i18next';

import { Avatar } from '../components';

const styles = (theme) => ({
  container: {},
});

export class Review extends Component<Props> {
  render() {
    const { review, classes, t } = this.props;
    const { user, comment, rating } = review;
    return (
      <Grid container direction="column" spacing={24}>
        <Grid item xs={12}>
          <Grid
            container
            direction="row"
            alignItems="center"
            justify="space-between"
            style={{ width: '100%' }}
          >
            <Grid item>
              <Grid
                container
                direction="row"
                alignItems="center"
                justify="flex-start"
                spacing={16}
              >
                <Grid item>
                  <Avatar user={user} noname />
                </Grid>
                <Grid item>
                  <Typography>{user.name}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <StarFull />
              {rating >= 2 ? <StarFull /> : <StarEmpty />}
              {rating >= 3 ? <StarFull /> : <StarEmpty />}
              {rating >= 4 ? <StarFull /> : <StarEmpty />}
              {rating >= 5 ? <StarFull /> : <StarEmpty />}
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

export default withStyles(styles)(translate()(Review));
