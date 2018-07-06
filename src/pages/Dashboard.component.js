import React, { Component } from 'react';

import { Paper, Grid } from '@material-ui/core';
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
        <GreatFilter />
        <Grid item xs={12} md={6}>
          <Camembert data={[]} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Histogram data={[]} />
        </Grid>
      </Grid>
    );
  }
}

export default translate()(Dashboard);
