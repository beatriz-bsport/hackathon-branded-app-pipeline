// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  marketingNotificationListActions,
  marketingNotificationCreateOrUpdateActions,
  deleteMarketingNotificationActions,
} from './actions';

import type { MarketingNotification } from './types';

const initialState: MarketingNotification = Immutable({
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
      return state.set('notifications', payload);
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
    [deleteMarketingNotificationActions.success]: (state, { payload }) => {
      return state.set(
        'notifications',
        state.notifications.filter((u) => u.id !== payload),
      );
    },
  },
  initialState,
);
