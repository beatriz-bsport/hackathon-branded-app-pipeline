// @flow
import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import StarFull from '@material-ui/icons/Star';
import StarEmpty from '@material-ui/icons/StarBorder';

import Avatar from './Avatar.component';
import type { Review as ReviewType } from '../api/types';

type Props = {
  review: ReviewType,
};

export default class Review extends Component<Props> {
  render() {
    const { review } = this.props;
    const { user, comment, rating } = review;
    return (
      <Grid container direction="column" spacing={3}>
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
                spacing={2}
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
