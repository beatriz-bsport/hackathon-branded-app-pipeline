// @flow
import chroma from 'chroma-js';

import ScheduleIcon from '@material-ui/icons/Schedule';
import People from '@material-ui/icons/People';
import Payment from '@material-ui/icons/Payment';
import ReceiptIcon from '@material-ui/icons/Receipt';
import MultilineChartIcon from '@material-ui/icons/MultilineChart';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import type { TFunction } from 'react-i18next';

import {
  fetchMemberStatistics as fetchMemberStatisticsAction,
  fetchBookingTimeslotStatistics as fetchBookingTimeslotStatisticsAction,
  fetchPlannedInvoiceStatistics as fetchPlannedInvoiceStatisticsAction,
  fetchPaymentStatistics as fetchPaymentStatisticsAction,
  fetchBookingQualitative as fetchBookingQualitativeAction,
  fetchInvoiceItemQualitative as fetchInvoiceItemQualitativeAction,
  fetchBookingTemporal as fetchBookingTemporalAction,
} from '../../actions/stats.actions';

import { getStatisticTemporal, getStatisticTemporalGrid } from './selectors';

import { TemporalBarChart } from '../../components/graph/TemporalBarChart.component';
import { TemporalAreaChart } from '../../components/graph/TemporalAreaChart.component';
import { TimeslotGridChart } from '../../components/graph/TimeslotGridChart.component';
import { QualitativeBarChart } from '../../components/graph/QualitativeBarChart.component';
import { PieChartV2 } from '../../components/graph/PieChartV2.component';

import BookingFilters from '../booking/components/BookingFilters.component';
import type { Theme } from '../theme/types.ts';
import type { Graph } from './types';

export const graphRessources = {
  temporalMember: {
    action: fetchMemberStatisticsAction,
    selector: getStatisticTemporal,
    object: { type: 'member', icon: People },
    chartComponents: { bar: TemporalBarChart, area: TemporalAreaChart },
    iconResource: MultilineChartIcon,
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
    allowAggregate: true,
  },
  temporalTimeslotBooking: {
    action: fetchBookingTimeslotStatisticsAction,
    selector: getStatisticTemporalGrid,
    object: { type: 'booking', icon: ScheduleIcon },
    chartComponents: { grid: TimeslotGridChart },
    iconResource: MultilineChartIcon,
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
    object: { type: 'payment', icon: Payment },
    chartComponents: { bar: TemporalBarChart, area: TemporalAreaChart },
    iconResource: MultilineChartIcon,
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
    allowAggregate: true,

    defaultRangeKind: 'current_year',
  },
  temporalPlannedInvoice: {
    action: fetchPlannedInvoiceStatisticsAction,
    selector: getStatisticTemporal,
    object: { type: 'invoice', icon: ReceiptIcon },
    chartComponents: { bar: TemporalBarChart, area: TemporalAreaChart },
    iconResource: MultilineChartIcon,
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
  temporalBooking: {
    action: fetchBookingTemporalAction,
    selector: getStatisticTemporal,
    object: { type: 'booking', icon: ScheduleIcon },
    chartComponents: { bar: TemporalBarChart, area: TemporalAreaChart },
    iconResource: MultilineChartIcon,
    filtersComponent: BookingFilters,
    timeSettings: 'range',
    dateFiltersName: {
      start: 'min_date',
      end: 'max_date',
    },
    choices: {
      date_field: ['offer__date_start'],
      aggregate_function: ['count'],
      aggregate_field: {
        count: ['pk'],
      },
      aggregate_period: ['day'],
    },
    allowAggregate: true,

    defaultRangeKind: 'current_year',
  },
  qualitativeBooking: {
    action: fetchBookingQualitativeAction,
    selector: getStatisticTemporalGrid,
    object: { type: 'booking', icon: ScheduleIcon },
    chartComponents: { pie: PieChartV2, bar: QualitativeBarChart },
    iconResource: InsertChartIcon,
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
    object: { type: 'invoice', icon: ReceiptIcon },
    chartComponents: { pie: PieChartV2, bar: QualitativeBarChart },
    iconResource: InsertChartIcon,
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
/* TimeSettings: 'range', 'fixed' or 'none'
range => start date / end date to fetch data, both can be changed by user
fixed => start date / end date to fetch data, cannot be changet by user
none => no dates intervening in data fetching
*/

export const getChartPropsData = (
  t: TFunction,
  theme: Theme,
  graphList: Array<Graph>,
) => {
  const colorScale = chroma
    .scale([theme.primary_color, theme.secondary_color])
    .mode('lab');

  const graph_nb = graphList.length || 1;

  return graphList.reduce((chartProps, currentGraph, index) => {
    let currentProps;
    switch (currentGraph.ressourceIdentifier) {
      case 'temporalMember':
        currentProps = {
          title: t('dashboard:newMembers'),
          height: 350,
          yLabel: t('dashboard:newMembers'),
          tooltip: true,
          chartOptions: [
            {
              dataKey: 'v',
              caption: t('dashboard:newMembers'),
              stroke: colorScale(index / graph_nb).hex(),
              fill: colorScale(index / graph_nb).hex(),
            },
          ],
        };
        break;

      case 'temporalTimeslotBooking':
        currentProps = {
          title: t('dashboard:bookingsWeektimeSlot.title'),
          popoverText: t('dashboard:bookingsWeektimeSlot.popover'),
          height: 371,
          tooltip: true,
        };
        break;

      case 'temporalPayment':
        currentProps = {
          title: t('dashboard:turnover.title'),
          popoverText: t('dashboard:turnover.popover'),
          height: 420,
          yLabel: t('dashboard:turnover.caption'),
          tooltip: true,
          chartOptions: [
            {
              dataKey: 'v',
              caption: t('dashboard:turnover.caption'),
              stroke: colorScale(index / graph_nb).hex(),
              fill: colorScale(index / graph_nb).hex(),
            },
          ],
        };
        // planned invoice turnover variant
        if (
          currentGraph.baseFilters.invoice__plannedinvoice__isnull === false
        ) {
          currentProps.title = t('dashboard:plannedPayment.title');
          currentProps.popoverText = t('dashboard:plannedPayment.popover');
        }
        break;

      case 'temporalPlannedInvoice':
        currentProps = {
          title: t('dashboard:billedSubscriptions.title'),
          popoverText: t('dashboard:billedSubscriptions.popover'),
          height: 420,
          yLabel: t('dashboard:billedSubscriptions.caption'),
          tooltip: true,
          chartOptions: [
            {
              dataKey: 'v',
              caption: t('dashboard:billedSubscriptions.caption'),
              stroke: colorScale(index / graph_nb).hex(),
              fill: colorScale(index / graph_nb).hex(),
            },
          ],
        };
        break;

      case 'temporalBooking':
        currentProps = {
          title: t('dashboard:bookings.title'),
          popoverText: t('dashboard:bookings.popover'),
          height: 420,
          yLabel: t('dashboard:bookings.caption'),
          tooltip: true,
          chartOptions: [
            {
              dataKey: 'v',
              caption: t('dashboard:bookings.caption'),
              stroke: colorScale(index / graph_nb).hex(),
              fill: colorScale(index / graph_nb).hex(),
            },
          ],
        };
        break;

      case 'qualitativeBooking':
        currentProps = {
          title: t('dashboard:bookingSource.title'),
          height: 320,
          tooltip: true,
          legend: true,
          baseColor: colorScale(index / graph_nb).hex(),
          translationKey: 'dashboard:bookingDropdown.source',
          valueCaption: 'Boookings',
        };
        break;

      case 'qualitativeInvoiceItem':
        currentProps = {
          title: t('dashboard:invoiceItems.title'),
          height: 368,
          baseColor: colorScale(index / graph_nb).hex(),
          tooltip: true,
          legend: true,
          isCurrencyFormat: true,
          translationKey: 'dashboard:invoiceItemDropdown.contentType',
        };
        break;

      default:
        currentProps = {};
        break;
    }

    return { ...chartProps, [currentGraph.name]: currentProps };
  }, {});
};
