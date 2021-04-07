import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  userRoleList,
  userRoleUpdate,
  userRoleDelete,
  roleList,
  roleUpdate,
} from './actions';

import type { RoleState } from './types';

const initialState: Immutable.Immutable<RoleState> = Immutable<RoleState>({
  users: [],
  createOrUpdate: {
    loading: false,
    error: null,
  },
  role: {
    byId: {},
    allIds: [],
    loading: true,
    error: null,
    createOrUpdate: {
      loading: false,
      error: null,
    },
  },
  loading: false,
  error: null,
});

export default handleActions<Immutable.Immutable<RoleState>>(
  {
    [userRoleList.success]: (state, { payload }) => {
      return state.set('users', payload);
    },
    [userRoleList.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [userRoleList.error]: (state, { payload }) => {
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
      return state.set(
        'users',
        state.users.filter((u) => u.id !== payload),
      );
    },
    [roleList.isLoading]: (state, { payload }) => {
      return state.setIn(['role', 'loading'], payload);
    },
    [roleList.error]: (state, { payload }) => {
      return state.setIn(['role', 'error'], payload);
    },
    [roleList.success]: (state, { payload }) => {
      return state
        .setIn(
          ['role', 'allIds'],
          payload.map((r) => r.id),
        )
        .merge(
          {
            role: {
              byId: payload.reduce((acc, r) => {
                acc[r.id] = r;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [roleUpdate.isLoading]: (state, { payload }) => {
      return state.setIn(['role', 'createOrUpdate', 'loading'], payload);
    },
    [roleUpdate.error]: (state, { payload }) => {
      return state.setIn(['role', 'createOrUpdate', 'error'], payload);
    },
    [roleUpdate.set]: (state, { payload }) => {
      const allIds = state.role.allIds.asMutable();
      const index = allIds.findIndex((id) => id === payload.id);
      index === -1 && allIds.push(payload.id);
      return state
        .setIn(['role', 'allIds'], allIds)
        .setIn(['role', 'byId', payload.id], payload);
    },
    [roleUpdate.delete]: (state, { payload }) => {
      const allIds = state.role.allIds.asMutable();
      const index = allIds.findIndex((id) => id === payload);
      index !== -1 && allIds.splice(index, 1);
      return state.setIn(['role', 'allIds'], allIds);
    },
  },
  initialState,
);
