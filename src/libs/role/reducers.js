// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { roleList, userRoleUpdate, userRoleDelete } from './actions';

import type { UserRoleState } from './types';

const initialState: UserRoleState = Immutable({
  users: [],
  createOrUpdate: {
    loading: false,
    error: null,
  },
  loading: false,
  error: null,
});

export default handleActions(
  {
    [roleList.success]: (state, { payload }) => {
      return state.set('users', payload);
    },
    [roleList.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [roleList.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [userRoleUpdate.success]: (state, { payload }) => {
      const idx = state.users.findIndex((u) => u.id === payload.id);
      const idx_ = idx >= 0 ? idx : state.users.length;
      return state.setIn(['users', idx_], payload);
    },
    [userRoleUpdate.isLoading]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [userRoleUpdate.error]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [userRoleDelete.success]: (state, { payload }) => {
      return state.set('users', state.users.filter((u) => u.id !== payload));
    },
  },
  initialState,
);
