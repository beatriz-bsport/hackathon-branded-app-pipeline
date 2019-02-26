// @flow
import React, { Component } from 'react';

import { withStyles, Grid, Typography } from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import Avatar from '../Avatar.component';
import type { Profile } from '../../api/types';

const styles = () => ({
  container: {},
});

type Props = {
  consumer: Profile,
};

export class ConsumerRowSummary extends Component<Props> {
  render() {
    const { consumer } = this.props;
    return (
      <Grid container direction="row" alignItems="center" spacing={16}>
        <Grid item>
          <Avatar user={consumer} noname variant="small" />
        </Grid>
        <Grid item>
          <Typography>
            {consumer.first_name} {consumer.last_name}
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(withNamespaces()(ConsumerRowSummary));
