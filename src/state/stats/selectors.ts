import groupBy from 'lodash/groupBy';
import moment, { Moment } from 'moment-timezone';
import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';

import { Dictionary } from 'lodash/index';
import Immutable from 'seamless-immutable';
import type { RootState } from 'src/reducers';
import { DateRange, StatisticPoint, StatisticPointTable } from './types';
import {
  DAILY_DURATION_DISPLAY_LIMIT,
  WEEKLY_DURATION_DISPLAY_LIMIT,
  MONTHLY_DURATION_DISPLAY_LIMIT_60_DAYS,
  // @ts-ignore
} from '#libs/statistics/utils';

export const mainChartSelector = (state: RootState) => state.stats.mainChart;
export const dateRangeSelector = createSelector(
  (state: RootState) => state.stats.dateRange,
  (dateRange) => ({
    start: moment(dateRange.start),
    end: moment(dateRange.end),
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
  start: Moment;
  end: Moment;
} = createSelector(
  [
    selectCreatedBookings,
    selectCancelledBookings,
    selectOffersFromCalendar,
    selectStart,
    selectEnd,
  ],
  (createdBookings, cancelledBookings, offers, start, end) => {
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

const selectDateRange = (state: RootState) => state.stats.dateRange;
const selectData: (
  state: RootState,
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
