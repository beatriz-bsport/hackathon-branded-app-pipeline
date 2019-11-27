// @flow

import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';
import {
  actionTypes,
  byOfferActions,
  byMemberActions,
  byConsumerPackActions,
  retrieveActions,
  updateActions,
} from './actions';
import type { BookingsState, BookingsAction } from './types';

const initialState = Immutable({
  // OLD STUFF
  loading: false,
  all: [],
  options: [],
  bookingsUpdating: [],
  bookingOptionsUpdating: [],

  // NEW STUFF
  byId: {},
  byMember: {
    loading: false,
    error: null,
    allIds: [],
    count: 0,
    page: 1,
  },
  byConsumerPack: {
    loading: false,
    error: null,
    allIds: [],
    count: 0,
    page: 1,
  },
  byOffer: {
    loading: false,
    error: null,
    allIds: [],
  },
  createOrUpdate: {
    error: null,
    loading: false,
  },
});

function bookingReducers(
  state: BookingsState = initialState,
  action: BookingsAction = { type: null },
): BookingsState {
  switch (action.type) {
    case actionTypes.ERROR_UPDATING_BOOKING_OPTION: {
      const { bookingOptionId } = action;
      return state.set(
        'bookingOptionsUpdating',
        state.bookingOptionsUpdating.filter((id) => id !== bookingOptionId),
      );
    }
    case actionTypes.START_UPDATING_BOOKING_OPTION:
      return state.set('bookingOptionsUpdating', [
        action.bookingOptionId,
        ...state.bookingOptionsUpdating,
      ]);

    case actionTypes.BOOKING_OPTION_REGISTER_SUCCESS: {
      const { bookingOption } = action;
      return state.set('options', [...state.options, bookingOption]);
    }
    case actionTypes.BOOKING_OPTION_CANCELLED: {
      const { bookingOptionId } = action;
      return state
        .set('options', state.options.filter((o) => o.id !== bookingOptionId))
        .set(
          'bookingOptionsUpdating',
          state.bookingOptionsUpdating.filter((id) => id !== bookingOptionId),
        );
    }

    case actionTypes.ERROR_UPDATING_BOOKING_STATUS: {
      const { bookingId } = action;
      return state.set(
        'bookingsUpdating',
        state.bookingsUpdating.filter((b) => b.id !== bookingId),
      );
    }
    case actionTypes.START_UPDATING_BOOKING_STATUS: {
      const { bookingId } = action;
      return state.set('bookingsUpdating', [
        bookingId,
        ...state.bookingsUpdating,
      ]);
    }
    case actionTypes.BOOKING_STATUS_UPDATED: {
      const { booking, bookingId } = action;
      let idx = state.all.findIndex((b) => b.id === booking.id);
      if (idx === -1) {
        idx = state.all.length;
      }
      return state
        .setIn(['all', idx], booking)
        .set(
          'bookingsUpdating',
          state.bookingsUpdating.filter((id) => id !== bookingId),
        );
    }
    case actionTypes.HAS_FETCHED_BOOKINGS: {
      const { bookings, booking_options } = action;
      return state
        .set('all', bookings)
        .set('loading', false)
        .set('options', booking_options)
        .set('bookingOptionsUpdating', [])
        .set('bookingsUpdating', []);
    }

    case actionTypes.START_FETCH_BOOKINGS: {
      return state
        .set('loading', true)
        .set('all', [])
        .set('options', []);
    }

    case actionTypes.ERROR_FETCHING_BOOKINGS:
      return state.set('loading', false);

    case actionTypes.BOOKING_ADD_SUCCESS: {
      return state.set('all', [action.booking, ...state.all]);
    }

    case actionTypes.BOOKING_DELETE_ERROR:
    case actionTypes.BOOKING_DELETE_START:
      return state;
    case actionTypes.BOOKING_DELETE_SUCCESS: {
      const { bookingId } = action;
      return state.set('all', state.all.filter((b) => b.id !== bookingId));
    }

    default:
      return state;
  }
}

const newReducer = handleActions(
  {
    [updateActions.isLoading]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [updateActions.error]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [updateActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [byMemberActions.isLoading]: (state, { payload }) => {
      return state.setIn(['byMember', 'loading'], payload);
    },
    [byMemberActions.error]: (state, { payload }) => {
      return state.setIn(['byMember', 'error'], payload);
    },
    [byMemberActions.success]: (state, { payload }) => {
      return state
        .setIn(['byMember', 'page'], payload.page)
        .setIn(['byMember', 'count'], payload.count)
        .setIn(['byMember', 'allIds'], payload.results.map((b) => b.id))
        .merge(
          {
            byId: payload.results.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        );
    },
    [byConsumerPackActions.isLoading]: (state, { payload }) => {
      return state.setIn(['byMember', 'isLoading'], payload);
    },
    [byConsumerPackActions.error]: (state, { payload }) => {
      return state.setIn(['byMember', 'error'], payload);
    },
    [byConsumerPackActions.success]: (state, { payload }) => {
      return state
        .setIn(['byConsumerPack', 'page'], payload.page)
        .setIn(['byConsumerPack', 'count'], payload.count)
        .setIn(['byConsumerPack', 'allIds'], payload.results.map((b) => b.id))
        .merge(
          {
            byId: payload.results.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        );
    },
    [retrieveActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [byOfferActions.isLoading]: (state, { payload }) => {
      return state.setIn(['byOffer', 'loading'], payload);
    },
    [byOfferActions.error]: (state, { payload }) => {
      return state.setIn(['byOffer', 'error'], payload);
    },
    [byOfferActions.success]: (state, { payload }) => {
      return state
        .setIn(['byOffer', 'page'], payload.page)
        .setIn(['byOffer', 'count'], payload.count)
        .setIn(['byOffer', 'allIds'], payload.results.map((b) => b.id))
        .merge(
          {
            byId: payload.results.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        );
    },
  },
  initialState,
);

export default (state = initialState, action = { type: null }) =>
  newReducer(bookingReducers(state, action), action);
