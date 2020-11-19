// @flow
import moment from 'moment-timezone';
import {
  fetchMemberStatistics as fetchMemberStatisticsAction,
  fetchBookingTimeslotStatistics as fetchBookingTimeslotStatisticsAction,
  fetchPlannedInvoiceStatistics as fetchPlannedInvoiceStatisticsAction,
  fetchPaymentStatistics as fetchPaymentStatisticsAction,
  fetchBookingQualitative as fetchBookingQualitativeAction,
  fetchInvoiceItemQualitative as fetchInvoiceItemQualitativeAction,
} from '../../actions/stats.actions';

import {
  getStatisticTemporal,
  getStatisticTemporalGrid,
} from '../../state/stats/selectors';

import { TemporalBarChart } from '../../components/graph/TemporalBarChart.component';
import { TemporalAreaChart } from '../../components/graph/TemporalAreaChart.component';
import { TimeslotGridChart } from '../../components/graph/TimeslotGridChart.component';
import { QualitativeBarChart } from '../../components/graph/QualitativeBarChart.component';
import { PieChartV2 } from '../../components/graph/PieChartV2.component';

import BookingFilters from '../booking/components/BookingFilters.component';
import type { Tab, Graph } from './types';

export const graphRessources = {
  temporalMember: {
    action: fetchMemberStatisticsAction,
    selector: getStatisticTemporal,
    chartComponents: { bar: TemporalBarChart, area: TemporalAreaChart },
    filtersComponent: null,
    timeSettings: 'range',
    dateFiltersName: {
      start: 'date_joined__gte',
      end: 'date_joined__lte',
    },
    choices: {
      date_field: ['date_joined'],
      aggregate_function: ['count'],
      aggregate_field: {
        count: ['pk'],
      },
      aggregate_period: ['day'],
    },
    defaultRangeKind: 'current_year',
  },
  temporalTimeslotBooking: {
    action: fetchBookingTimeslotStatisticsAction,
    selector: getStatisticTemporalGrid,
    chartComponents: { grid: TimeslotGridChart },
    filtersComponent: BookingFilters,
    timeSettings: 'range',
    dateFiltersName: {
      start: 'min_date',
      end: 'max_date',
    },
    choices: {
      date_field: ['offer__date_start'],
    },
    defaultRangeKind: 'current_year',
  },
  temporalPayment: {
    action: fetchPaymentStatisticsAction,
    selector: getStatisticTemporal,
    chartComponents: { bar: TemporalBarChart, area: TemporalAreaChart },
    filtersComponent: null,
    timeSettings: 'range',
    dateFiltersName: {
      start: 'date__gte',
      end: 'date__lte',
    },
    choices: {
      date_field: ['date'],
      aggregate_function: ['sum'],
      aggregate_field: {
        sum: ['price'],
      },
      aggregate_period: ['day'],
    },
    options: {
      invoice__plannedinvoice__isnull: false,
    },
    defaultRangeKind: 'current_year',
  },
  temporalPlannedInvoice: {
    action: fetchPlannedInvoiceStatisticsAction,
    selector: getStatisticTemporal,
    chartComponents: { bar: TemporalBarChart, area: TemporalAreaChart },
    filtersComponent: null,
    timeSettings: 'fixed',
    dateFiltersName: {
      start: 'date_month_inclusive__gte',
      end: 'date_month_inclusive__lte',
    },
    choices: {
      date_field: ['invoice__date'],
      aggregate_function: ['count'],
      aggregate_field: {
        count: ['pk'],
      },
      aggregate_period: ['day'],
    },
    defaultRangeKind: 'current_year',
  },
  qualitativeBooking: {
    action: fetchBookingQualitativeAction,
    selector: getStatisticTemporalGrid,
    chartComponents: { pie: PieChartV2, bar: QualitativeBarChart },
    filtersComponent: BookingFilters,
    timeSettings: 'range',
    dateFiltersName: {
      start: 'date__gte',
      end: 'date__lte',
    },
    choices: {
      dropdown_field: ['source'],
      aggregate_function: ['count'],
      aggregate_field: {
        count: ['pk'],
      },
    },
    defaultRangeKind: 'current_year',
  },
  qualitativeInvoiceItem: {
    action: fetchInvoiceItemQualitativeAction,
    selector: getStatisticTemporalGrid,
    chartComponents: { pie: PieChartV2, bar: QualitativeBarChart },
    filtersComponent: null,
    timeSettings: 'range',
    dateFiltersName: {
      start: 'invoice__payments__date__gte',
      end: 'invoce__payments__date__lte',
    },
    choices: {
      dropdown_field: ['buyable_item_identifier'],
      aggregate_function: ['sum'],
      aggregate_field: {
        sum: ['total_price'],
      },
    },
    defaultRangeKind: 'current_year',
  },
};

// timeSettings: 'range', 'fixed' or 'none'

const replaceDates = (graphList: Array<Graph>) => {
  return graphList.map((graph) => {
    const defaultRange = { ...graph.defaultRange };
    if (defaultRange.kind !== 'custom') {
      switch (defaultRange.kind) {
        case 'current_year':
          defaultRange.start = moment()
            .subtract(1, 'years')
            .format('YYYY-MM-DD');
          defaultRange.end = moment().format('YYYY-MM-DD');
          break;
        case 'last_three_months':
          defaultRange.start = moment()
            .subtract(3, 'months')
            .format('YYYY-MM-DD');
          defaultRange.end = moment().format('YYYY-MM-DD');
          break;
        case 'current_month':
          defaultRange.start = moment()
            .subtract(1, 'months')
            .format('YYYY-MM-DD');
          defaultRange.end = moment().format('YYYY-MM-DD');
          break;
        case 'current_week':
          defaultRange.start = moment()
            .subtract(1, 'weeks')
            .format('YYYY-MM-DD');
          defaultRange.end = moment().format('YYYY-MM-DD');
          break;
        default:
          break;
      }
    }
    return { ...graph, defaultRange };
  });
};

export const processDashboard = (tabList: Array<Tab>) => {
  // takes an array of tabs, each tab is an array of graphs
  // for each tab, apply replaceDates function
  return tabList.map((tab) => ({ ...tab, graphs: replaceDates(tab.graphs) }));
};
