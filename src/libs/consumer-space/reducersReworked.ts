import Immutable from 'seamless-immutable';
import uniq from 'lodash/uniq';
import { handleActions } from 'redux-actions';
import type { AxiosResponse } from 'axios';

import {
  fetchMyPastBookingAsMemberActions,
  fetchMyFutureBookingAsMemberActions,
  fetchMyPastBookingWorkshopAsMemberActions,
  fetchMyFutureBookingWorkshopAsMemberActions,
} from './actions';

import type { ConsumerStateReworked } from './types';
import type { BookingREST } from '#libs/booking/types';
import type { PaginatedResponse } from '../../state/types';

type PayloadReduceType<T> = { [id: number]: T };
const initialState: Immutable.Immutable<ConsumerStateReworked> =
  Immutable<ConsumerStateReworked>({
    myBookings: {
      bookings: {
        future: {
          page: 1,
          next_page: null,
          previous_page: null,
          count: 0,
          loading: false,
          error: null,
          bookings: {
            allIds: [],
            byId: {},
          },
        },
        past: {
          page: 1,
          next_page: null,
          previous_page: null,
          count: 0,
          loading: false,
          error: null,
          bookings: {
            allIds: [],
            byId: {},
          },
        },
      },
      bookingsWorkshop: {
        future: {
          page: 1,
          next_page: null,
          previous_page: null,
          count: 0,
          loading: false,
          error: null,
          bookings: {
            allIds: [],
            byId: {},
          },
        },
        past: {
          page: 1,
          next_page: null,
          previous_page: null,
          count: 0,
          loading: false,
          error: null,
          bookings: {
            allIds: [],
            byId: {},
          },
        },
      },
    },
  });

export default handleActions<Immutable.Immutable<ConsumerStateReworked>, any>(
  {
    [fetchMyPastBookingAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['myBookings', 'bookings', 'past', 'loading'],
        payload,
      );
    },
    [fetchMyPastBookingAsMemberActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['myBookings', 'bookings', 'past', 'error'], payload);
    },
    [fetchMyPastBookingAsMemberActions.success.toString()]: (
      state,
      { payload }: { payload: AxiosResponse<PaginatedResponse<BookingREST>> },
    ) => {
      const { next_page, results, count, page } = payload.data;

      return state
        .setIn(['myBookings', 'bookings', 'past', 'page'], page)
        .setIn(['myBookings', 'bookings', 'past', 'next_page'], next_page)
        .setIn(['myBookings', 'bookings', 'past', 'count'], count)
        .updateIn(
          ['myBookings', 'bookings', 'past', 'bookings', 'allIds'],
          (myList, newIds) => myList.concat(newIds),
          uniq(results.map((booking) => booking.id)),
        )
        .merge(
          {
            myBookings: {
              bookings: {
                past: {
                  bookings: {
                    byId: results.reduce<PayloadReduceType<BookingREST>>(
                      (acc, ps) => {
                        acc[ps.id] = ps;
                        return acc;
                      },
                      {},
                    ),
                  },
                },
              },
            },
          },
          { deep: true },
        );
    },
    [fetchMyFutureBookingAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['myBookings', 'bookings', 'future', 'loading'],
        payload,
      );
    },
    [fetchMyFutureBookingAsMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['myBookings', 'bookings', 'future', 'error'],
        payload,
      );
    },
    [fetchMyFutureBookingAsMemberActions.success.toString()]: (
      state,
      { payload }: { payload: AxiosResponse<PaginatedResponse<BookingREST>> },
    ) => {
      const { next_page, results, count, page } = payload.data;

      return state
        .setIn(['myBookings', 'bookings', 'future', 'page'], page)
        .setIn(['myBookings', 'bookings', 'future', 'next_page'], next_page)
        .setIn(['myBookings', 'bookings', 'future', 'count'], count)
        .updateIn(
          ['myBookings', 'bookings', 'future', 'bookings', 'allIds'],
          (myList, newIds) => myList.concat(newIds),
          uniq(results.map((booking) => booking.id)),
        )
        .merge(
          {
            myBookings: {
              bookings: {
                future: {
                  bookings: {
                    byId: results.reduce<PayloadReduceType<BookingREST>>(
                      (acc, ps) => {
                        acc[ps.id] = ps;
                        return acc;
                      },
                      {},
                    ),
                  },
                },
              },
            },
          },
          { deep: true },
        );
    },
    [fetchMyPastBookingWorkshopAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['myBookings', 'bookingsWorkshop', 'past', 'loading'],
        payload,
      );
    },
    [fetchMyPastBookingWorkshopAsMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['myBookings', 'bookingsWorkshop', 'past', 'error'],
        payload,
      );
    },
    [fetchMyPastBookingWorkshopAsMemberActions.success.toString()]: (
      state,
      { payload }: { payload: AxiosResponse<PaginatedResponse<BookingREST>> },
    ) => {
      const { next_page, results, count, page } = payload.data;

      return state
        .setIn(['myBookings', 'bookingsWorkshop', 'past', 'page'], page)
        .setIn(
          ['myBookings', 'bookingsWorkshop', 'past', 'next_page'],
          next_page,
        )
        .setIn(['myBookings', 'bookingsWorkshop', 'past', 'count'], count)
        .updateIn(
          ['myBookings', 'bookingsWorkshop', 'past', 'bookings', 'allIds'],
          (myList, newIds) => myList.concat(newIds),
          uniq(results.map((booking) => booking.id)),
        )
        .merge(
          {
            myBookings: {
              bookingsWorkshop: {
                past: {
                  bookings: {
                    byId: results.reduce<PayloadReduceType<BookingREST>>(
                      (acc, ps) => {
                        acc[ps.id] = ps;
                        return acc;
                      },
                      {},
                    ),
                  },
                },
              },
            },
          },
          { deep: true },
        );
    },
    [fetchMyFutureBookingWorkshopAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['myBookings', 'bookingsWorkshop', 'future', 'loading'],
        payload,
      );
    },
    [fetchMyFutureBookingWorkshopAsMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['myBookings', 'bookingsWorkshop', 'future', 'error'],
        payload,
      );
    },
    [fetchMyFutureBookingWorkshopAsMemberActions.success.toString()]: (
      state,
      { payload }: { payload: AxiosResponse<PaginatedResponse<BookingREST>> },
    ) => {
      const { next_page, results, count, page } = payload.data;

      return state
        .setIn(['myBookings', 'bookingsWorkshop', 'future', 'page'], page)
        .setIn(
          ['myBookings', 'bookingsWorkshop', 'future', 'next_page'],
          next_page,
        )
        .setIn(['myBookings', 'bookingsWorkshop', 'future', 'count'], count)
        .updateIn(
          ['myBookings', 'bookingsWorkshop', 'future', 'bookings', 'allIds'],
          (myList, newIds) => myList.concat(newIds),
          uniq(results.map((booking) => booking.id)),
        )
        .merge(
          {
            myBookings: {
              bookingsWorkshop: {
                future: {
                  bookings: {
                    byId: results.reduce<PayloadReduceType<BookingREST>>(
                      (acc, ps) => {
                        acc[ps.id] = ps;
                        return acc;
                      },
                      {},
                    ),
                  },
                },
              },
            },
          },
          { deep: true },
        );
    },
  },
  initialState,
);
