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
import { TimeslotGridChart } from '../../components/graph/TimeslotGridChart.component';
import { PieChartV2 } from '../../components/graph/PieChartV2.component';

import BookingFilters from '../booking/components/BookingFilters.component';

export const graphRessources = {
  temporalBarChartMember: {
    action: fetchMemberStatisticsAction,
    selector: getStatisticTemporal,
    chartComponent: TemporalBarChart,
    filtersComponent: null,
    timeSettings: 'range',
  },
  temporalTimeslotBooking: {
    action: fetchBookingTimeslotStatisticsAction,
    selector: getStatisticTemporalGrid,
    chartComponent: TimeslotGridChart,
    filtersComponent: BookingFilters,
    timeSettings: 'range',
  },
  temporalBarChartPayment: {
    action: fetchPaymentStatisticsAction,
    selector: getStatisticTemporal,
    chartComponent: TemporalBarChart,
    filtersComponent: null,
    timeSettings: 'range',
  },
  temporalBarChartPlannedInvoice: {
    action: fetchPlannedInvoiceStatisticsAction,
    selector: getStatisticTemporal,
    chartComponent: TemporalBarChart,
    filtersComponent: null,
    timeSettings: 'unique',
  },
  pieChartBooking: {
    action: fetchBookingQualitativeAction,
    selector: getStatisticTemporalGrid,
    chartComponent: PieChartV2,
    filtersComponent: BookingFilters,
    timeSettings: 'range',
  },
  pieChartInvoiceItem: {
    action: fetchInvoiceItemQualitativeAction,
    selector: getStatisticTemporalGrid,
    chartComponent: PieChartV2,
    filtersComponent: null,
    timeSettings: 'range',
  },
};

// timeSettings: 'range', 'unique' or 'none'

// this function will be used in a selector when fetching the JSON graph data
// from the backend
// not used yet
export const replaceDates = (dashboardGraphs) => {
  return dashboardGraphs.map((graph) => {
    const { defaultRange } = graph;
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
    return { ...graph, ...defaultRange };
  });
};
