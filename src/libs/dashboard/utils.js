// @flow

import moment from 'moment-timezone';
import type { Graph } from '../statistics/types';

export const replaceDates: (graphList: Array<Graph>) => Array<Graph> = (
  graphList,
) => {
  return graphList.map((graph) => {
    const dateRange = { ...graph.dateRange };
    if (dateRange.kind !== 'custom') {
      switch (dateRange.kind) {
        case 'current_year':
          dateRange.start = moment()
            .subtract(1, 'years')
            .format('YYYY-MM-DD');
          dateRange.end = moment().format('YYYY-MM-DD');
          break;
        case 'last_three_months':
          dateRange.start = moment()
            .subtract(3, 'months')
            .format('YYYY-MM-DD');
          dateRange.end = moment().format('YYYY-MM-DD');
          break;
        case 'current_month':
          dateRange.start = moment()
            .subtract(1, 'months')
            .format('YYYY-MM-DD');
          dateRange.end = moment().format('YYYY-MM-DD');
          break;
        case 'current_week':
          dateRange.start = moment()
            .subtract(1, 'weeks')
            .format('YYYY-MM-DD');
          dateRange.end = moment().format('YYYY-MM-DD');
          break;
        default:
          break;
      }
    }
    return { ...graph, dateRange };
  });
};
