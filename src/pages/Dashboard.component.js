// @flow
import React, { Component } from 'react';
import chroma from 'chroma-js';

import moment from 'moment-timezone';
import type { Moment } from 'moment-timezone';
import { connect } from 'react-redux';
import { compose, withHandlers, withState, withStateHandlers } from 'recompose';
import { withTranslation } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';

import withStyles from '@material-ui/core/styles/withStyles';
import type { TFunction } from 'react-i18next';

import DateRangeFilter from '../components/DateRangeFilter.component';
import BookingFilters from '../libs/booking/components/BookingFilters.component';
import TemporalAreaChart from '../components/graph/TemporalAreaChart.component';
import TemporalBarChart from '../components/graph/TemporalBarChart.component';
import TimeslotGridChart from '../components/graph/TimeslotGridChart.component';

import withTitle from '../hocs/with-title.hoc';
import {
  // fetchBookingStatistics2 as fetchBookingStatisticsAction,
  fetchBookingTimeslotStatistics as fetchBookingTimeslotStatisticsAction,
  fetchMemberStatistics as fetchMemberStatisticsAction,
  fetchPaymentStatistics as fetchPaymentStatisticsAction,
  fetchPlannedInvoiceStatistics as fetchPlannedInvoiceStatisticsAction,
} from '../actions/stats.actions';
import {
  getStatisticTemporal,
  getStatisticTemporalGrid,
} from '../state/stats/selectors';
import themeSelectors from '../libs/theme/selectors';
import type { Theme } from '../libs/theme/types';
import DashboardChart from '../components/graph/DashboardChart.component';

type range = {
  start: Moment,
  end: Moment,
  kind: string,
};

type Props = {
  t: TFunction,
  classes: Object,
  theme: Theme,
  dateRange: range,
  onDateRangeChange: (Moment, Moment, string) => void,
  makeRefreshKey: (
    identifier: string,
  ) => (dateRange: range, filters: any) => string,

  chartFilters: any,
  setChartFilters: (any) => void,

  // fetchStatBooking_1: () => void,
  fetchStatMember_1: () => void,
  fetchStatBookingTemporalGrid: () => void,
  booking_timeslot: { loading: boolean, data: Array<{ d: string, v: number }> },
  fetchStatPayment_1: () => void,
  fetchStatPlannedInvoice_1: () => void,
  booking_1: { loading: boolean, data: Array<{ d: string, v: number }> },
  member_1: { loading: boolean, data: Array<{ d: string, v: number }> },
  payment_1: { loading: boolean, data: Array<{ d: string, v: number }> },
  plannedInvoice_1: { loading: boolean, data: Array<{ d: string, v: number }> },
};

export class Dashboard extends Component<Props> {
  componentDidMount() {
    // this.props.fetchStatBooking_1();
    this.props.fetchStatBookingTemporalGrid();
    this.props.fetchStatMember_1();
    this.props.fetchStatPayment_1();
    this.props.fetchStatPlannedInvoice_1();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.chartFilters !== this.props.chartFilters ||
      prevProps.dateRange !== this.props.dateRange
    ) {
      // this.props.fetchStatBooking_1();
      this.props.fetchStatBookingTemporalGrid();
    }
    if (prevProps.dateRange !== this.props.dateRange) {
      this.props.fetchStatMember_1();
      this.props.fetchStatPayment_1();
      // this.props.fetchStatPlannedInvoice_1();
    }
  }

  render() {
    const {
      classes,
      // booking_1,
      member_1,
      payment_1,
      plannedInvoice_1,
      t,
      makeRefreshKey,
      theme,
    } = this.props;
    const colorScale = chroma
      .scale([theme.primary_color, theme.secondary_color])
      .mode('lab');
    return (
      <div>
        <AppBar position="static" color="default" className={classes.bar}>
          <DateRangeFilter
            dateRange={this.props.dateRange}
            onChange={this.props.onDateRangeChange}
          />
        </AppBar>
        <Grid container direction="row" spacing={3} className={classes.gridRow}>
          {/*
           <Grid item xs={12} lg={6}>
            <DashboardChart
              title={t('bookings')}
              loading={booking_1.loading}
              filtersComponent={BookingFilters}
              setChartFilters={(f) =>
                this.props.setChartFilters('booking_1', f)
              }
            >
              <TemporalAreaChart
                height={280}
                data={booking_1.data}
                chartOptions={[
                  {
                    dataKey: 'v',
                    caption: t('bookings'),
                    stroke: colorScale(0),
                    fill: colorScale(0),
                  },
                ]}
                yLabel={t('bookings')}
                refreshKey={makeRefreshKey('bookings_1')}
                tooltip
              />
            </DashboardChart>
          </Grid>
          */}
          <Grid item xs={12} lg={6}>
            <DashboardChart title={t('newMembers')} loading={member_1.loading}>
              <TemporalBarChart
                height={329}
                data={member_1.data}
                chartOptions={[
                  {
                    dataKey: 'v',
                    caption: t('newMembers'),
                    stroke: colorScale(0.33),
                    fill: colorScale(0.33),
                  },
                ]}
                yLabel={t('newMembers')}
                refreshKey={makeRefreshKey('member_1')}
                tooltip
              />
            </DashboardChart>
          </Grid>
          <Grid item xs={12} lg={6}>
            <DashboardChart
              title={t('bookingsWeektimeSlot')}
              loading={this.props.booking_timeslot.loading}
              filtersComponent={BookingFilters}
              setChartFilters={(f) =>
                this.props.setChartFilters('booking_timeslot', f)
              }
            >
              <TimeslotGridChart
                height={280}
                data={this.props.booking_timeslot.data}
                tooltip
              />
            </DashboardChart>
          </Grid>
        </Grid>
        <Grid container direction="row" spacing={3} className={classes.gridRow}>
          <Grid item xs={12} lg={6}>
            <DashboardChart
              title={t('turnoverTitle')}
              loading={payment_1.loading}
              popoverText={t('popover.turnover')}
            >
              <TemporalAreaChart
                height={329}
                data={payment_1.data}
                chartOptions={[
                  {
                    dataKey: 'v',
                    caption: t('turnover'),
                    stroke: colorScale(0.66),
                    fill: colorScale(0.66),
                  },
                ]}
                yLabel={t('turnover')}
                refreshKey={makeRefreshKey('payment_1')}
                tooltip
              />
            </DashboardChart>
          </Grid>
          <Grid item xs={12} lg={6}>
            <DashboardChart
              title={t('billedSubscriptions')}
              loading={plannedInvoice_1.loading}
              popoverText={t('popover.billedSubscriptions')}
            >
              <TemporalBarChart
                height={329}
                data={plannedInvoice_1.data}
                chartOptions={[
                  {
                    dataKey: 'v',
                    caption: t('billedSubscriptions'),
                    stroke: colorScale(0.99),
                    fill: colorScale(0.99),
                  },
                ]}
                yLabel={t('billedSubscriptions')}
                refreshKey={makeRefreshKey('plannedInvoice_1')}
                tooltip
              />
            </DashboardChart>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const styles = (theme) => ({
  bar: {
    width: `calc(100% + ${theme.spacing(6)}px)`,
    marginTop: -theme.spacing(2),
    marginRight: -theme.spacing(3),
    marginLeft: -theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  graph: {
    paddingRight: theme.spacing(2),
  },
  filter: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  gridRow: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  skeleton: {
    display: 'flex',
    justifyContent: 'center',
  },
  title: {
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  infoIcon: {
    marginLeft: theme.spacing(2),
  },
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['dashboard']),
  withStyles(styles),
  withState('dateRange', 'setDateRange', {
    start: moment().subtract(1, 'years'),
    end: moment(),
    kind: 'current_year',
  }),
  withStateHandlers(
    { chartFilters: {} },
    {
      setChartFilters: ({ chartFilters }) => (identifier, filters) => {
        return {
          chartFilters: {
            ...chartFilters,
            [identifier]: filters,
          },
        };
      },
    },
  ),
  withState('open', 'setOpen', {}),
  connect(
    (state, { dateRange }) => ({
      theme: themeSelectors.getTheme(state),
      // booking_1: getStatisticTemporal(state, 'booking_1', dateRange),
      booking_timeslot: getStatisticTemporalGrid(
        state,
        'booking_timeslot',
        dateRange,
      ),
      member_1: getStatisticTemporal(state, 'member-1', dateRange),
      payment_1: getStatisticTemporal(state, 'payment-1', dateRange),
      plannedInvoice_1: getStatisticTemporal(state, 'planned-invoice-1', {
        start: moment()
          .subtract(1, 'years')
          .startOf('month'),
        end: moment().endOf('month'),
      }),
    }),
    {
      //   fetchBookingStatistics: fetchBookingStatisticsAction,
      fetchBookingTimeslotStatistics: fetchBookingTimeslotStatisticsAction,
      fetchMemberStatistics: fetchMemberStatisticsAction,
      fetchPaymentStatistics: fetchPaymentStatisticsAction,
      fetchPlannedInvoiceStatistics: fetchPlannedInvoiceStatisticsAction,
    },
  ),
  withHandlers({
    onDateRangeChange: ({ setDateRange }) => (start, end, kind = 'custom') => {
      setDateRange({ start, end, kind });
    },
    setOpenValue: ({ setOpen, open }) => (name: string) => {
      setOpen({
        ...open,
        [name]: !open[name],
      });
    },
    makeRefreshKey: ({ dateRange, chartFilters }) => (identifier) => () => {
      return `${dateRange.start.format('YYYY-MM-DD')}:${dateRange.end.format(
        'YYYY-MM-DD',
      )}/${Object.keys(chartFilters[identifier]).join('-')}:${Object.values(
        chartFilters[identifier],
      ).join('-')}`;
    },
    // fetchStatBooking_1: ({
    //   dateRange,
    //   chartFilters,
    //   fetchBookingStatistics,
    // }) => () => {
    //   fetchBookingStatistics('booking_1', {
    //     ...(chartFilters.booking_1 || {}),
    //     min_date: dateRange.start.format('YYYY-MM-DD'),
    //     max_date: dateRange.end.format('YYYY-MM-DD'),
    //     date_field: 'offer__date_start',
    //     kind: 'count',
    //   });
    // },
    fetchStatBookingTemporalGrid: ({
      dateRange,
      chartFilters,
      fetchBookingTimeslotStatistics,
    }) => () => {
      fetchBookingTimeslotStatistics('booking_timeslot', {
        ...(chartFilters.booking_timeslot || {}),
        min_date: dateRange.start.format('YYYY-MM-DD'),
        max_date: dateRange.end.format('YYYY-MM-DD'),
        date_field: 'offer__date_start',
      });
    },
    fetchStatMember_1: ({ dateRange, fetchMemberStatistics }) => () => {
      fetchMemberStatistics('member-1', {
        date_field: 'date_joined',
        date_joined__gte: dateRange.start.format('YYYY-MM-DD'),
        date_joined__lte: dateRange.end.format('YYYY-MM-DD'),
        kind: 'count',
        aggregate_period: 'day',
      });
    },
    fetchStatPayment_1: ({ dateRange, fetchPaymentStatistics }) => () => {
      fetchPaymentStatistics('payment-1', {
        date_field: 'date',
        date__gte: dateRange.start.format('YYYY-MM-DD'),
        date__lte: dateRange.end.format('YYYY-MM-DD'),
        kind: 'field_value',
        field_value: 'price',
        aggregate_period: 'day',
        aggregate_function: 'sum',
      });
    },
    fetchStatPlannedInvoice_1: ({
      // dateRange,
      fetchPlannedInvoiceStatistics,
    }) => () => {
      fetchPlannedInvoiceStatistics('planned-invoice-1', {
        date_field: 'invoice__date',
        date_month_inclusive__gte: moment()
          .subtract(1, 'years')
          .format('YYYY-MM-DD'),
        date_month_inclusive__lte: moment().format('YYYY-MM-DD'),
        kind: 'count',
      });
    },
  }),
  withTitle(({ t }: { t: TFunction }) => t('titles:dashboard.dashboard')),
)(Dashboard);
