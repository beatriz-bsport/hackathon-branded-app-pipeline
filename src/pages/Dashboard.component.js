// @flow

import React from 'react';

import moment from 'moment';
import type { Moment } from 'moment';
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
import Figure from '../components/graph/Figure.component';
import { SimpleBarChart, BarChart } from '../components/graph/Charts.component';

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
  mainChartOptions: Object,
};

function dateFormatter(kind) {
  if (kind === 'month') {
    return (d) => moment(d).format('MMM YYYY');
  }
  if (kind === 'week') {
    return (d) => `Semaine ${moment(d).format('W')}`;
  }
  return (d) => moment(d).format('ddd DD MMM');
}

const chartConfigs = {
  newMembers: {
    color: 'green',
    xFormat: dateFormatter,
    yFormat: (v) => Math.ceil(v),
    label: 'Nombre',
  },
  turnover: {
    color: 'marine',
    xFormat: dateFormatter,
    yFormat: (v) => `${v.toFixed(2)} €`,
    label: 'CA',
  },
  bookings: {
    color: 'red',
    xFormat: dateFormatter,
    yFormat: (v) => Math.ceil(v),
    label: 'Nombre',
  },
};

function createChartOptions(identifier, data, domain) {
  const options = chartConfigs[identifier];
  return {
    name: identifier,
    count: options.yFormat(data.total),
    color: options.color,
    chart: (
      <SimpleBarChart
        height={80}
        data={data.table}
        domain={domain}
        xFormatter={options.xFormat(data.formatter)}
        yFormatter={options.yFormat}
        xKey="d"
        yKey="v"
        color="darkBackground"
      />
    ),
  };
}

export function Dashboard(props: Props) {
  const { t, classes, dateRange, miniStats } = props;
  const { mainChartOptions } = props;
  const { newMembers, turnover, bookings } = miniStats;

  const domain = [
    moment(dateRange.start)
      .subtract(0.5, 'day')
      .valueOf(),
    moment(dateRange.end)
      .add(0.5, 'day')
      .valueOf(),
  ];
  const stats1 = [
    createChartOptions('newMembers', newMembers, domain),
    createChartOptions('turnover', turnover, domain),
    createChartOptions('bookings', bookings, domain),
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
      <header className={classes.header}>
        {props.mainChartButtons.map((button) => (
          <Button
            key={button.title}
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
        data={props.mainChartData.table}
        height={400}
        domain={domain}
        xKey="d"
        yKey="v"
        label={mainChartOptions.label}
        yFormatter={mainChartOptions.yFormat}
        xFormatter={mainChartOptions.xFormat(props.mainChartData.formatter)}
        color={mainChartOptions.color}
      />
    </div>
  );
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
  header: {
    marginBottom: theme.spacing.unit * 2,
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
    mainChartOptions: chartConfigs[mainChart],
    mainChartData: miniStats[mainChart],
  })),
  withProps(({ dateRange }) => ({
    quickDateFilters: [
      {
        key: 'current_week',
        start: moment().subtract(7, 'days'),
        end: moment(),
        selected: dateRange.kind === 'current_week',
      },
      {
        key: 'current_month',
        start: moment().subtract(1, 'month'),
        end: moment(),
        selected: dateRange.kind === 'current_month',
      },
      {
        key: 'last_three_months',
        start: moment().subtract(3, 'months'),
        end: moment(),
        selected: dateRange.kind === 'last_three_months',
      },
      {
        key: 'current_year',
        start: moment().subtract(1, 'year'),
        end: moment(),
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
