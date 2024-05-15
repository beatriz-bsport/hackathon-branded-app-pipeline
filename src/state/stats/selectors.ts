import groupBy from 'lodash/groupBy';
import moment, { Moment } from 'moment-timezone';
import { DateTime } from 'luxon';
import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';

import { Dictionary } from 'lodash/index';
import Immutable from 'seamless-immutable';
import type { RootState } from 'src/reducers';
import type {
  DateRange,
  NumberDateRange,
  StatisticPoint,
  StringStatisticPoint,
  StringStatisticPointTable,
} from './types';
import {
  DAILY_DURATION_DISPLAY_LIMIT,
  WEEKLY_DURATION_DISPLAY_LIMIT,
  MONTHLY_DURATION_DISPLAY_LIMIT_60_DAYS,
  // @ts-ignore
} from '#libs/statistics/utils';

export const mainChartSelector = (state: RootState) => state.stats.mainChart;
export const dateRangeSelector = createSelector(
  (state: RootState) => state.stats.dateRange,
  (dateRange: NumberDateRange) => ({
    start: DateTime.fromMillis(dateRange.start),
    end: DateTime.fromMillis(dateRange.end),
    kind: dateRange.kind,
  }),
);

const selectOffersFromCalendar = (state: RootState) => state.offer.calendar;

const selectCreatedBookings = (
  state: RootState,
): Immutable.ImmutableArray<Immutable.Immutable<StatisticPoint>> =>
  state.stats.stats.createdBookings?.data;

const selectCancelledBookings = (
  state: RootState,
): Immutable.ImmutableArray<Immutable.Immutable<StatisticPoint>> =>
  state.stats.stats.cancelledBookings?.data;

const selectOffersWaitingList = (
  state: RootState,
): Immutable.ImmutableArray<Immutable.Immutable<StatisticPoint>> =>
  state.stats.stats.waitingLists?.data;

const selectStart = (state: RootState, start: string) => start;

const selectEnd = (state: RootState, start: string, end: string) => end;

export const getStats: (
  state: RootState,
  start: string,
  end: string,
) => {
  createdBookings: Immutable.ImmutableArray<
    Immutable.Immutable<StatisticPoint>
  >;
  cancelledBookings: Immutable.ImmutableArray<
    Immutable.Immutable<StatisticPoint>
  >;
  offers: Immutable.ImmutableArray<Immutable.Immutable<StatisticPoint>>;
  waitingLists: Immutable.ImmutableArray<Immutable.Immutable<StatisticPoint>>;
  start: Moment;
  end: Moment;
} = createSelector(
  [
    selectCreatedBookings,
    selectCancelledBookings,
    selectOffersFromCalendar,
    selectOffersWaitingList,
    selectStart,
    selectEnd,
  ],
  (createdBookings, cancelledBookings, offers, waitingLists, start, end) => {
    if (createdBookings && cancelledBookings && start && end) {
      const startMoment = moment(start);
      const endMoment = moment(end);
      const formattedOffers = offers
        .filter(
          (offer) =>
            offer.available &&
            moment(offer.date_start, 'YYYY-MM-DD HH').isBetween(
              startMoment,
              endMoment,
            ),
        )
        .map((offer) => {
          return Immutable({
            d: moment(offer.date_start, 'YYYY-MM-DD HH').valueOf(),
            v: 1,
          });
        });
      return {
        createdBookings,
        cancelledBookings,
        offers: formattedOffers,
        waitingLists,
        start: startMoment,
        end: endMoment,
      };
    }
    return null;
  },
);

function discretizeDataBy(table: StringStatisticPoint[], dateRange: DateRange) {
  const duration = dateRange.end.diff(dateRange.start);
  if (duration.as('days') > MONTHLY_DURATION_DISPLAY_LIMIT_60_DAYS) {
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
  if (duration.as('days') > WEEKLY_DURATION_DISPLAY_LIMIT) {
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
  if (duration.as('days') > DAILY_DURATION_DISPLAY_LIMIT) {
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
  table: StringStatisticPoint[],
  duration: string,
  reducer: (
    previousValue: 0,
    currentValue: StringStatisticPoint,
    currentIndex: number,
    array: StringStatisticPoint[],
  ) => number,
) {
  let grouped: Dictionary<StringStatisticPoint[]> = {};

  if (duration === 'month') {
    grouped = groupBy(table, (u) => DateTime.fromISO(u.d).toFormat('yyyy-MM'));

    for (
      let m = dateRange.start;
      m < dateRange.end;
      m = m.plus({ months: 1 })
    ) {
      if (!grouped[m.toFormat('yyyy-MM')]) {
        grouped[m.toFormat('yyyy-MM')] = [
          {
            v: 0,
          },
        ];
      }
    }
  }

  if (duration === 'week') {
    grouped = groupBy(table, (u) =>
      DateTime.fromISO(u.d)
        .startOf('week', { useLocaleWeeks: true })
        .toISODate(),
    );
    for (
      let m = dateRange.start.startOf('week', { useLocaleWeeks: true });
      m < dateRange.end;
      m = m.plus({ days: 7 })
    ) {
      if (!grouped[m.toISODate()]) {
        grouped[m.toISODate()] = [
          {
            v: 0,
          },
        ];
      }
    }
  }

  if (duration === 'day') {
    grouped = groupBy(table, (u) => DateTime.fromISO(u.d).toISODate());
    for (let m = dateRange.start; m <= dateRange.end; m = m.plus({ days: 1 })) {
      if (!grouped[m.toISODate()]) {
        grouped[m.toISODate()] = [
          {
            v: 0,
          },
        ];
      }
    }
  }

  if (duration === 'hour') {
    grouped = groupBy(table, (u) =>
      DateTime.fromISO(u.d).toFormat('yyyy-MM-dd t'),
    );
    for (
      let m = dateRange.start;
      m <= dateRange.end;
      m = m.plus({ hours: 1 })
    ) {
      if (!grouped[m.toFormat('yyyy-MM-dd t')]) {
        grouped[m.toFormat('yyyy-MM-dd t')] = [{ v: 0 }];
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
      if (DateTime.fromISO(a.d) < DateTime.fromISO(b.d)) {
        return -1;
      }
      return 1;
    });
  return finalTable;
}

const selectDateRange = (state: RootState) => state.stats.dateRange;
const selectData: (
  state: RootState,
  smartList: number,
  statistic: number,
) => StringStatisticPointTable = (state, smartList, statistic) => {
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
  (dateRange: NumberDateRange, data) => {
    if (data.data_type === 'temporal') {
      const filteredData = data.data
        .filter(
          (item: StringStatisticPoint) =>
            DateTime.fromISO(item.d) < DateTime.fromMillis(dateRange.end),
        )
        .filter(
          (item: StringStatisticPoint) =>
            DateTime.fromISO(item.d) > DateTime.fromMillis(dateRange.start),
        );
      const discretizedData = discretizeDataBy(filteredData, {
        start: DateTime.fromMillis(dateRange.start),
        end: DateTime.fromMillis(dateRange.end),
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
  state: RootState,
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
  state: RootState,
  statistic: string,
) => {
  if (state.stats.stats && state.stats.stats[statistic]) {
    return state.stats.stats[statistic].isLoading;
  }
  return true;
};
