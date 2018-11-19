// @flow

import lodash from 'lodash';
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

function filterDataTable(table, dateRange) {
  return lodash.filter(
    table,
    (x) => x.d >= dateRange.start && x.d <= dateRange.end,
  );
}

/*
function addFakeData(table, dateRange) {
  const dates = [];
  let date = moment(dateRange.start);
  const end = moment(dateRange.end);
  while (date.isSameOrBefore(end)) {
    dates.push({ d: date.valueOf(), v: Math.random() * 100 });
    date = date.add(1, 'day');
  }

  return table.concat(dates);
}
*/

function discretizeDataBy(table, dateRange) {
  const duration = moment.duration(dateRange.end.diff(dateRange.start));
  if (duration.asDays() > 60) {
    return {
      table: discretizeBy(table, 'month', (u, v) => u + v.v),
      formatter: 'month',
    };
  }
  if (duration.asDays() > 15) {
    return {
      table: discretizeBy(table, 'week', (u, v) => u + v.v),
      formatter: 'week',
    };
  }
  return { table };
}

function statSelector(identifier) {
  return createCachedSelector(
    dateRangeSelector,
    (state) => {
      const stat = state.stats.stats[identifier];
      return (stat && stat.data) || [];
    },
    (dateRange, data) => {
      const table = filterDataTable(
        data.asMutable ? data.asMutable() : data,
        dateRange,
      );
      // const aumentedData = addFakeData(table, dateRange);
      const discretizedData = discretizeDataBy(table, dateRange);

      const total = discretizedData.table.reduce((sum, x) => sum + x.v, 0);
      return { ...discretizedData, total };
    },
  )((state) => {
    const { dateRange } = state.stats;
    return `${identifier}-${dateRange.start}:${dateRange.end}`;
  });
}

function discretizeBy(table, duration, reducer) {
  const newTable = table.map((row) => {
    const d = moment(row.d);
    return { ...row, year: d.year(), [duration]: d[duration]() };
  });

  const grouped = lodash.groupBy(newTable, (u) => `${u.year}-${u[duration]}`);

  const finalTable = Object.keys(grouped)
    .map((k) => {
      const group = grouped[k];
      return {
        d: group[0].d,
        v: group.reduce(reducer, 0),
        year: group[0].year,
        [duration]: group[0][duration],
        groupId: k,
      };
    })
    .sort((u, v) => u.d - v.d);

  return finalTable;
}

export const bookingStatSelector = statSelector('bookings');
export const newMembersStatSelector = statSelector('newMembers');
export const turnoverStatSelector = statSelector('turnover');
