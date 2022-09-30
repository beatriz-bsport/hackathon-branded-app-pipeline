import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import {
  userRoleList,
  userRoleUpdate,
  userRoleDelete,
  roleList,
  roleUpdate,
  userRoleListPaginated,
  franchiseUserRoleList,
  franchiseUserRoleUpdate,
  franchiseUserRoleDelete,
  franchiseRoleList,
  franchiseRoleUpdate,
  franchiseUserRoleListPaginated,
} from './actions';

import type { RoleState } from './types';

const initialState: Immutable.Immutable<RoleState> = Immutable<RoleState>({
  allIds: [],
  byId: {},
  users: [],
  users_paginated: {
    next_page: 0,
    previous_page: 0,
    count: 0,
    allIds: [],
    byId: {},
    loading: false,
    error: null,
  },
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
  franchiseRole: {
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
    [userRoleList.success.toString()]: (state, { payload }) => {
      return state
        .set('users', payload)
        .set(
          'allIds',
          payload.map((user) => user.id),
        )
        .merge(
          {
            byId: payload.reduce((acc, r) => {
              acc[r.id] = r;
              return acc;
            }, {}),
          },
          { deep: true },
        );
    },
    [userRoleList.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [userRoleList.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [userRoleUpdate.success.toString()]: (state, { payload }) => {
      const idx = state.users.findIndex((u) => u.id === payload.id);
      const idx_ = idx >= 0 ? idx : state.users.length;
      return state.setIn(['users', idx_], payload);
    },
    [userRoleUpdate.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [userRoleUpdate.error.toString()]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [userRoleDelete.success.toString()]: (state, { payload }) => {
      return state.set(
        'users',
        state.users.filter((u) => u.id !== payload),
      );
    },
    [roleList.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['role', 'loading'], payload);
    },
    [roleList.error.toString()]: (state, { payload }) => {
      return state.setIn(['role', 'error'], payload);
    },
    [roleList.success.toString()]: (state, { payload }) => {
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
    [roleUpdate.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['role', 'createOrUpdate', 'loading'], payload);
    },
    [roleUpdate.error.toString()]: (state, { payload }) => {
      return state.setIn(['role', 'createOrUpdate', 'error'], payload);
    },
    [roleUpdate.success.toString()]: (state, { payload }) => {
      const allIds = state.role.allIds.asMutable();
      const index = allIds.findIndex((id) => id === payload.id);
      index === -1 && allIds.push(payload.id);
      return state
        .setIn(['role', 'allIds'], allIds)
        .setIn(['role', 'byId', payload.id], payload);
    },
    [roleUpdate.delete.toString()]: (state, { payload }) => {
      const allIds = state.role.allIds.asMutable();
      const index = allIds.findIndex((id) => id === payload);
      index !== -1 && allIds.splice(index, 1);
      return state.setIn(['role', 'allIds'], allIds);
    },

    [userRoleListPaginated.isLoading.toString()]: (state, { payload }) =>
      state.setIn(['users_paginated', 'loading'], payload),
    [userRoleListPaginated.error.toString()]: (state, { payload }) =>
      state.setIn(['users_paginated', 'error'], payload),
    [userRoleListPaginated.success.toString()]: (state, { payload }) =>
      state
        .setIn(['users_paginated', 'count'], payload.count)
        .setIn(['users_paginated', 'next_page'], payload.next_page)
        .setIn(['users_paginated', 'previous_page'], payload.previous_page)
        .setIn(
          ['users_paginated', 'allIds'],
          payload.results.map((r) => r.id),
        )
        .merge(
          {
            users_paginated: {
              byId: payload.results.reduce((acc: any, ps: any) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        ),
    [franchiseUserRoleList.success.toString()]: (state, { payload }) => {
      return state
        .set('users', payload)
        .set(
          'allIds',
          payload.map((user) => user.id),
        )
        .merge(
          {
            byId: payload.reduce((acc, r) => {
              acc[r.id] = r;
              return acc;
            }, {}),
          },
          { deep: true },
        );
    },
    [franchiseUserRoleList.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [franchiseUserRoleList.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [franchiseUserRoleUpdate.success.toString()]: (state, { payload }) => {
      const idx = state.users.findIndex((u) => u.id === payload.id);
      const idx_ = idx >= 0 ? idx : state.users.length;
      return state.setIn(['users', idx_], payload);
    },
    [franchiseUserRoleUpdate.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [franchiseUserRoleUpdate.error.toString()]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [franchiseUserRoleDelete.success.toString()]: (state, { payload }) => {
      return state.set(
        'users',
        state.users.filter((u) => u.id !== payload),
      );
    },
    [franchiseRoleList.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['franchiseRole', 'loading'], payload);
    },
    [franchiseRoleList.error.toString()]: (state, { payload }) => {
      return state.setIn(['franchiseRole', 'error'], payload);
    },
    [franchiseRoleList.success.toString()]: (state, { payload }) => {
      return state
        .setIn(
          ['franchiseRole', 'allIds'],
          payload.map((r) => r.id),
        )
        .merge(
          {
            franchiseRole: {
              byId: payload.reduce((acc, r) => {
                acc[r.id] = r;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [franchiseRoleUpdate.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(
        ['franchiseRole', 'createOrUpdate', 'loading'],
        payload,
      );
    },
    [franchiseRoleUpdate.error.toString()]: (state, { payload }) => {
      return state.setIn(['franchiseRole', 'createOrUpdate', 'error'], payload);
    },
    [franchiseRoleUpdate.success.toString()]: (state, { payload }) => {
      const allIds = [...state.franchiseRole.allIds];
      const index = allIds.findIndex((id) => id === payload.id);
      index === -1 && allIds.push(payload.id);
      return state
        .setIn(['franchiseRole', 'allIds'], allIds)
        .setIn(['franchiseRole', 'byId', payload.id], payload);
    },
    [franchiseRoleUpdate.delete.toString()]: (state, { payload }) => {
      const allIds = [...state.franchiseRole.allIds];
      const index = allIds.findIndex((id) => id === payload);
      index !== -1 && allIds.splice(index, 1);
      return state.setIn(['franchiseRole', 'allIds'], allIds);
    },

    [franchiseUserRoleListPaginated.isLoading.toString()]: (
      state,
      { payload },
    ) => state.setIn(['users_paginated', 'loading'], payload),
    [franchiseUserRoleListPaginated.error.toString()]: (state, { payload }) =>
      state.setIn(['users_paginated', 'error'], payload),
    [franchiseUserRoleListPaginated.success.toString()]: (state, { payload }) =>
      state
        .setIn(['users_paginated', 'count'], payload.count)
        .setIn(['users_paginated', 'next_page'], payload.next_page)
        .setIn(['users_paginated', 'previous_page'], payload.previous_page)
        .setIn(
          ['users_paginated', 'allIds'],
          payload.results.map((r) => r.id),
        )
        .merge(
          {
            users_paginated: {
              byId: payload.results.reduce((acc: any, ps: any) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        ),
  },
  initialState,
);
