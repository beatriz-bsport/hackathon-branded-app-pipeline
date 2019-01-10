// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { fetchAll } from '../actions/activity.actions';

const initialState = Immutable({
  all: [],
  loading: true,
  error: null,
});

export default handleActions(
  {
    [fetchAll.isLoading]: (state, { payload }) => {
      return state.setIn(['loading'], payload);
    },
    [fetchAll.error]: (state, { payload }) => {
      return state.setIn(['error'], payload);
    },
    [fetchAll.success]: (state, { payload }) => {
      return state.setIn(['all'], payload).setIn(['lastFetched'], new Date());
    },
  },
  initialState,
);
