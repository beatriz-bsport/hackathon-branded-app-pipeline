import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  marketingNotificationListActions,
  marketingNotificationCreateOrUpdateActions,
  deleteMarketingNotificationActions,
  marketingNotificationCreateActions,
  marketingNotificationUpdateActions,
} from './actions';

import type {
  MarketingNotification,
  MarketingNotificationState,
} from './types';

type State = Immutable.Immutable<MarketingNotificationState>;

const initialState: State = Immutable<MarketingNotificationState>({
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

export default handleActions<
  Immutable.Immutable<MarketingNotificationState>,
  any
>(
  {
    [marketingNotificationListActions.success.toString()]: (
      state,
      { payload }: { payload: any },
    ) => {
      return state
        .setIn(['notifications'], payload)
        .setIn(
          ['byId'],
          payload.reduce((acc: any, n: MarketingNotification) => {
            acc[n.id] = n;
            return acc;
          }, {}),
        )
        .setIn(
          ['allIds'],
          payload.map((notif: MarketingNotification) => notif.id),
        );
    },
    [marketingNotificationListActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.set('loading', payload);
    },
    [marketingNotificationListActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.set('error', payload);
    },

    [marketingNotificationCreateOrUpdateActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [marketingNotificationCreateOrUpdateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [marketingNotificationCreateOrUpdateActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.merge({ byId: { [payload.id]: payload } }, { deep: true });
    },
    [deleteMarketingNotificationActions.success.toString()]: (
      state,
      { payload },
    ) => {
      const byId = { ...state.byId };
      delete byId[payload];
      return state
        .set(
          'notifications',
          state.notifications.filter((u) => u.id !== payload),
        )
        .setIn(
          ['allIds'],
          state.allIds.filter((id) => id !== payload),
        )
        .setIn(['byId'], byId);
    },
    [marketingNotificationCreateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['loading'], payload);
    },
    [marketingNotificationCreateActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['error'], payload);
    },
    [marketingNotificationCreateActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return (
        state
          .merge({ byId: { [payload.id]: payload } }, { deep: true })
          // @ts-ignore
          .setIn(['allIds'], [...state.allIds, payload.id])
      );
    },
    [marketingNotificationUpdateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['loading'], payload);
    },
    [marketingNotificationUpdateActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['error'], payload);
    },
    [marketingNotificationUpdateActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.merge({ byId: { [payload.id]: payload } }, { deep: true });
    },
  },
  initialState,
);
