import { createSelector } from 'reselect';
import { Role, RoleState } from './types';
import { RootState } from '../../reducers';
import { OWNER_ROLE } from './role-types';

export const getRoleStateAllIds = (state: RootState) => state.role.allIds;
export const getRoleStateById = (state: RootState) => state.role.byId;
const getRoleState = (state: RootState): RoleState => state.role;
const getAuthState = (state: RootState) => state.auth;
const _getRoleDict = (state: RootState) => state.role.role.byId;
const _getUserssPaginatedState = (state: RootState) =>
  state.role.users_paginated;
const _getUsersPaginatedAllIds = (state: RootState) =>
  _getUserssPaginatedState(state).allIds;
const _getUsersPaginatedData = (state: RootState) =>
  _getUserssPaginatedState(state).byId;
const getPermissionForRole = (roleState: RoleState, roleId: number) => {
  if (roleState.role.byId[roleId]) {
    return roleState.role.byId[roleId].permissions;
  }
  return undefined;
};

export const getPermissions = createSelector(
  [getAuthState, getRoleState],
  (auth, roleState) => {
    if (auth && auth.role !== null && typeof auth.role !== 'undefined') {
      return getPermissionForRole(roleState, auth.role);
    }
    return getPermissionForRole(roleState, OWNER_ROLE);
  },
);

export const getAllRoles = (state: RootState) => {
  const roles: Role[] = state.role.role.allIds.map((id) => {
    return state.role.role.byId[id];
  });

  return roles;
};

export const getUsers = (state: RootState) => getRoleState(state).users;

export const getUsersWithRole = createSelector(
  [getUsers, getRoleState],
  (users, roleState) =>
    users.map((u) => ({
      ...u,
      permissions: getPermissionForRole(roleState, u.role),
    })),
);

const getUsersPaginatedState = createSelector(
  [_getUsersPaginatedAllIds, _getUsersPaginatedData],
  (allIds, byIds) => allIds.map((id) => byIds[id]),
);
const getUsersPaginatedWithRoleState = createSelector(
  [getUsersPaginatedState, _getRoleDict],
  (users, roleState) => users.map((u) => ({ ...u, role: roleState[u.role] })),
);
export const getUsersPaginatedWithRole = (state: RootState) => ({
  count: _getUserssPaginatedState(state).count,
  loading: _getUserssPaginatedState(state).loading,
  results: getUsersPaginatedWithRoleState(state),
});

export type UsersPaginatedWithRoleSelector = ReturnType<
  typeof getUsersPaginatedWithRole
>;

export const getUserRole = (state: RootState) =>
  state.role.role.byId[state.auth.role];
