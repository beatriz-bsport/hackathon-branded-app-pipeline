import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import {
  userRoleList,
  userRoleUpdate,
  userCommissionUpdate,
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
  franchiseUserCommissionUpdate,
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
          // @ts-expect-error
          payload.map((user) => user.id),
        )
        .merge(
          {
            // @ts-expect-error
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
      // @ts-expect-error
      const idx = state.users.findIndex((u) => u.id === payload.id);
      const idx_ = idx >= 0 ? idx : state.users.length;
      // @ts-expect-error
      return state.setIn(['users', idx_], payload);
    },
    [userRoleUpdate.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [userRoleUpdate.error.toString()]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [userCommissionUpdate.success.toString()]: (state, { payload }) => {
      // @ts-expect-error
      const index = state.users.findIndex((user) => user.id === payload.id);
      const index_ = index >= 0 ? index : state.users.length;
      // @ts-expect-error
      return state.setIn(['users', index_], payload);
    },
    [userCommissionUpdate.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [userCommissionUpdate.error.toString()]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [userRoleDelete.success.toString()]: (state, { payload }) => {
      return state.set(
        'users',
        // @ts-expect-error
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
          // @ts-expect-error
          payload.map((r) => r.id),
        )
        .merge(
          {
            role: {
              // @ts-expect-error
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
      // @ts-expect-error
      const index = allIds.findIndex((id) => id === payload.id);
      // @ts-expect-error
      index === -1 && allIds.push(payload.id);
      return (
        state
          .setIn(['role', 'allIds'], allIds)
          // @ts-expect-error
          .setIn(['role', 'byId', payload.id], payload)
      );
    },
    [roleUpdate.delete.toString()]: (state, { payload }) => {
      const allIds = state.role.allIds.asMutable();
      // @ts-expect-error
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
        // @ts-expect-error
        .setIn(['users_paginated', 'count'], payload.count)
        // @ts-expect-error
        .setIn(['users_paginated', 'next_page'], payload.next_page)
        // @ts-expect-error
        .setIn(['users_paginated', 'previous_page'], payload.previous_page)
        .setIn(
          ['users_paginated', 'allIds'],
          // @ts-expect-error
          payload.results.map((r) => r.id),
        )
        .merge(
          {
            users_paginated: {
              // @ts-expect-error
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
          // @ts-expect-error
          payload.map((user) => user.id),
        )
        .merge(
          {
            // @ts-expect-error
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
      // @ts-expect-error
      const idx = state.users.findIndex((u) => u.id === payload.id);
      const idx_ = idx >= 0 ? idx : state.users.length;
      // @ts-expect-error
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
        // @ts-expect-error
        state.users.filter((u) => u.id !== payload),
      );
    },
    [franchiseUserCommissionUpdate.success.toString()]: (
      state,
      { payload },
    ) => {
      // @ts-expect-error
      const index = state.users.findIndex((user) => user.id === payload.id);
      const index_ = index >= 0 ? index : state.users.length;
      // @ts-expect-error
      return state.setIn(['users', index_], payload);
    },
    [franchiseUserCommissionUpdate.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [franchiseUserCommissionUpdate.error.toString()]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
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
          // @ts-expect-error
          payload.map((r) => r.id),
        )
        .merge(
          {
            franchiseRole: {
              // @ts-expect-error
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
      // @ts-expect-error
      const index = allIds.findIndex((id) => id === payload.id);
      // @ts-expect-error
      index === -1 && allIds.push(payload.id);
      return (
        state
          .setIn(['franchiseRole', 'allIds'], allIds)
          // @ts-expect-error
          .setIn(['franchiseRole', 'byId', payload.id], payload)
      );
    },
    [franchiseRoleUpdate.delete.toString()]: (state, { payload }) => {
      const allIds = [...state.franchiseRole.allIds];
      // @ts-expect-error
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
        // @ts-expect-error
        .setIn(['users_paginated', 'count'], payload.count)
        // @ts-expect-error
        .setIn(['users_paginated', 'next_page'], payload.next_page)
        // @ts-expect-error
        .setIn(['users_paginated', 'previous_page'], payload.previous_page)
        .setIn(
          ['users_paginated', 'allIds'],
          // @ts-expect-error
          payload.results.map((r) => r.id),
        )
        .merge(
          {
            users_paginated: {
              // @ts-expect-error
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
