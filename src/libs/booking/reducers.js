// @flow

import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';
import {
  byOfferActions,
  byMemberActions,
  asConsumerActions,
  bulkActions,
  consumerDashboardActions,
  byConsumerPackActions,
  retrieveBookingBroadcastRoom,
  retrieveActions,
  updateActions,
  notificationListActions,
  notificationCreateActions,
  notificationDeleteActions,
  notificationUpdateActions,
} from './actions';
import type { BookingsState } from './types';

const initialState: BookingsState = Immutable({
  byId: {},
  broadcast: {
    byId: {},
    loading: false,
    error: null,
  },
  byMember: {
    loading: false,
    error: null,
    allIds: [],
    count: 0,
    page: 1,
  },
  asConsumer: {
    loading: false,
    error: null,
    allIds: [],
    count: 0,
    page: 1,
  },
  consumerDashboard: {
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
  bulkRetrieve: {
    loading: false,
    error: null,
  },
  notification: {
    itemsById: {},
    allIds: [],
    loading: false,
    error: null,
    create: {
      loading: false,
      error: null,
    },
    delete: {
      loading: false,
      error: null,
    },
    update: {
      id: null,
      error: null,
    },
  },
});

export default handleActions(
  {
    [retrieveBookingBroadcastRoom.isLoading]: (state, { payload }) => {
      return state.setIn(['broadcast', 'loading'], payload);
    },
    [retrieveBookingBroadcastRoom.error]: (state, { payload }) => {
      return state.setIn(['broadcast', 'error'], payload);
    },
    [retrieveBookingBroadcastRoom.success]: (state, { payload }) => {
      return state.setIn(['broadcast', 'byId', payload.id], payload);
    },
    [updateActions.isLoading]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [updateActions.error]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [updateActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [asConsumerActions.isLoading]: (state, { payload }) => {
      return state.setIn(['asConsumer', 'loading'], payload);
    },
    [asConsumerActions.error]: (state, { payload }) => {
      return state.setIn(['asConsumer', 'error'], payload);
    },
    [asConsumerActions.success]: (state, { payload }) => {
      return state
        .setIn(['asConsumer', 'page'], payload.page)
        .setIn(['asConsumer', 'count'], payload.count)
        .setIn(['asConsumer', 'allIds'], payload.results.map((b) => b.id))
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
    [consumerDashboardActions.isLoading]: (state, { payload }) => {
      return state.setIn(['consumerDashboard', 'loading'], payload);
    },
    [consumerDashboardActions.error]: (state, { payload }) => {
      return state.setIn(['consumerDashboard', 'error'], payload);
    },
    [consumerDashboardActions.success]: (state, { payload }) => {
      const newIds = payload.results.map((b) => b.id);
      return state
        .setIn(['consumerDashboard', 'page'], payload.page)
        .setIn(['consumerDashboard', 'next_page'], payload.next_page)
        .setIn(['consumerDashboard', 'count'], payload.count)
        .setIn(
          ['consumerDashboard', 'allIds'],
          payload.page === 1
            ? newIds
            : [...state.consumerDashboard.allIds, ...newIds],
        )
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
    [bulkActions.isLoading]: (state, { payload }) => {
      return state.setIn(['bulkRetrieve', 'loading'], payload);
    },
    [bulkActions.error]: (state, { payload }) => {
      return state.setIn(['bulkRetrieve', 'error'], payload);
    },
    [bulkActions.success]: (state, { payload }) => {
      return state.merge(
        {
          byId: payload.reduce((acc, ps) => {
            acc[ps.id] = ps;
            return acc;
          }, {}),
        },
        { deep: true },
      );
    },
    [notificationListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['notification', 'loading'], payload);
    },
    [notificationListActions.error]: (state, { payload }) => {
      return state.setIn(['notification', 'error'], payload);
    },
    [notificationListActions.success]: (state, { payload }) => {
      return state
        .setIn(['notification', 'itemsById'], payload.notifDict)
        .setIn(['notification', 'allIds'], payload.notifIdList);
    },
    [notificationCreateActions.isLoading]: (state, { payload }) => {
      return state.setIn(['notification', 'create', 'loading'], payload);
    },
    [notificationCreateActions.error]: (state, { payload }) => {
      return state.setIn(['notification', 'create', 'error'], payload);
    },
    [notificationCreateActions.success]: (state, { payload }) => {
      return state.merge(
        { notification: { itemsById: { [payload.id]: payload } } },
        { deep: true },
      );
    },
    [notificationDeleteActions.isLoading]: (state, { payload }) => {
      return state.setIn(['notification', 'delete', 'loading'], payload);
    },
    [notificationDeleteActions.error]: (state, { payload }) => {
      return state.setIn(['notification', 'delete', 'error'], payload);
    },
    [notificationDeleteActions.success]: (state, { payload }) => {
      const items = { ...state.notification.itemsById };
      const ids = [...state.notification.allIds];
      delete items[payload];
      ids.splice(ids.findIndex((id) => id === payload), 1);
      return state
        .setIn(['notification', 'itemsById'], items)
        .setIn(['notification', 'allIds'], ids);
    },
    [notificationUpdateActions.isLoading]: (state, { payload }) => {
      return state.setIn(['notification', 'update', 'id'], payload);
    },
    [notificationUpdateActions.error]: (state, { payload }) => {
      return state.setIn(['notification', 'update', 'error'], payload);
    },
    [notificationUpdateActions.success]: (state, { payload }) => {
      return state.merge(
        { notification: { itemsById: { [payload.id]: payload } } },
        { deep: true },
      );
    },
  },
  initialState,
);
