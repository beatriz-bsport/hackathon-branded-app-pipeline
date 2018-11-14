// @flow

import React, { Component } from 'react';

import Moment from 'moment';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import { translate, withNamespaces } from 'react-i18next';

import {
  bookingStatSelector,
  newMembersStatSelector,
  turnoverStatSelector,
  dateRangeSelector,
} from '../state/stats/selectors';

import DateRangeFilter from '../components/DateRangeFilter.component';
import { dateRangeChange } from '../actions/stats.actions';
import Figure from '../components/Figure.component';
import {
  SimpleBarChart,
  SimpleLineChart,
  SimpleAreaChart,
  BarChart,
} from '../components/Charts.component';

type Props = {
  loading: boolean,
  stats: Object,
  classes: Object,
  t: (x: string) => string,
};
export class Dashboard extends Component<Props> {
  render() {
    const { loading, stats, t, classes } = this.props;

    // FIXME set loading on all reducers state at logoff
    if (loading || !stats.previous_week) {
      return <CircularProgress />;
    }

    const data1 = [
      { name: 'Décembre', uv: 3490, pv: 4300, amt: 2100 },
      { name: 'Janvier', uv: 4000, pv: 2400, amt: 2400 },
      { name: 'Février', uv: 3000, pv: 1398, amt: 2210 },
      { name: 'Mars', uv: 2000, pv: 9800, amt: 2290 },
      { name: 'Avril', uv: 2780, pv: 3908, amt: 2000 },
      { name: 'Mai', uv: 1890, pv: 4800, amt: 2181 },
      { name: 'Juin', uv: 2390, pv: 3800, amt: 2500 },
      { name: 'Juillet', uv: 3490, pv: 4300, amt: 2100 },
      { name: 'Septembre', uv: 3490, pv: 4300, amt: 2100 },
      { name: 'Octobre', uv: 3490, pv: 4300, amt: 2100 },
      { name: 'Novembre', uv: 3490, pv: 4300, amt: 2100 },
    ];
    const stats1 = [
      {
        name: t('newMembers'),
        count: this.props.miniStats.newMembers.total,
        color: 'green',
        chart: (
          <SimpleAreaChart
            height={80}
            data={this.props.miniStats.newMembers.table}
            xKey="d"
            yKey="v"
            color="darkBackground"
          />
        ),
      },
      {
        name: t('turnover'),
        count: this.props.miniStats.turnover.total,
        color: 'marine',
        chart: (
          <SimpleLineChart
            height={80}
            data={this.props.miniStats.turnover.table}
            domain={[
              this.props.dateRange.start.valueOf(),
              this.props.dateRange.end.valueOf(),
            ]}
            xKey="d"
            yKey="v"
            color="darkBackground"
          />
        ),
      },
      {
        name: t('nbBookings'),
        count: this.props.miniStats.bookings.total,
        color: 'red',
        chart: (
          <SimpleLineChart
            height={80}
            data={this.props.miniStats.bookings.table}
            domain={[
              this.props.dateRange.start.valueOf(),
              this.props.dateRange.end.valueOf(),
            ]}
            xKey="d"
            yKey="v"
            color="darkBackground"
          />
        ),
      },
    ];
    return (
      <div className="dashboard">
        <header>
          <DateRangeFilter
            quickRanges={this.props.quickDateFilters}
            onChange={this.props.changeDateRange}
            start={this.props.dateRange.start}
            end={this.props.dateRange.end}
          />
        </header>
        <br />
        <Grid container direction="row" spacing={16}>
          {stats1.map((stat) => {
            return (
              <Grid key={stat.name} item xs={12} md={4}>
                <Figure name={stat.name} count={stat.count} color={stat.color}>
                  {stat.chart}
                </Figure>
              </Grid>
            );
          })}
        </Grid>
        <br />
        <header>
          <Button
            variant="contained"
            color="primary"
            className={classes.headerButton}
          >
            Chiffres d\'affaire
          </Button>
          <Button variant="contained" className={classes.headerButton}>
            Churn
          </Button>
          <Button variant="contained" className={classes.headerButton}>
            Engagement
          </Button>
          <Button variant="contained" className={classes.headerButton}>
            Publicité
          </Button>
        </header>
        <BarChart
          data={data1}
          height={400}
          bars={[
            { key: 'amt', name: '2016', color: 'yellow' },
            { key: 'pv', name: '2017', color: 'red' },
            { key: 'uv', name: '2018', color: 'blue' },
          ]}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    miniStats: {
      bookings: bookingStatSelector(state),
      newMembers: newMembersStatSelector(state),
      turnover: turnoverStatSelector(state),
    },
    dateRange: dateRangeSelector(state),
    stats: state.stats.dashboard,
    loading: state.stats.dashboardLoading,
    quickDateFilters: [
      {
        key: 'current_week',
        start: Moment().subtract(7, 'days'),
        end: Moment(),
      },
      {
        key: 'current_month',
        start: Moment().subtract(1, 'month'),
        end: Moment(),
      },
      {
        key: 'last_three_months',
        start: Moment().subtract(3, 'months'),
        end: Moment(),
      },
      {
        key: 'current_year',
        start: Moment().subtract(1, 'year'),
        end: Moment(),
      },
    ],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeDateRange(start, end) {
      dispatch(dateRangeChange({ start, end }));
    },
  };
}

const styles = (theme) => ({
  container: {},
  statPaper: {
    padding: theme.spacing.unit * 3,
  },
  headerButton: {
    margin: theme.spacing.unit,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces('dashboard'),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Dashboard);
