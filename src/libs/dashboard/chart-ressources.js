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
  },
  temporalTimeslotBooking: {
    action: fetchBookingTimeslotStatisticsAction,
    selector: getStatisticTemporalGrid,
    chartComponents: { grid: TimeslotGridChart },
    filtersComponent: BookingFilters,
    timeSettings: 'range',
  },
  temporalPayment: {
    action: fetchPaymentStatisticsAction,
    selector: getStatisticTemporal,
    chartComponents: { bar: TemporalBarChart, area: TemporalAreaChart },
    filtersComponent: null,
    timeSettings: 'range',
  },
  temporalPlannedInvoice: {
    action: fetchPlannedInvoiceStatisticsAction,
    selector: getStatisticTemporal,
    chartComponents: { bar: TemporalBarChart, area: TemporalAreaChart },
    filtersComponent: null,
    timeSettings: 'unique',
  },
  qualitativeBooking: {
    action: fetchBookingQualitativeAction,
    selector: getStatisticTemporalGrid,
    chartComponents: { pie: PieChartV2, bar: QualitativeBarChart },
    filtersComponent: BookingFilters,
    timeSettings: 'range',
  },
  qualitativeInvoiceItem: {
    action: fetchInvoiceItemQualitativeAction,
    selector: getStatisticTemporalGrid,
    chartComponents: { pie: PieChartV2, bar: QualitativeBarChart },
    filtersComponent: null,
    timeSettings: 'range',
  },
};

// timeSettings: 'range', 'unique' or 'none'

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
