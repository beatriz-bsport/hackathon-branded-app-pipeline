// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';

import ConsumerProfile from '../../components/consumer/Profile.component';
import type { Profile } from '../../api/types';

const styles = () => ({
  container: {},
});

type Props = {
  profile: Profile,
};

export class MyProfile extends Component<Props> {
  render() {
    const { profile } = this.props;
    if (profile === null) {
      return (
        <Grid container item alignItems="center" justify="center">
          <CircularProgress />
        </Grid>
      );
    }
    return (
      <Grid container direction="column" spacing={16}>
        <Grid item xs={12} lg={6}>
          <ConsumerProfile profile={profile} />
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.consumer.profile,
  };
}

export default withStyles(styles)(
  withNamespaces()(connect(mapStateToProps)(MyProfile)),
);
