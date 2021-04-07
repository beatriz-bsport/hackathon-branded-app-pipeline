import { createSelector } from 'reselect';
import { Role, RoleState } from './types';
import { RootState } from '../../reducers';
import { OWNER_ROLE } from './role-types';

const getRoleState = (state: RootState): RoleState => state.role;
const getAuthState = (state: RootState) => state.auth;

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
