// @ts-nocheck
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
  listRecurrenceRuleBookingActions,
  createRecurrenceRuleBookingActions,
  updateRecurrenceRuleBookingActions,
  deleteRecurrenceRuleBookingActions,
  fetchSimilarFuturBookingInGroupActions,
} from './actions';
import { BookingsState } from './types';

export const initialState: Immutable.Immutable<BookingsState> =
  Immutable<BookingsState>({
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
    similar: {
      allIds: [],
      loading: false,
      error: null,
    },
  });

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
    [updateActions.successMultiple.toString()]: (state, { payload }: any) => {
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
    [fetchSimilarFuturBookingInGroupActions.isLoading.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['similar', 'loading'], payload);
    },
    [fetchSimilarFuturBookingInGroupActions.error.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['similar', 'error'], payload);
    },
    [fetchSimilarFuturBookingInGroupActions.success.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state
        .setIn(
          ['similar', 'allIds'],
          payload.map((b) => b.id),
        )
        .merge(
          {
            byId: payload.reduce((acc: any, ps: any) => {
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
