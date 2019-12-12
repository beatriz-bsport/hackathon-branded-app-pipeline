// @flow

import React from 'react';

import moment from 'moment';
import type { Moment } from 'moment';
import {
  compose,
  withProps,
  withPropsOnChange,
  withState,
  lifecycle,
} from 'recompose';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import withStyles from '@material-ui/core/styles/withStyles';

import {
  bookingStatSelector,
  newMembersStatSelector,
  turnoverStatSelector,
  dateRangeSelector,
} from '../state/stats/selectors';

import DateRangeFilter from '../components/DateRangeFilter.component';
import {
  dateRangeChange,
  fetchDashboard as fetchDashboardStats,
} from '../actions/stats.actions';
import Figure from '../components/graph/Figure.component';
import {
  ComposedChart,
  SimpleBarChart,
} from '../components/graph/Charts.component';

import withTitle from '../hocs/with-title.hoc';

type ChartData = {
  d: number,
  v: number,
}[];

type Props = {
  classes: Object,
  t: TFunction,
  tab: ?number,
  setTab: (value: number) => void,
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
    return (d) => `Semaine du ${moment(d).format('DD MMM YYYY')}`;
  }
  return (d) => moment(d).format('ddd DD MMM');
}

const chartConfigs = {
  newMembers: {
    color: 'green',
    xFormat: dateFormatter,
    yFormat: (v) => Math.ceil(v),
    yLabel: 'Nouveaux membres',
  },
  turnover: {
    color: 'blue',
    xFormat: dateFormatter,
    yFormat: (v) => `${Math.ceil(v)} €`,
    yLabel: 'CA',
  },
  bookings: {
    color: 'red',
    xFormat: dateFormatter,
    yFormat: (v) => Math.ceil(v),
    yLabel: 'Réservations',
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
  const { t, classes, dateRange, miniStats, tab, setTab } = props;
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
      <AppBar position="static" color="default" className={classes.bar}>
        <DateRangeFilter
          quickRanges={props.quickDateFilters}
          onChange={props.changeDateRange}
          start={dateRange.start}
          end={dateRange.end}
        />
      </AppBar>
      <div className={classes.block}>
        <Grid container direction="row" spacing={16}>
          {stats1.map((stat) => {
            return (
              <Grid key={stat.name} item xs={12} md={4}>
                <Figure
                  name={t(stat.name)}
                  count={stat.count}
                  color={stat.color}
                >
                  {stat.chart}
                </Figure>
              </Grid>
            );
          })}
        </Grid>
      </div>
      <div className={classes.block}>
        <AppBar position="static" color="default">
          <Tabs
            value={tab}
            onChange={(event, value) => {
              setTab(value);
              props.mainChartButtons[value].onClick();
            }}
            indicatorColor="primary"
            textColor="primary"
          >
            {props.mainChartButtons.map((button) => (
              <Tab key={button.title} label={button.title} />
            ))}
          </Tabs>
        </AppBar>
        <Paper className={classes.mainChartPaper}>
          <ComposedChart
            data={props.mainChartData.table}
            height={400}
            domain={domain}
            xKey="d"
            yKey="v"
            yLabel={mainChartOptions.yLabel}
            yFormatter={mainChartOptions.yFormat}
            xFormatter={mainChartOptions.xFormat(props.mainChartData.formatter)}
            color={mainChartOptions.color}
          />
        </Paper>
      </div>
    </div>
  );
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
  block: {
    marginBottom: theme.spacing.unit * 4,
  },
  title: {
    marginBottom: theme.spacing.unit,
  },
  bar: {
    width: `calc(100% + ${theme.spacing.unit * 6}px)`,
    marginTop: -theme.spacing.unit * 2,
    marginRight: -theme.spacing.unit * 3,
    marginLeft: -theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
  },
  mainChartPaper: {
    borderRadius: '0 0 4px 4px',
  },
});

export default compose(
  withStyles(styles),
  withNamespaces('dashboard'),
  withState('mainChart', 'changeMainChart', 'turnover'),
  connect(
    (state) => ({
      miniStats: {
        bookings: bookingStatSelector(state),
        newMembers: newMembersStatSelector(state),
        turnover: turnoverStatSelector(state),
      },
      dateRange: dateRangeSelector(state),
    }),
    {
      fetchDashboardStats,
      changeDateRange: (start, end, kind = 'custom') =>
        dateRangeChange({ start, end, kind }),
    },
  ),
  lifecycle({
    componentDidMount() {
      this.props.fetchDashboardStats();
    },
  }),
  withProps(({ mainChart, miniStats }) => ({
    mainChartOptions: chartConfigs[mainChart],
    mainChartData: miniStats[mainChart] || { table: [] },
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
  withState(
    'tab',
    'setTab',
    ({ mainChart }) =>
      ({
        newMembers: 0,
        turnover: 1,
        bookings: 2,
      }[mainChart]),
  ),
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
  withTitle(({ t }: { t: TFunction }) => t('titles:dashboard.dashboard')),
)(Dashboard);
