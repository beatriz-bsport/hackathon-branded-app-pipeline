import { DateTime } from 'luxon';
import memoize from 'memoize-one';
import { v4 as uuidv4 } from 'uuid';
import { TFunction } from 'i18next';
import isEqual from 'lodash/isEqual';
import { DATATYPE_PRESET_INTEGER_VALUE } from '#src/libs/datatype-filtering/constants';
import {
  IDENTIFIER_NEEDING_TRANSLATION_FOR_VALUES,
  BOOKING_GRAPH_IDENTIFIER,
  PRIVATE_BOOKING_GRAPH_IDENTIFIER,
  SUBSCRIPTION_GRAPH_IDENTIFIER,
  BILLING_PLAN_GRAPH_IDENTIFIER,
} from '#src/libs/dashboard/constants';
import { DatatypeFilterConfig } from '#src/libs/datatype-filtering/types';
import type { Graph } from '../statistics/types';
import type {
  DataSourceDashboardGraph,
  DataSourceDashboardGraphMetadata,
} from './types';
import { DASHBOARD_COLOR_PALETTE } from './colors';

export const replaceDates: (graphList: Array<Graph>) => Array<Graph> = (
  graphList,
) => {
  return graphList.map((graph) => {
    const dateRange = { ...graph.dateRange };
    if (dateRange.kind !== 'custom') {
      switch (dateRange.kind) {
        case 'current_year':
          dateRange.start = DateTime.now().minus({ year: 1 }).toISODate();
          dateRange.end = DateTime.now().toISODate();
          break;
        case 'last_three_months':
          dateRange.start = DateTime.now().minus({ month: 3 }).toISODate();
          dateRange.end = DateTime.now().toISODate();
          break;
        case 'current_month':
          dateRange.start = DateTime.now().minus({ month: 1 }).toISODate();
          dateRange.end = DateTime.now().toISODate();
          break;
        case 'current_week':
          dateRange.start = DateTime.now().minus({ week: 1 }).toISODate();
          dateRange.end = DateTime.now().toISODate();
          break;
        default:
          break;
      }
    }
    return { ...graph, dateRange };
  });
};

// ------------------------------------------
// Extract date range from graph date_filter_config's filters_data to display as a chip
export const getDateRangeFromGraphFilter = (
  graph: DataSourceDashboardGraph,
): {
  timePeriod: string;
  start: DateTime;
  end: DateTime;
} | null => {
  const {
    date_filter_config: { groups },
  } = graph;
  const dateFilterDict = groups?.[0]?.filters_data?.[0];
  if (!dateFilterDict) return null;

  let start;
  let end = DateTime.now();
  let startTimestamp;
  let endTimestamp;
  switch (dateFilterDict.time_period) {
    case 'year':
      start = end.minus({ year: 1 });
      break;
    case 'trimester':
      start = end.minus({ month: 3 });
      break;
    case 'month':
      start = end.minus({ month: 1 });
      break;
    case 'week':
      start = end.minus({ week: 1 });
      break;
    default:
      // @ts-expect-error
      [startTimestamp, endTimestamp] = dateFilterDict.value;
      start = DateTime.fromSeconds(startTimestamp);
      end = DateTime.fromSeconds(endTimestamp);
  }
  return { timePeriod: dateFilterDict.time_period, start, end };
};

export const getNbOfFiltersFromGraph = (
  graph: DataSourceDashboardGraph,
): number => {
  const { filter_config: filterConfig } = graph;
  return (
    filterConfig?.groups?.reduce(
      (nbFilters, group) => nbFilters + (group.filters_data?.length ?? 0),
      0,
    ) ?? 0
  );
};

export const prepareGraphPropsForDisplay = memoize(
  (
    t: TFunction,
    partialGraphList: Array<
      Omit<DataSourceDashboardGraph, 'filter_config' | 'date_filter_config'>
    >,
    graphMetadata: Array<DataSourceDashboardGraphMetadata>,
  ) => {
    return partialGraphList.reduce(
      (acc, partialGraph, index) => ({
        ...acc,
        [partialGraph.uuid]: getDisplayPropsForOneGraph(
          t,
          partialGraph,
          graphMetadata?.find(
            (m) =>
              m.dashboard_graph_identifier ===
              partialGraph.dashboard_graph_identifier,
          ),
          index,
        ),
      }),
      {},
    );
  },
  isEqual,
);

// Prepare props for chart rendering (color, labels, currency)
const getDisplayPropsForOneGraph = (
  t: TFunction,
  partialGraph: Omit<
    DataSourceDashboardGraph,
    'filter_config' | 'date_filter_config'
  >,
  graphMetadata: DataSourceDashboardGraphMetadata,
  index: number,
) => {
  const baseColor =
    DASHBOARD_COLOR_PALETTE[index % DASHBOARD_COLOR_PALETTE.length];

  let isCurrencyFormat = false;

  if (['temporal', 'qualitative'].includes(partialGraph.graph_family)) {
    const fieldIdentifier =
      partialGraph.graph_params[
        partialGraph.graph_family === 'temporal'
          ? 'date_value'
          : 'group_by_value'
      ];
    const valueDatatype = graphMetadata?.metadata?.find(
      (metadata) => metadata.identifier === fieldIdentifier,
    )?.datatype;
    isCurrencyFormat = valueDatatype === 'price';
  }

  if (partialGraph.graph_family === 'temporal') {
    const { date, date_value } = partialGraph.graph_params;
    const xLabel = t(`dataSourceIdentifiers.${date}`);
    let yLabel = t(
      `dataSourceIdentifiers.${
        partialGraph.graph_params.accumulate_total_data
          ? `${date_value}_accumulate`
          : date_value
      }`,
    );
    if (
      ['avg', 'min', 'max'].includes(
        partialGraph.graph_params.aggregation_function_name,
      )
    ) {
      yLabel = `${yLabel} (${t(
        `dashboard:graphFormDrawer.aggregation.${partialGraph.graph_params.aggregation_function_name}`,
      )})`;
    }

    const chartOptions = [
      {
        dataKey: 'v',
        caption: yLabel,
        stroke: baseColor,
        fill: baseColor,
      },
    ];
    return { xLabel, yLabel, tooltip: true, chartOptions, isCurrencyFormat };
  }

  if (partialGraph.graph_family === 'qualitative') {
    const { group_by, group_by_value } = partialGraph.graph_params;
    const groupByDatatype = graphMetadata?.metadata?.find(
      (m) => m.identifier === group_by,
    )?.datatype;

    let translationKey = null;
    if (
      DATATYPE_PRESET_INTEGER_VALUE.includes(groupByDatatype) &&
      groupByDatatype !== 'products'
    ) {
      translationKey = `reporting:presetValuesByDatatype.${groupByDatatype}`;
    } else if (IDENTIFIER_NEEDING_TRANSLATION_FOR_VALUES.includes(group_by)) {
      translationKey = `reporting:presetValuesByIdentifier.${group_by}`;
    }
    let placeholderEmptyTranslationKey = null;
    if (['coach', 'establishment'].includes(group_by)) {
      placeholderEmptyTranslationKey = `dashboard:placeholderEmptyValues.${group_by}`;
    }
    const xLabel = t(`dataSourceIdentifiers.${group_by_value}`);

    return {
      tooltip: true,
      translationKey,
      legend: true,
      isCurrencyFormat,
      placeholderEmptyTranslationKey,
      xLabel,
    };
  }

  // week_timeslots chart does not require specific props
  return {};
};

export const getHelperTextForDrawerSelector = (
  dashboardGraphIdentifier: string,
  fieldValue: string,
  fieldName: string,
  aggregationFunctionName: string | null,
  t: TFunction,
) => {
  if (
    [BOOKING_GRAPH_IDENTIFIER, PRIVATE_BOOKING_GRAPH_IDENTIFIER].includes(
      dashboardGraphIdentifier,
    ) &&
    fieldName === 'filterable_date'
  ) {
    // Helper text for filterable date
    return t(
      `dashboard:graphFormDrawer.helperText.${
        fieldValue === 'date_start' ? 'dateStart' : 'dateCreated'
      }`,
    );
  }

  if (
    (dashboardGraphIdentifier === SUBSCRIPTION_GRAPH_IDENTIFIER &&
      fieldName === 'date_value') ||
    (dashboardGraphIdentifier === BILLING_PLAN_GRAPH_IDENTIFIER &&
      fieldName === 'plan_date_start')
  ) {
    // Helper text for graph param
    if (fieldValue === 'plannedinvoice_pk') {
      return t('dashboard:graphFormDrawer.helperText.plannedInvoiceCount');
    }
    switch (aggregationFunctionName) {
      case 'sum':
        return t('dashboard:graphFormDrawer.helperText.subscriptionPrice.sum');
      case 'avg':
        return t('dashboard:graphFormDrawer.helperText.subscriptionPrice.avg');
      case 'min':
        return t('dashboard:graphFormDrawer.helperText.subscriptionPrice.min');
      default:
        return t('dashboard:graphFormDrawer.helperText.subscriptionPrice.max');
    }
  }

  return null;
};

export const generateFilterConfigBookingStatusOk: () => DatatypeFilterConfig =
  () => {
    return {
      groups: [
        {
          uuid: uuidv4(),
          filters_data: [
            {
              uuid: uuidv4(),
              value: [0],
              datatype: 'booking_status_code',
              comparator: 4,
              identifier: 'booking_status_code',
              time_period: null,
              sub_datatype: null,
            },
          ],
          inner_operand: 1,
          display_has_single: true,
        },
      ],
      group_operand: 1,
    };
  };
