// @flow

import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';
import {
  searchActions,
  listFeatureActions,
  retrieveMyCompanyActions,
} from './actions';
import { CompanyState, Company } from './types';

const initialState: Immutable.Immutable<CompanyState> = Immutable({
  byId: {},
  feature: {
    data: {
      upsell: [],
    },
    loading: false,
    error: null,
  },
  search: {
    loading: false,
    error: null,
    allIds: [],
  },
  setup: null,
});

export default handleActions(
  {
    [searchActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['search', 'loading'], payload);
    },
    [searchActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['search', 'error'], payload);
    },
    [searchActions.success.toString()]: (state, { payload }) => {
      const newIds = payload.map((m: Company) => m.id);
      return state
        .set(
          'byId',
          payload.reduce(
            (acc: { [id: number]: Company }, v: Company) => ({
              ...acc,
              [v.id]: v,
            }),
            {},
          ),
        )
        .setIn(['search', 'allIds'], newIds);
    },
    [listFeatureActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['feature', 'data'], payload);
    },
    [listFeatureActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['feature', 'loading'], payload);
    },
    [listFeatureActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['feature', 'error'], payload);
    },
    [retrieveMyCompanyActions.success.toString()]: (state, { payload }) => {
      return state.set('setup', payload);
    },
  },
  initialState,
);
