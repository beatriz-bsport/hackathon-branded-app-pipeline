// @flow

import React, { Component } from 'react';

import Moment from 'moment';
import { compose, withProps, withPropsOnChange } from 'recompose';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

import { withNamespaces } from 'react-i18next';

import {
  bookingStatSelector,
  newMembersStatSelector,
  turnoverStatSelector,
  dateRangeSelector,
  mainChartSelector,
} from '../state/stats/selectors';

import DateRangeFilter from '../components/DateRangeFilter.component';
import { dateRangeChange, mainChartChange } from '../actions/stats.actions';
import Figure from '../components/Figure.component';
import { SimpleBarChart, BarChart } from '../components/Charts.component';

function createChartOptions(identifier, data, domain, color) {
  return {
    name: identifier,
    count: data.total,
    color,
    chart: (
      <SimpleBarChart
        height={80}
        data={data.table}
        domain={domain}
        xKey="d"
        yKey="v"
        color="darkBackground"
      />
    ),
  };
}

type ChartData = {
  d: number,
  v: number,
}[];

type Props = {
  classes: Object,
  t: (x: string) => string,
  dateRange: { start: Moment, end: Moment, kind: string },
  miniStats: { [string]: { table: ChartData, total: number } },
  quickDateFilters: *[],
  changeDateRange: (Moment, Moment, ?string) => void,
  mainChartButtons: *[],
  mainChartData: ChartData,
};

export function Dashboard(props: Props) {
  const { t, classes, dateRange, miniStats, mainChart } = props;
  const { newMembers, turnover, bookings } = miniStats;

  const domain = [
    Moment(dateRange.start)
      .subtract(0.5, 'day')
      .valueOf(),
    Moment(dateRange.end)
      .add(0.5, 'day')
      .valueOf(),
  ];
  const stats1 = [
    createChartOptions('newMembers', newMembers, domain, 'green'),
    createChartOptions('turnover', turnover, domain, 'marine'),
    createChartOptions('bookings', bookings, domain, 'red'),
  ];
  return (
    <div className="dashboard">
      <header>
        <DateRangeFilter
          quickRanges={props.quickDateFilters}
          onChange={props.changeDateRange}
          start={dateRange.start}
          end={dateRange.end}
        />
      </header>
      <br />
      <Grid container direction="row" spacing={16}>
        {stats1.map((stat) => {
          return (
            <Grid key={stat.name} item xs={12} md={4}>
              <Figure name={t(stat.name)} count={stat.count} color={stat.color}>
                {stat.chart}
              </Figure>
            </Grid>
          );
        })}
      </Grid>
      <br />
      <header>
        {props.mainChartButtons.map((button) => (
          <Button
            variant="contained"
            color={button.selected ? 'primary' : 'default'}
            className={classes.headerButton}
            onClick={button.onClick}
          >
            {button.title}
          </Button>
        ))}
      </header>
      <BarChart
        data={props.mainChartData}
        height={400}
        domain={domain}
        xKey="d"
        yKey="v"
        color={getDashboardColor(mainChart)}
      />
    </div>
  );
}

function getDashboardColor(mainChart) {
  return {
    newMembers: 'green',
    turnover: 'marine',
    bookings: 'red',
  }[mainChart];
}

function mapStateToProps(state) {
  return {
    miniStats: {
      bookings: bookingStatSelector(state),
      newMembers: newMembersStatSelector(state),
      turnover: turnoverStatSelector(state),
    },
    dateRange: dateRangeSelector(state),
    mainChart: mainChartSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeDateRange(start, end, kind = 'custom') {
      dispatch(dateRangeChange({ start, end, kind }));
    },
    changeMainChart(chart) {
      dispatch(mainChartChange({ chart }));
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
  withProps(({ mainChart, miniStats }) => ({
    mainChartData: miniStats[mainChart].table,
  })),
  withProps(({ dateRange }) => ({
    quickDateFilters: [
      {
        key: 'current_week',
        start: Moment().subtract(7, 'days'),
        end: Moment(),
        selected: dateRange.kind === 'current_week',
      },
      {
        key: 'current_month',
        start: Moment().subtract(1, 'month'),
        end: Moment(),
        selected: dateRange.kind === 'current_month',
      },
      {
        key: 'last_three_months',
        start: Moment().subtract(3, 'months'),
        end: Moment(),
        selected: dateRange.kind === 'last_three_months',
      },
      {
        key: 'current_year',
        start: Moment().subtract(1, 'year'),
        end: Moment(),
        selected: dateRange.kind === 'current_year',
      },
    ],
  })),
  // Add buttons to select main chart
  withPropsOnChange(
    ['t', 'changeMainChart', 'mainChart'],
    ({ t, mainChart, changeMainChart }) => ({
      mainChartButtons: [
        {
          title: t('newMembers'),
          onClick: () => changeMainChart('newMembers'),
          selected: mainChart === 'newMembers',
        },
        {
          title: t('turnover'),
          onClick: () => changeMainChart('turnover'),
          selected: mainChart === 'turnover',
        },
        {
          title: t('bookings'),
          onClick: () => changeMainChart('bookings'),
          selected: mainChart === 'bookings',
        },
      ],
    }),
  ),
)(Dashboard);
