// @flow

import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';
import { searchActions, listFeatureActions } from './actions';
import type { CompanyState } from './types';

const initialState: CompanyState = Immutable({
  byId: {},
  feature: {
    data: {},
    loading: false,
    error: null,
  },
  search: {
    loading: false,
    error: null,
    allIds: [],
  },
});

export default handleActions(
  {
    [searchActions.isLoading]: (state, { payload }) => {
      return state.setIn(['search', 'loading'], payload);
    },
    [searchActions.error]: (state, { payload }) => {
      return state.setIn(['search', 'error'], payload);
    },
    [searchActions.success]: (state, { payload }) => {
      const newIds = payload.map((m) => m.id);
      return state
        .set(
          'byId',
          payload.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
        )
        .setIn(['search', 'allIds'], newIds);
    },
    [listFeatureActions.success]: (state, { payload }) => {
      return state.setIn(['feature', 'data'], payload);
    },
    [listFeatureActions.isLoading]: (state, { payload }) => {
      return state.setIn(['feature', 'loading'], payload);
    },
    [listFeatureActions.error]: (state, { payload }) => {
      return state.setIn(['feature', 'error'], payload);
    },
  },
  initialState,
);
