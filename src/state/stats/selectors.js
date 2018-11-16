// @flow

import moment from 'moment';
import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';

export const mainChartSelector = (state) => state.stats.mainChart;
export const dateRangeSelector = createSelector(
  (state) => state.stats.dateRange,
  (dateRange) => ({
    start: moment(dateRange.start),
    end: moment(dateRange.end),
    kind: dateRange.kind,
  }),
);

function statSelector(identifier) {
  return createCachedSelector(
    dateRangeSelector,
    (state) => {
      const stat = state.stats.stats[identifier];
      return (stat && stat.data) || [];
    },
    (dateRange, data) => {
      const table = data.filter(
        (x) => x.d >= dateRange.start && x.d <= dateRange.end,
      );

      // Fake
      const dates = [];
      let date = moment(dateRange.start);
      const end = moment(dateRange.end);
      while (date.isSameOrBefore(end)) {
        dates.push({ d: date.valueOf(), v: Math.random() * 100 });
        date = date.add(1, 'day');
      }
      // End fake

      const total = table.reduce((sum, x) => sum + x.v, 0);
      return { table: table.concat(dates), total };
    },
  )((state) => {
    const { dateRange } = state.stats;
    return `${identifier}-${dateRange.start}:${dateRange.end}`;
  });
}

export const bookingStatSelector = statSelector('bookings');
export const newMembersStatSelector = statSelector('newMembers');
export const turnoverStatSelector = statSelector('turnover');
