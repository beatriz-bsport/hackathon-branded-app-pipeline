import { DateTime, Interval } from 'luxon';
import { createSelector } from 'reselect';

import Immutable from 'seamless-immutable';
import type { RootState } from 'src/reducers';

import type { NumberDateRange, StringStatisticPoint } from './types';

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
): Immutable.ImmutableArray<Immutable.Immutable<StringStatisticPoint>> =>
  state.stats.stats.createdBookings?.data;

const selectCancelledBookings = (
  state: RootState,
): Immutable.ImmutableArray<Immutable.Immutable<StringStatisticPoint>> =>
  state.stats.stats.cancelledBookings?.data;

const selectOffersWaitingList = (
  state: RootState,
): Immutable.ImmutableArray<Immutable.Immutable<StringStatisticPoint>> =>
  state.stats.stats.waitingLists?.data;

const selectStart = (state: RootState, start: string) => start;

const selectEnd = (state: RootState, start: string, end: string) => end;

export const getStats: (
  state: RootState,
  start: string,
  end: string,
) => {
  createdBookings: Immutable.ImmutableArray<
    Immutable.Immutable<StringStatisticPoint>
  >;
  cancelledBookings: Immutable.ImmutableArray<
    Immutable.Immutable<StringStatisticPoint>
  >;
  offers: Immutable.ImmutableArray<Immutable.Immutable<StringStatisticPoint>>;
  waitingLists: Immutable.ImmutableArray<
    Immutable.Immutable<StringStatisticPoint>
  >;
  start: string;
  end: string;
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
      const startMoment = DateTime.fromISO(start);
      const endMoment = DateTime.fromISO(end);

      const interval = Interval.fromDateTimes(startMoment, endMoment);
      const formattedOffers = offers
        .filter(
          (offer) =>
            offer.available &&
            interval.contains(DateTime.fromISO(offer.date_start)),
        )
        .map((offer) => {
          return Immutable({
            d: DateTime.fromISO(offer.date_start).toISO(),
            v: 1,
          });
        });
      return {
        createdBookings,
        cancelledBookings,
        offers: formattedOffers,
        waitingLists,
        start: startMoment.toISO(),
        end: endMoment.toISO(),
      };
    }
    return null;
  },
);

export const getBookingRelatedStatisticLoading = (
  state: RootState,
  statistic: string,
) => {
  if (state.stats.stats && state.stats.stats[statistic]) {
    return state.stats.stats[statistic].isLoading;
  }
  return true;
};
