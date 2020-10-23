// @flow
import React, { Component } from 'react';
import chroma from 'chroma-js';
import moment from 'moment-timezone';

import { compose, withHandlers } from 'recompose';
import { withTranslation } from 'react-i18next';

import Grid from '@material-ui/core/Grid';

import withStyles from '@material-ui/core/styles/withStyles';
import type { TFunction } from 'react-i18next';

import {
  BOOKING_SOURCE_APP,
  BOOKING_SOURCE_WEB,
  BOOKING_SOURCE_SAAS,
  BOOKING_SOURCE_OTHER,
  BOOKING_SOURCE_MIGRATION,
} from '@bsport/common/lib/master-data/booking_source';

import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
  BUYABLE_ITEM_FEE,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_COUPON,
  BUYABLE_ITEM_COMBO_ITEM,
} from '@bsport/common/lib/master-data/buyable-items';
import withTitle from '../hocs/with-title.hoc';
import type { Theme } from '../libs/theme/types';
import DashboardChart from '../components/graph/DashboardChart.component';
import withDashboardGraphs from '../libs/dashboard/hoc/dashboard-graphs-hoc';
import { graphRessources } from '../libs/dashboard/chart-ressources';

type Props = {
  t: TFunction,
  classes: Object,
  theme: Theme,

  chartFilters: any,
  setChartFilters: (any) => void,

  dashboardGraphs: Array<{
    name: string,
    ressourceIdentifier: string,
    baseFilters: any,
    dateFiltersName: any,
    dateRange?: any,
  }>,
  graphRessources: any,
  chartProps: any,
  chartRanges: { [string]: { start: string, end: string } },
  boundActions: { [string]: (identifier: string, params: any) => void },
  data: { [string]: any },
  chartProps: { [string]: any },
  setchartRanges: any,
  fetchStatistics: (graph: any) => void,
  setParticularChartFilter: (identifier: string) => (filters: any) => void,
  setParticularRange: (
    identifier: string,
    timeSettings: string,
  ) => (range: any) => void,
};

// next step: this array will be fetched (JSON) from the back. We will need to
// get it from store and apply the replaceDates function to replace dates when
// dateRange !== 'custom'
const dashboardGraphs = [
  {
    name: 'turnover',
    ressourceIdentifier: 'temporalBarChartPayment',
    baseFilters: {
      date_field: 'date',
      kind: 'field_value',
      field_value: 'price',
      aggregate_period: 'day',
      aggregate_function: 'sum',
    },
    dateFiltersName: {
      start: 'date__gte',
      end: 'date__lte',
    },
    defaultRange: {
      start: moment()
        .subtract(1, 'years')
        .format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      kind: 'current_year',
    },
  },
  {
    name: 'booking_timeslot',
    ressourceIdentifier: 'temporalTimeslotBooking',
    baseFilters: {
      date_field: 'offer__date_start',
    },
    dateFiltersName: {
      start: 'min_date',
      end: 'max_date',
    },
    defaultRange: {
      start: moment()
        .subtract(1, 'years')
        .format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      kind: 'current_year',
    },
    defaultFilters: {},
  },
  {
    name: 'booking_qualitative',
    ressourceIdentifier: 'pieChartBooking',
    baseFilters: {
      dropdown_field: 'source',
      kind: 'count',
    },
    dateFiltersName: {
      start: 'date__gte',
      end: 'date__lte',
    },
    defaultRange: {
      start: moment()
        .subtract(1, 'years')
        .format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      kind: 'current_year',
    },
    defaultFilters: { booking_status_code__in: [0] },
  },
  {
    name: 'invoice_item',
    ressourceIdentifier: 'pieChartInvoiceItem',
    baseFilters: {
      kind: 'field_value',
      dropdown_field: 'buyable_item_identifier',
      value_field: 'total_price',
      aggregate_function: 'sum',
    },
    dateFiltersName: {
      start: 'invoice__payments__date__gte',
      end: 'invoice__payments__date__lte',
    },
    defaultRange: {
      start: moment()
        .subtract(1, 'years')
        .format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      kind: 'current_year',
    },
  },
  {
    name: 'billed_subscriptions',
    ressourceIdentifier: 'temporalBarChartPlannedInvoice',
    baseFilters: {
      date_field: 'invoice__date',
      kind: 'count',
    },
    dateFiltersName: {
      start: 'date_month_inclusive__gte',
      end: 'date_month_inclusive__lte',
    },
    defaultRange: {
      start: moment()
        .subtract(1, 'years')
        .format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      kind: 'current_year',
    },
  },
  {
    name: 'subscription_turnover',
    ressourceIdentifier: 'temporalBarChartPayment',
    baseFilters: {
      date_field: 'date',
      kind: 'field_value',
      field_value: 'price',
      aggregate_period: 'day',
      aggregate_function: 'sum',
      invoice__plannedinvoice__isnull: false,
    },
    dateFiltersName: {
      start: 'date__gte',
      end: 'date__lte',
    },
    defaultRange: {
      start: moment()
        .subtract(1, 'years')
        .format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      kind: 'current_year',
    },
  },
  {
    name: 'new_members',
    ressourceIdentifier: 'temporalBarChartMember',
    baseFilters: {
      date_field: 'date_joined',
      kind: 'count',
      aggregate_period: 'day',
    },
    dateFiltersName: {
      start: 'date_joined__gte',
      end: 'date_joined__lte',
    },
    defaultRange: {
      start: moment()
        .subtract(1, 'years')
        .format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      kind: 'current_year',
    },
  },
];

const chartPropsData = (t, theme) => {
  const colorScale = chroma
    .scale([theme.primary_color, theme.secondary_color])
    .mode('lab');
  const graph_nb = dashboardGraphs.length;
  return {
    chartProps: {
      new_members: {
        title: t('newMembers'),
        height: 350,
        yLabel: t('newMembers'),
        tooltip: true,
        chartOptions: [
          {
            dataKey: 'v',
            caption: t('newMembers'),
            stroke: colorScale(6 / graph_nb),
            fill: colorScale(6 / graph_nb),
          },
        ],
      },
      booking_timeslot: {
        title: t('bookingsWeektimeSlot.title'),
        popoverText: t('bookingsWeektimeSlot.popover'),
        height: 371,
        tooltip: true,
      },
      turnover: {
        title: t('turnover.title'),
        popoverText: t('turnover.popover'),
        height: 420,
        yLabel: t('turnover.caption'),
        tooltip: true,
        chartOptions: [
          {
            dataKey: 'v',
            caption: t('turnover.caption'),
            stroke: colorScale(0),
            fill: colorScale(0),
          },
        ],
      },
      billed_subscriptions: {
        title: t('billedSubscriptions.title'),
        popoverText: t('billedSubscriptions.popover'),
        height: 350,
        yLabel: t('billedSubscriptions.caption'),
        tooltip: true,
        chartOptions: [
          {
            dataKey: 'v',
            caption: t('billedSubscriptions.caption'),
            stroke: colorScale(4 / graph_nb),
            fill: colorScale(4 / graph_nb),
          },
        ],
      },
      booking_qualitative: {
        title: t('bookingSource.title'),
        height: 320,
        tooltip: true,
        legend: true,
        baseColor: colorScale(2 / graph_nb),
        chartOptions: [
          {
            dataKey: BOOKING_SOURCE_APP.id.toString(),
            caption: t('bookingSource.app'),
          },
          {
            dataKey: BOOKING_SOURCE_WEB.id.toString(),
            caption: t('bookingSource.web'),
          },
          {
            dataKey: BOOKING_SOURCE_SAAS.id.toString(),
            caption: t('bookingSource.saas'),
          },
          {
            dataKey: BOOKING_SOURCE_OTHER.id.toString(),
            caption: t('bookingSource.other'),
          },
          {
            dataKey: BOOKING_SOURCE_MIGRATION.id.toString(),
            caption: t('bookingSource.migration'),
          },
        ],
      },
      subscription_turnover: {
        title: t('plannedPayment.title'),
        height: 350,
        yLabel: t('plannedPayment.caption'),
        popoverText: t('plannedPayment.popover'),
        tooltip: true,
        chartOptions: [
          {
            dataKey: 'v',
            caption: t('plannedPayment.caption'),
            stroke: colorScale(5 / graph_nb),
            fill: colorScale(5 / graph_nb),
          },
        ],
      },
      invoice_item: {
        title: t('invoiceItems.title'),
        height: 368,
        baseColor: colorScale(3 / graph_nb),
        tooltip: true,
        legend: true,
        isCurrencyFormat: true,
        chartOptions: [
          {
            dataKey: BUYABLE_ITEM_PASS.toString(),
            caption: t(`invoiceItems.contentType.${BUYABLE_ITEM_PASS}`),
          },
          {
            dataKey: BUYABLE_ITEM_SHOP_ITEM.toString(),
            caption: t(`invoiceItems.contentType.${BUYABLE_ITEM_SHOP_ITEM}`),
          },
          {
            dataKey: BUYABLE_ITEM_PRIVATE_PASS.toString(),
            caption: t(`invoiceItems.contentType.${BUYABLE_ITEM_PRIVATE_PASS}`),
          },
          {
            dataKey: BUYABLE_ITEM_COMBO_ITEM.toString(),
            caption: t(`invoiceItems.contentType.${BUYABLE_ITEM_COMBO_ITEM}`),
          },
          {
            dataKey: BUYABLE_ITEM_COUPON.toString(),
            caption: t(`invoiceItems.contentType.${BUYABLE_ITEM_COUPON}`),
          },
          {
            dataKey: BUYABLE_ITEM_FEE.toString(),
            caption: t(`invoiceItems.contentType.${BUYABLE_ITEM_FEE}`),
          },
        ],
      },
    },
  };
};

export class Dashboard extends Component<Props> {
  componentDidMount() {
    const { fetchStatistics } = this.props;
    dashboardGraphs.forEach((graph) => {
      fetchStatistics(graph);
    });
  }

  componentDidUpdate(prevProps: Props) {
    const { chartFilters, chartRanges, fetchStatistics } = this.props;
    dashboardGraphs.forEach((graph) => {
      if (chartFilters[graph.name] !== prevProps.chartFilters[graph.name]) {
        fetchStatistics(graph);
      }

      if (chartRanges[graph.name] !== prevProps.chartRanges[graph.name]) {
        fetchStatistics(graph);
      }
    });
  }

  render() {
    const { classes, chartRanges, chartFilters, data, chartProps } = this.props;
    return (
      <Grid container="row" spacing={3} className={classes.gridRow}>
        {dashboardGraphs.map((graph) => {
          const ChartComponent =
            graphRessources[graph.ressourceIdentifier].chartComponent;
          const { timeSettings } = graphRessources[graph.ressourceIdentifier];
          return (
            <Grid item xs={12} lg={6} key={graph.name}>
              <DashboardChart
                title={chartProps[graph.name].title}
                popoverText={chartProps[graph.name].popoverText}
                loading={data[graph.name].loading}
                filtersComponent={
                  graphRessources[graph.ressourceIdentifier].filtersComponent
                }
                filters={chartFilters[graph.name]}
                setChartFilters={this.props.setParticularChartFilter(
                  graph.name,
                )}
                range={timeSettings !== 'none' && chartRanges[graph.name]}
                setRange={this.props.setParticularRange(
                  graph.name,
                  timeSettings,
                )}
              >
                <ChartComponent
                  data={data[graph.name].data}
                  {...chartProps[graph.name]}
                />
              </DashboardChart>
            </Grid>
          );
        })}
      </Grid>
    );
  }
}

const styles = (theme) => ({
  gridRow: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
});

export default compose(
  withTranslation(['dashboard']),
  withStyles(styles),
  withDashboardGraphs(dashboardGraphs, chartPropsData),
  withHandlers({
    fetchStatistics: ({ chartRanges, chartFilters, boundActions }) => (
      graph,
    ) => {
      const { timeSettings } = graphRessources[graph.ressourceIdentifier];
      let params = { ...graph.baseFilters, ...chartFilters[graph.name] };
      if (timeSettings !== 'none') {
        params = {
          ...params,
          [graph.dateFiltersName.start]: chartRanges[graph.name].start,
          [graph.dateFiltersName.end]: chartRanges[graph.name].end,
        };
      }
      boundActions[graph.name](graph.name, params);
    },
    setParticularChartFilter: ({ setChartFilters }) => (identifier) => {
      return (filters) => setChartFilters(identifier, filters);
    },
    setParticularRange: ({ setchartRanges }) => (identifier, timeSettings) => {
      if (timeSettings === 'range') return (r) => setchartRanges(identifier, r);
      return null;
    },
  }),
  withTitle(({ t }: { t: TFunction }) => t('titles:dashboard.dashboard')),
)(Dashboard);
