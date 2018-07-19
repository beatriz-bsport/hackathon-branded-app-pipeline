import React, { Component } from 'react';

import { Paper, Grid, Typography } from '@material-ui/core';
import { Camembert, GreatFilter, Histogram } from '../components';

import { translate } from 'react-i18next';
import * as d3 from 'd3';

export class Dashboard extends Component {
  componentDidMount() {
    this.renderBookingBar();
  }

  renderBookingBar = () => {};

  render() {
    const { t } = this.props;
    return (
      <Grid container spacing={24}>
        <Typography variant="display1">Welcome to bsport SaaS</Typography>
      </Grid>
    );
  }
}

export default translate()(Dashboard);
