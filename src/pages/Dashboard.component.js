import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Paper, Grid, Typography } from '@material-ui/core';
import { Camembert, GreatFilter, Histogram } from '../components';
import { activity as activityActions } from '../actions';

import { translate } from 'react-i18next';
import * as d3 from 'd3';
import Moment from 'moment';

export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: Moment()
        .set('hours', 0)
        .set('minutes', 0)
        .set('milliseconds', 0),
    };
  }
  componentDidMount() {
    this.props.fetchActivitiesMinimal();
  }

  onDateClick = (date) => {
    this.setState({ date });
  };

  render() {
    const { t } = this.props;
    const { date } = this.state;
    return (
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Typography variant="display1">Welcome to bsport SaaS</Typography>
        </Grid>
      </Grid>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchActivitiesMinimal() {
      dispatch(activityActions.fetchActivitiesMinimal());
    },
  };
}

export default translate()(connect(null, mapDispatchToProps)(Dashboard));
