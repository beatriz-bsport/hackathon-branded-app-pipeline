// @flow

import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';
import {
  byOfferActions,
  byMemberActions,
  byConsumerPackActions,
  retrieveActions,
  updateActions,
} from './actions';
import type { BookingsState } from './types';

const initialState: BookingsState = Immutable({
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

export default handleActions(
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
