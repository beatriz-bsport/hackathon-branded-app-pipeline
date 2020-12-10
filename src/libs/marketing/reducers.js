// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  marketingNotificationListActions,
  marketingNotificationCreateOrUpdateActions,
  deleteMarketingNotificationActions,
  marketingNotificationCreateActions,
  marketingNotificationUpdateActions,
} from './actions';

import type { MarketingNotification } from './types';

const initialState: MarketingNotification = Immutable({
  byId: {},
  allIds: [],
  notifications: [],
  loading: false,
  error: null,
  createOrUpdate: {
    loading: false,
    error: null,
  },
});

export default handleActions(
  {
    [marketingNotificationListActions.success]: (state, { payload }) => {
      return state
        .setIn(['notifications'], payload)
        .setIn(
          ['byId'],
          payload.reduce((acc, n) => {
            acc[n.id] = n;
            return acc;
          }, {}),
        )
        .setIn(['allIds'], payload.map((notif) => notif.id));
    },
    [marketingNotificationListActions.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [marketingNotificationListActions.error]: (state, { payload }) => {
      return state.set('error', payload);
    },

    [marketingNotificationCreateOrUpdateActions.error]: (
      state,
      { payload },
    ) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [marketingNotificationCreateOrUpdateActions.isLoading]: (
      state,
      { payload },
    ) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [marketingNotificationCreateOrUpdateActions.success]: (
      state,
      { payload },
    ) => {
      return state.merge({ byId: { [payload.id]: payload } }, { deep: true });
    },
    [deleteMarketingNotificationActions.success]: (state, { payload }) => {
      const byId = { ...state.byId };
      delete byId[payload];
      return state
        .set(
          'notifications',
          state.notifications.filter((u) => u.id !== payload),
        )
        .setIn(['allIds'], state.allIds.filter((id) => id !== payload))
        .setIn(['byId'], byId);
    },
    [marketingNotificationCreateActions.isLoading]: (state, { payload }) => {
      return state.setIn(['loading'], payload);
    },
    [marketingNotificationCreateActions.error]: (state, { payload }) => {
      return state.setIn(['error'], payload);
    },
    [marketingNotificationCreateActions.success]: (state, { payload }) => {
      return state
        .merge({ byId: { [payload.id]: payload } }, { deep: true })
        .setIn(['allIds'], [...state.allIds, payload.id]);
    },
    [marketingNotificationUpdateActions.isLoading]: (state, { payload }) => {
      return state.setIn(['loading'], payload);
    },
    [marketingNotificationUpdateActions.error]: (state, { payload }) => {
      return state.setIn(['error'], payload);
    },
    [marketingNotificationUpdateActions.success]: (state, { payload }) => {
      return state.merge({ byId: { [payload.id]: payload } }, { deep: true });
    },
  },
  initialState,
);
