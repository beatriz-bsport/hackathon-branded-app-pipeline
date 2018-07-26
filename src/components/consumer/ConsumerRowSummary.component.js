import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles, Grid, IconButton, Typography } from '@material-ui/core';
import { translate } from 'react-i18next';
import { Avatar } from '../../components';

const styles = (theme) => ({
  container: {},
});

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

export default withStyles(styles)(translate()(ConsumerRowSummary));
