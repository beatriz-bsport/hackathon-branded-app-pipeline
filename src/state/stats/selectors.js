// @flow

import lodash from 'lodash';
import moment from 'moment-timezone';
import type { Moment } from 'moment-timezone';
import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';

import type { State } from '../types.ts';

export const mainChartSelector = (state: State) => state.stats.mainChart;
export const dateRangeSelector = createSelector(
  (state: State) => state.stats.dateRange,
  (dateRange) => ({
    start: moment(dateRange.start),
    end: moment(dateRange.end),
    kind: dateRange.kind,
  }),
);

export const getStats = (
  state: State,
  range?: { start: Moment, end: Moment },
) => {
  if (
    state.stats.stats &&
    state.stats.stats.createdBookings &&
    state.stats.stats.createdBookings.data &&
    state.stats.stats.cancelledBookings &&
    state.stats.stats.cancelledBookings.data
  ) {
    const createdBookings = state.stats.stats.createdBookings.data;
    const cancelledBookings = state.stats.stats.cancelledBookings.data;
    if (range) {
      const { start, end } = range;
      return { createdBookings, cancelledBookings, start, end };
    }
    if (createdBookings.length === 0) {
      const start = moment().subtract(1, 'year');
      const end = moment();
      return { createdBookings, cancelledBookings, start, end };
    }
    if (cancelledBookings.length === 0) {
      const start = moment(createdBookings[0].d);
      const end = moment(createdBookings[createdBookings.length - 1].d);
      return { createdBookings, cancelledBookings, start, end };
    }
    const start = moment(
      Math.min(createdBookings[0].d, cancelledBookings[0].d),
    );
    const end = moment(
      Math.max(
        createdBookings[createdBookings.length - 1].d,
        cancelledBookings[cancelledBookings.length - 1].d,
      ),
    );
    return { createdBookings, cancelledBookings, start, end };
  }
  return null;
};

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
      table: discretizeByAndFillMissing(
        dateRange,
        table,
        'month',
        (u, v) => u + v.v,
      ),
      formatter: 'month',
    };
  }
  if (duration.asDays() > 15) {
    return {
      table: discretizeByAndFillMissing(
        dateRange,
        table,
        'week',
        (u, v) => u + v.v,
      ),
      formatter: 'week',
    };
  }
  if (duration.asDays() > 1) {
    return {
      table: discretizeByAndFillMissing(
        dateRange,
        table,
        'day',
        (u, v) => u + v.v,
      ),
      formatter: 'day',
    };
  }
  return {
    table: discretizeByAndFillMissing(
      dateRange,
      table,
      'hour',
      (u, v) => u + v.v,
    ),
    formatter: 'hour',
  };
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

function discretizeByAndFillMissing(dateRange, table, duration, reducer) {
  let grouped = {};

  if (duration === 'month') {
    grouped = lodash.groupBy(table, (u) => moment(u.d).format('YYYY-MM'));

    for (
      let m = moment(dateRange.start);
      m.isBefore(dateRange.end);
      m.add(1, 'month')
    ) {
      if (!grouped[m.format('YYYY-MM')]) {
        grouped[m.format('YYYY-MM')] = [
          {
            v: 0,
          },
        ];
      }
    }
  }

  if (duration === 'week') {
    grouped = lodash.groupBy(table, (u) =>
      moment(u.d)
        .startOf('week')
        .format('YYYY-MM-DD'),
    );
    for (
      let m = moment(dateRange.start).startOf('week');
      m.isBefore(dateRange.end);
      m.add(7, 'day')
    ) {
      if (!grouped[m.format('YYYY-MM-DD')]) {
        grouped[m.format('YYYY-MM-DD')] = [
          {
            v: 0,
          },
        ];
      }
    }
  }

  if (duration === 'day') {
    grouped = lodash.groupBy(table, (u) => moment(u.d).format('YYYY-MM-DD'));
    for (
      let m = moment(dateRange.start);
      m.isBefore(dateRange.end) || m.isSame(dateRange.end);
      m.add(1, 'day')
    ) {
      if (!grouped[m.format('YYYY-MM-DD')]) {
        grouped[m.format('YYYY-MM-DD')] = [
          {
            v: 0,
          },
        ];
      }
    }
  }

  if (duration === 'hour') {
    grouped = lodash.groupBy(table, (u) => moment(u.d).format('YYYY-MM-DD LT'));
    for (
      let m = moment(dateRange.start);
      m.isBefore(dateRange.end) || m.isSame(dateRange.end);
      m.add(1, 'hours')
    ) {
      if (!grouped[m.format('YYYY-MM-DD LT')]) {
        grouped[m.format('YYYY-MM-DD LT')] = [{ v: 0 }];
      }
    }
  }

  const finalTable = Object.keys(grouped)
    .map((k) => {
      const group = grouped[k];
      return {
        d: k,
        v: group.reduce(reducer, 0),
      };
    })
    .sort((a, b) => {
      if (moment(a.d).isBefore(moment(b.d))) {
        return -1;
      }
      return 1;
    });
  return finalTable;
}

export const bookingStatSelector = statSelector('bookings');
export const createdBookingStatSelector = statSelector('createdBookings');
export const cancelledBookingStatSelector = statSelector('cancelledBookings');
export const newMembersStatSelector = statSelector('newMembers');
export const turnoverStatSelector = statSelector('turnover');

const selectDateRange = (state) => state.stats.dateRange;
const selectData = (state, smartList, statistic) => {
  if (
    state.stats.bySmartListId[smartList] &&
    state.stats.bySmartListId[smartList][statistic] &&
    state.stats.bySmartListId[smartList][statistic].data
  ) {
    return state.stats.bySmartListId[smartList][statistic];
  }
  return [];
};

export const smartlistStatSelector = createCachedSelector(
  selectDateRange,
  selectData,
  (dateRange, data) => {
    if (data.data_type === 'temporal') {
      const filteredData = data.data
        .filter((item) => moment(item.d).isBefore(moment(dateRange.end)))
        .filter((item) => moment(item.d).isAfter(moment(dateRange.start)));
      const discretizedData = discretizeDataBy(filteredData, {
        start: moment(dateRange.start),
        end: moment(dateRange.end),
      });
      const total = discretizedData.table.reduce((sum, x) => sum + x.v, 0);
      return { ...discretizedData, total };
    }
    if (data.data_type === 'segments' || data.data_type === 'general') {
      return data.data;
    }
    return [];
  },
)((state, smartList, statistic) => {
  return `${smartList}-${statistic}`;
});

export const getStatisticLoading = (state, smartList, statistic) => {
  if (
    state.stats.bySmartListId[smartList] &&
    state.stats.bySmartListId[smartList][statistic]
  ) {
    return state.stats.bySmartListId[smartList][statistic].loading;
  }
  return true;
};

export const getBookingRelatedStatisticLoading = (state, statistic) => {
  if (state.stats.stats && state.stats.stats[statistic]) {
    return state.stats.stats[statistic].isLoading;
  }
  return true;
};
