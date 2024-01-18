import Immutable from 'seamless-immutable';
import uniq from 'lodash/uniq';
import { handleActions } from 'redux-actions';
import type { AxiosResponse } from 'axios';

import {
  fetchMyPastBookingAsMemberActions,
  fetchMyFutureBookingAsMemberActions,
  fetchMyPastBookingWorkshopAsMemberActions,
  fetchMyFutureBookingWorkshopAsMemberActions,
  resetConsumerStateActions,
  fetchMyPastPrivateBookingAsMemberActions,
  fetchMyFuturePrivateBookingAsMemberActions,
} from './actions';

import type { ConsumerStateReworked } from './types';
import type { BookingREST } from '#libs/booking/types';
import type { PaginatedResponse } from '../../state/types';
import type { PrivateBooking } from '#libs/private-service/types';

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
        waitlist: {
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
      privateBookings: {
        future: {
          page: 1,
          next_page: null,
          previous_page: null,
          count: 0,
          loading: false,
          error: null,
          private_services: {
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
          private_services: {
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
        waitlist: {
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
      { payload }: { payload: Error | null },
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
                      (acc, booking) => {
                        acc[booking.id] = booking;
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
                      (acc, booking) => {
                        acc[booking.id] = booking;
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
    [fetchMyPastPrivateBookingAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['myBookings', 'privateBookings', 'past', 'loading'],
        payload,
      );
    },
    [fetchMyPastPrivateBookingAsMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['myBookings', 'privateBookings', 'past', 'error'],
        payload,
      );
    },
    [fetchMyPastPrivateBookingAsMemberActions.success.toString()]: (
      state,
      {
        payload,
      }: { payload: AxiosResponse<PaginatedResponse<PrivateBooking>> },
    ) => {
      const { next_page, results, count, page } = payload.data;

      return state
        .setIn(['myBookings', 'privateBookings', 'past', 'page'], page)
        .setIn(
          ['myBookings', 'privateBookings', 'past', 'next_page'],
          next_page,
        )
        .setIn(['myBookings', 'privateBookings', 'past', 'count'], count)
        .updateIn(
          [
            'myBookings',
            'privateBookings',
            'past',
            'private_services',
            'allIds',
          ],
          (myList, newIds) => myList.concat(newIds),
          uniq(results.map((privateBooking) => privateBooking.id)),
        )
        .merge(
          {
            myBookings: {
              privateBookings: {
                past: {
                  private_services: {
                    byId: results.reduce<PayloadReduceType<PrivateBooking>>(
                      (acc, privateBooking) => {
                        acc[privateBooking.id] = privateBooking;
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
    [fetchMyFuturePrivateBookingAsMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['myBookings', 'privateBookings', 'future', 'loading'],
        payload,
      );
    },
    [fetchMyFuturePrivateBookingAsMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['myBookings', 'privateBookings', 'future', 'error'],
        payload,
      );
    },
    [fetchMyFuturePrivateBookingAsMemberActions.success.toString()]: (
      state,
      {
        payload,
      }: { payload: AxiosResponse<PaginatedResponse<PrivateBooking>> },
    ) => {
      const { next_page, results, count, page } = payload.data;

      return state
        .setIn(['myBookings', 'privateBookings', 'future', 'page'], page)
        .setIn(
          ['myBookings', 'privateBookings', 'future', 'next_page'],
          next_page,
        )
        .setIn(['myBookings', 'privateBookings', 'future', 'count'], count)
        .updateIn(
          [
            'myBookings',
            'privateBookings',
            'future',
            'private_services',
            'allIds',
          ],
          (myList, newIds) => myList.concat(newIds),
          uniq(results.map((privateBooking) => privateBooking.id)),
        )
        .merge(
          {
            myBookings: {
              privateBookings: {
                future: {
                  private_services: {
                    byId: results.reduce<PayloadReduceType<PrivateBooking>>(
                      (acc, privateBooking) => {
                        acc[privateBooking.id] = privateBooking;
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
                      (acc, booking) => {
                        acc[booking.id] = booking;
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
                      (acc, booking) => {
                        acc[booking.id] = booking;
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
    [resetConsumerStateActions.all.toString()]: (state) => {
      return state.setIn(['myBookings'], {
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
          waitlist: {
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
        privateBookings: {
          future: {
            page: 1,
            next_page: null,
            previous_page: null,
            count: 0,
            loading: false,
            error: null,
            private_services: {
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
            private_services: {
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
          waitlist: {
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
      });
    },
  },
  initialState,
);
