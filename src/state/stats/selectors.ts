import groupBy from 'lodash/groupBy';
import moment, { Moment } from 'moment-timezone';
import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';

import { Dictionary } from 'lodash/index';
import Immutable from 'seamless-immutable';
import type { State } from '../types';
import { DateRange, StatisticPoint, StatisticPointTable } from './types';
import {
  DAILY_DURATION_DISPLAY_LIMIT,
  WEEKLY_DURATION_DISPLAY_LIMIT,
  MONTHLY_DURATION_DISPLAY_LIMIT_60_DAYS,
  // @ts-ignore
} from '#libs/statistics/utils';

export const mainChartSelector = (state: State) => state.stats.mainChart;
export const dateRangeSelector = createSelector(
  (state: State) => state.stats.dateRange,
  (dateRange) => ({
    start: moment(dateRange.start),
    end: moment(dateRange.end),
    kind: dateRange.kind,
  }),
);

const selectCreatedBookings = (
  state: State,
): Immutable.Immutable<Array<StatisticPoint>> =>
  state.stats.stats.createdBookings?.data;

const selectCancelledBookings = (
  state: State,
): Immutable.Immutable<Array<StatisticPoint>> =>
  state.stats.stats.cancelledBookings?.data;

const selectStart = (state: State, start: string) => start;

const selectEnd = (state: State, start: string, end: string) => end;

export const getStats: (
  state: State,
  start: string,
  end: string,
) => {
  createdBookings: Immutable.Immutable<Array<StatisticPoint>>;
  cancelledBookings: Immutable.Immutable<Array<StatisticPoint>>;
  offersCount: number;
  start: Moment;
  end: Moment;
} = createSelector(
  [selectCreatedBookings, selectCancelledBookings, selectStart, selectEnd],
  (createdBookings, cancelledBookings, start, end) => {
    if (createdBookings && cancelledBookings && start && end) {
      const startMoment = moment(start);
      const endMoment = moment(end);
      return {
        createdBookings,
        cancelledBookings,
        start: startMoment,
        end: endMoment,
      };
    }
    return null;
  },
);

function discretizeDataBy(table: Array<StatisticPoint>, dateRange: DateRange) {
  const duration = moment.duration(dateRange.end.diff(dateRange.start));
  if (duration.asDays() > MONTHLY_DURATION_DISPLAY_LIMIT_60_DAYS) {
    return {
      table: discretizeByAndFillMissing(
        dateRange,
        table,
        'month',
        (u: number, v: { v: number }) => {
          return u + v.v;
        },
      ),
      formatter: 'month',
    };
  }
  if (duration.asDays() > WEEKLY_DURATION_DISPLAY_LIMIT) {
    return {
      table: discretizeByAndFillMissing(
        dateRange,
        table,
        'week',
        (u: number, v: { v: number }) => u + v.v,
      ),
      formatter: 'week',
    };
  }
  if (duration.asDays() > DAILY_DURATION_DISPLAY_LIMIT) {
    return {
      table: discretizeByAndFillMissing(
        dateRange,
        table,
        'day',
        (u: number, v: { v: number }) => u + v.v,
      ),
      formatter: 'day',
    };
  }
  return {
    table: discretizeByAndFillMissing(
      dateRange,
      table,
      'hour',
      (u: number, v: { v: number }) => u + v.v,
    ),
    formatter: 'hour',
  };
}

function discretizeByAndFillMissing(
  dateRange: DateRange,
  table: Array<StatisticPoint>,
  duration: string,
  reducer: (
    previousValue: 0,
    currentValue: StatisticPoint,
    currentIndex: number,
    array: StatisticPoint[],
  ) => number,
) {
  let grouped: Dictionary<[StatisticPoint, ...StatisticPoint[]]> = {};

  if (duration === 'month') {
    grouped = groupBy(table, (u) => moment(u.d).format('YYYY-MM'));

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
    grouped = groupBy(table, (u) =>
      moment(u.d).startOf('week').format('YYYY-MM-DD'),
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
    grouped = groupBy(table, (u) => moment(u.d).format('YYYY-MM-DD'));
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
    grouped = groupBy(table, (u) => moment(u.d).format('YYYY-MM-DD LT'));
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

const selectDateRange = (state: State) => state.stats.dateRange;
const selectData: (
  state: State,
  smartList: number,
  statistic: number,
) => StatisticPointTable = (state, smartList, statistic) => {
  if (
    state.stats.bySmartListId[smartList] &&
    state.stats.bySmartListId[smartList][statistic] &&
    state.stats.bySmartListId[smartList][statistic].data
  ) {
    return state.stats.bySmartListId[smartList][statistic];
  }
  return {
    loading: false,
    data_type: '',
    data: [],
  };
};

export const smartlistStatSelector = createCachedSelector(
  selectDateRange,
  selectData,
  (dateRange, data) => {
    if (data.data_type === 'temporal') {
      const filteredData = data.data
        .filter((item: StatisticPoint) =>
          moment(item.d).isBefore(moment(dateRange.end)),
        )
        .filter((item: StatisticPoint) =>
          moment(item.d).isAfter(moment(dateRange.start)),
        );
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

export const getStatisticLoading = (
  state: State,
  smartList: number,
  statistic: number,
) => {
  if (
    state.stats.bySmartListId[smartList] &&
    state.stats.bySmartListId[smartList][statistic]
  ) {
    return state.stats.bySmartListId[smartList][statistic].loading;
  }
  return true;
};

export const getBookingRelatedStatisticLoading = (
  state: State,
  statistic: string,
) => {
  if (state.stats.stats && state.stats.stats[statistic]) {
    return state.stats.stats[statistic].isLoading;
  }
  return true;
};
