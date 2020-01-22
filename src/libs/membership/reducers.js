// @flow

import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';
import {
  listAsConsumerActions,
  retrieveActions,
  setActiveActions,
  linkActions,
} from './actions';
import type { MembershipState } from './types';

const initialState: MembershipState = Immutable({
  byId: {},
  activeMembership: null,
  retrieve: {
    loading: false,
    error: null,
  },
  asConsumer: {
    loading: false,
    error: null,
    allIds: [],
    count: 0,
    next_page: 1,
  },
  link: {
    loading: false,
    error: null,
  },
});

export default handleActions(
  {
    [setActiveActions]: (state, { payload }) => {
      return state.set('activeMembership', payload);
    },
    [listAsConsumerActions.isLoading]: (state, { payload }) => {
      return state.setIn(['asConsumer', 'loading'], payload);
    },
    [listAsConsumerActions.error]: (state, { payload }) => {
      return state.setIn(['asConsumer', 'error'], payload);
    },
    [listAsConsumerActions.success]: (state, { payload }) => {
      const newIds = payload.results.map((m) => m.company);
      return state
        .set(
          'byId',
          payload.results.reduce((acc, v) => ({ ...acc, [v.company]: v }), {}),
        )
        .setIn(
          ['asConsumer', 'allIds'],
          payload.page === 1 ? newIds : [...state.allIds, ...newIds],
        )
        .setIn(['asConsumer', 'next_page'], payload.next_page);
    },
    [retrieveActions.isLoading]: (state, { payload }) => {
      return state.setIn(['retrieve', 'loading'], payload);
    },
    [retrieveActions.error]: (state, { payload }) => {
      return state.setIn(['retrieve', 'error'], payload);
    },
    [retrieveActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.company], payload);
    },
    [linkActions.isLoading]: (state, { payload }) => {
      return state.setIn(['link', 'loading'], payload);
    },
    [linkActions.error]: (state, { payload }) => {
      return state.setIn(['link', 'error'], payload);
    },
    [linkActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.company], payload);
    },
  },
  initialState,
);
