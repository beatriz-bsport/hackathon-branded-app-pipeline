import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import Immutable from 'seamless-immutable';
import { RoleState } from './types';
import { RootState } from '#src/reducers';
// @ts-expect-error
import { OWNER_ROLE } from './role-types';

export const getRoleStateById = (state: RootState) => state.role.byId;

const getRoleState = (state: RootState): RoleState => state.role;

const getAuthState = (state: RootState) => state.auth;

const _getRoleDict = (state: RootState) => state.role.role.byId;

const _getRoleAllIdsDict = (state: RootState) => state.role.role.allIds;

const _getUsersPaginatedState = (state: RootState) =>
  state.role.users_paginated;

const _getUsersPaginatedAllIds = (state: RootState) =>
  _getUsersPaginatedState(state).allIds;

const _getUsersPaginatedData = (state: RootState) =>
  _getUsersPaginatedState(state).byId;

const getPermissionForRole = (roleState: RoleState, roleId: number) => {
  return roleState.role.byId?.[roleId]?.permissions;
};

const getObjectPermissionsForRole = (roleState: RoleState, roleId: number) => {
  return roleState.role.byId?.[roleId]?.object_level_permissions;
};

const getFranchisePermissionForRole = (
  roleState: RoleState,
  franchiseRoleId: number,
  franchiseRoleIdentifier: number | null,
) => {
  if (
    franchiseRoleIdentifier !== null &&
    franchiseRoleIdentifier !== undefined
  ) {
    const franchiseRoleList = Object.values(roleState.franchiseRole.byId);
    const relevantRole = franchiseRoleList.find(
      (role) => role.identifier === franchiseRoleIdentifier,
    );
    return relevantRole?.permissions;
  }
  return roleState.franchiseRole.byId?.[franchiseRoleId]?.permissions;
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

export const getObjectPermissions = createSelector(
  [getAuthState, getRoleState],
  (auth, roleState) => {
    if (auth && auth.role !== null && typeof auth.role !== 'undefined') {
      return getObjectPermissionsForRole(roleState, auth.role);
    }
    return getObjectPermissionsForRole(roleState, OWNER_ROLE);
  },
);

export const getFranchisePermissions = createSelector(
  [getAuthState, getRoleState],
  (auth, roleState) => {
    if (
      auth &&
      auth.franchise_role !== null &&
      typeof auth.franchise_role !== 'undefined'
    ) {
      return getFranchisePermissionForRole(
        roleState,
        auth.franchise_role,
        auth.franchise_role_identifier,
      );
    }
    return getFranchisePermissionForRole(roleState, null, OWNER_ROLE);
  },
);
export const hasRoleUpsertPermission = (state: RootState) =>
  state.auth.role === OWNER_ROLE;

export const hasFranchiseRoleUpsertPermission = (state: RootState) =>
  state.auth.franchise_role_identifier === OWNER_ROLE;

export const getAllRoles = createSelector(
  [_getRoleAllIdsDict, _getRoleDict],
  (roleState, roleStateById) => {
    return roleState
      .map((id) => roleStateById[id])
      .filter((role) => !role.is_franchisor);
  },
);

export const getAllFranchiseRoles = (state: RootState) =>
  state.role.franchiseRole.allIds.map(
    (id) => state.role.franchiseRole.byId[id],
  );

export const withFranchiseeRoles = memoize((selector) =>
  createSelector([selector, _getRoleDict], (franchiseRoles, roleData) => {
    if (!franchiseRoles) return null;
    if (!Array.isArray(franchiseRoles)) {
      return {
        ...franchiseRoles,
        company_role: roleData[franchiseRoles.company_role],
      };
    }
    return franchiseRoles.map((fr) => ({
      ...fr,
      company_role: roleData[fr.company_role],
    }));
  }),
);
export const getUsers = (state: RootState) => getRoleState(state).users;

export const getUsersWithRole = createSelector(
  [getUsers, getRoleState],
  (users, roleState) =>
    users.map((u) => ({
      ...u,
      permissions: getPermissionForRole(roleState, u.role),
    })),
);

export const getFranchiseUsersWithRole = createSelector(
  [getUsers, getRoleState],
  (users, roleState) =>
    users.map((u) => ({
      ...u,
      permissions: getFranchisePermissionForRole(
        roleState,
        u.franchise_role,
        u.franchise_role_identifier,
      ),
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

export const getUsersPaginatedWithRole = createSelector(
  [_getUsersPaginatedState, getUsersPaginatedWithRoleState],
  (usersPaginatedState, usersPaginatedWithRoleState) =>
    Immutable({
      count: usersPaginatedState.count,
      loading: usersPaginatedState.loading,
      results: usersPaginatedWithRoleState,
    }),
);

export type UsersPaginatedWithRoleSelector = ReturnType<
  typeof getUsersPaginatedWithRole
>;

export const getUserRole = (state: RootState) =>
  state.role.role.byId[state.auth.role];

export const getUserRoleByIdentity = (state: RootState) => {
  const { role: authRoleId, username: authUsername } = state.auth;
  const rolesById = state.role.byId;

  return Object.values(rolesById).find(
    (role) => role.role === authRoleId && role.email === authUsername,
  );
};
