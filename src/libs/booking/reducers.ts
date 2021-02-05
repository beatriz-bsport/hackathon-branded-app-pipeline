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
  listRecurrenceRuleBookingActions,
  createRecurrenceRuleBookingActions,
  updateRecurrenceRuleBookingActions,
  deleteRecurrenceRuleBookingActions,
} from './actions';
import { BookingsState } from './types';

export const initialState: Immutable.Immutable<BookingsState> = Immutable<BookingsState>(
  {
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
      next_page: 1,
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
    recurrenceRule: {
      byId: {},
      allIds: [],
      allIds2: [],
      loading: false,
      error: null,
      count: 0,
      next_page: null,
      page: 1,
      delete: {
        error: null,
        loading: false,
      },
      edit: {
        loading: false,
        error: null,
      },
    },
  },
);

export default handleActions<Immutable.Immutable<BookingsState>>(
  {
    [retrieveBookingBroadcastRoom.isLoading.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['broadcast', 'loading'], payload);
    },
    [retrieveBookingBroadcastRoom.error.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['broadcast', 'error'], payload);
    },
    [retrieveBookingBroadcastRoom.success.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['broadcast', 'byId', payload.id], payload);
    },
    [updateActions.isLoading.toString()]: (state, { payload }: any) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [updateActions.error.toString()]: (state, { payload }: any) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [updateActions.success.toString()]: (state, { payload }: any) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [asConsumerActions.isLoading.toString()]: (state, { payload }: any) => {
      return state.setIn(['asConsumer', 'loading'], payload);
    },
    [asConsumerActions.error.toString()]: (state, { payload }: any) => {
      return state.setIn(['asConsumer', 'error'], payload);
    },
    [asConsumerActions.success.toString()]: (state, { payload }: any) => {
      return state
        .setIn(['asConsumer', 'page'], payload.page)
        .setIn(['asConsumer', 'count'], payload.count)
        .setIn(
          ['asConsumer', 'allIds'],
          payload.results.map((b: any) => b.id),
        )
        .merge(
          {
            byId: payload.results.reduce((acc: any, ps: any) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        );
    },
    [byMemberActions.isLoading.toString()]: (state, { payload }: any) => {
      return state.setIn(['byMember', 'loading'], payload);
    },
    [byMemberActions.error.toString()]: (state, { payload }: any) => {
      return state.setIn(['byMember', 'error'], payload);
    },
    [byMemberActions.success.toString()]: (state, { payload }: any) => {
      return state
        .setIn(['byMember', 'page'], payload.page)
        .setIn(['byMember', 'count'], payload.count)
        .setIn(
          ['byMember', 'allIds'],
          payload.results.map((b: any) => b.id),
        )
        .merge(
          {
            byId: payload.results.reduce((acc: any, ps: any) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        );
    },
    [byConsumerPackActions.isLoading.toString()]: (state, { payload }: any) => {
      return state.setIn(['byMember', 'isLoading'], payload);
    },
    [byConsumerPackActions.error.toString()]: (state, { payload }: any) => {
      return state.setIn(['byMember', 'error'], payload);
    },
    [byConsumerPackActions.success.toString()]: (state, { payload }: any) => {
      return state
        .setIn(['byConsumerPack', 'page'], payload.page)
        .setIn(['byConsumerPack', 'count'], payload.count)
        .setIn(
          ['byConsumerPack', 'allIds'],
          payload.results.map((b: any) => b.id),
        )
        .merge(
          {
            byId: payload.results.reduce((acc: any, ps: any) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        );
    },
    [retrieveActions.success.toString()]: (state, { payload }: any) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [byOfferActions.isLoading.toString()]: (state, { payload }: any) => {
      return state.setIn(['byOffer', 'loading'], payload);
    },
    [byOfferActions.error.toString()]: (state, { payload }: any) => {
      return state.setIn(['byOffer', 'error'], payload);
    },
    [byOfferActions.success.toString()]: (state, { payload }: any) => {
      return state
        .setIn(['byOffer', 'page'], payload.page)
        .setIn(['byOffer', 'count'], payload.count)
        .setIn(
          ['byOffer', 'allIds'],
          payload.results.map((b: any) => b.id),
        )
        .merge(
          {
            byId: payload.results.reduce((acc: any, ps: any) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        );
    },
    [consumerDashboardActions.isLoading.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['consumerDashboard', 'loading'], payload);
    },
    [consumerDashboardActions.error.toString()]: (state, { payload }: any) => {
      return state.setIn(['consumerDashboard', 'error'], payload);
    },
    [consumerDashboardActions.success.toString()]: (
      state,
      { payload }: any,
    ) => {
      const newIds = payload.results.map((b: any) => b.id);
      return state
        .setIn(['consumerDashboard', 'page'], payload.page)
        .setIn(['consumerDashboard', 'next_page'], payload.next_page)
        .setIn(['consumerDashboard', 'count'], payload.count)
        .setIn(
          ['consumerDashboard', 'allIds'],
          payload.page === 1
            ? newIds
            : [...state.consumerDashboard.allIds.asMutable(), ...newIds],
        )
        .merge(
          {
            byId: payload.results.reduce((acc: any, ps: any) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        );
    },
    [bulkActions.isLoading.toString()]: (state, { payload }: any) => {
      return state.setIn(['bulkRetrieve', 'loading'], payload);
    },
    [bulkActions.error.toString()]: (state, { payload }: any) => {
      return state.setIn(['bulkRetrieve', 'error'], payload);
    },
    [bulkActions.success.toString()]: (state, { payload }: any) => {
      return state.merge(
        {
          byId: payload.reduce((acc: any, ps: any) => {
            acc[ps.id] = ps;
            return acc;
          }, {}),
        },
        { deep: true },
      );
    },
    [notificationListActions.isLoading.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['notification', 'loading'], payload);
    },
    [notificationListActions.error.toString()]: (state, { payload }: any) => {
      return state.setIn(['notification', 'error'], payload);
    },
    [notificationListActions.success.toString()]: (state, { payload }: any) => {
      return state
        .setIn(['notification', 'itemsById'], payload.notifDict)
        .setIn(['notification', 'allIds'], payload.notifIdList);
    },
    [notificationCreateActions.isLoading.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['notification', 'create', 'loading'], payload);
    },
    [notificationCreateActions.error.toString()]: (state, { payload }: any) => {
      return state.setIn(['notification', 'create', 'error'], payload);
    },
    [notificationCreateActions.success.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.merge(
        { notification: { itemsById: { [payload.id]: payload } } },
        { deep: true },
      );
    },
    [notificationDeleteActions.isLoading.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['notification', 'delete', 'loading'], payload);
    },
    [notificationDeleteActions.error.toString()]: (state, { payload }: any) => {
      return state.setIn(['notification', 'delete', 'error'], payload);
    },
    [notificationDeleteActions.success.toString()]: (
      state,
      { payload }: any,
    ) => {
      const items = { ...state.notification.itemsById };
      const ids = [...state.notification.allIds.asMutable()];
      delete items[payload];
      ids.splice(
        ids.findIndex((id) => id === payload),
        1,
      );
      return state
        .setIn(['notification', 'itemsById'], items)
        .setIn(['notification', 'allIds'], ids);
    },
    [notificationUpdateActions.isLoading.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['notification', 'update', 'id'], payload);
    },
    [notificationUpdateActions.error.toString()]: (state, { payload }: any) => {
      return state.setIn(['notification', 'update', 'error'], payload);
    },
    [notificationUpdateActions.success.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.merge(
        { notification: { itemsById: { [payload.id]: payload } } },
        { deep: true },
      );
    },
    [createRecurrenceRuleBookingActions.success.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state
        .setIn(['recurrenceRule', 'byId', payload.id], payload)
        .setIn(
          ['recurrenceRule', 'allIds'],
          [...state.recurrenceRule.allIds.asMutable(), payload.id],
        );
    },
    [updateRecurrenceRuleBookingActions.isLoading.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['recurrenceRule', 'edit', 'loading'], payload);
    },
    [updateRecurrenceRuleBookingActions.error.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['recurrenceRule', 'edit', 'error'], payload);
    },
    [deleteRecurrenceRuleBookingActions.isLoading.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['recurrenceRule', 'delete', 'loading'], payload);
    },
    [deleteRecurrenceRuleBookingActions.error.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['recurrenceRule', 'delete', 'error'], payload);
    },
    [listRecurrenceRuleBookingActions.isLoading.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['recurrenceRule', 'loading'], payload);
    },
    [listRecurrenceRuleBookingActions.error.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['recurrenceRule', 'error'], payload);
    },
    [listRecurrenceRuleBookingActions.success.toString()]: (
      state,
      { payload }: any,
    ) => {
      const allIds =
        payload.page === 1
          ? payload.results.map((rb: any) => rb.id)
          : [
              ...state.recurrenceRule.allIds.asMutable(),
              ...payload.results.map((rb: any) => rb.id),
            ];
      return state
        .setIn(['recurrenceRule', 'page'], payload.page)
        .setIn(['recurrenceRule', 'count'], payload.count)
        .setIn(['recurrenceRule', 'next_page'], payload.next_page)
        .setIn(['recurrenceRule', 'allIds'], allIds)
        .merge(
          {
            recurrenceRule: {
              byId: payload.results.reduce((acc: any, ps: any) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
  },
  initialState,
);
