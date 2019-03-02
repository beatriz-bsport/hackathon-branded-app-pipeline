// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  listingActions,
  upsertActions,
} from '../actions/workshop-activity.actions';

const initialState = Immutable({
  loading: false,
  error: null,
  all: [],
  upsert: {
    loading: false,
    error: null,
  },
});

export default handleActions(
  {
    [listingActions.success]: (state, { payload }) => {
      return state.set('all', payload);
    },
    [listingActions.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [listingActions.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [upsertActions.isLoading]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [upsertActions.error]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [upsertActions.success]: (state, { payload }) => {
      return state.set('all', [
        payload,
        ...state.all.filter((oa) => oa.id !== payload.id),
      ]);
    },
  },
  initialState,
);
