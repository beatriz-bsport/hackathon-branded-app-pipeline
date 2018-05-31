import React, { Component } from 'react';

import { Paper, Grid } from '@material-ui/core';
import { Camembert, Histogram } from '../components';

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
      <Grid container>
        <Paper style={{ margin: 20 }}>
          <Camembert data={[]} />
          <svg className="bla" />
        </Paper>
        <Paper style={{ margin: 20 }}>
          <Histogram data={[]} />
        </Paper>
      </Grid>
    );
  }
}

export default translate()(Dashboard);
