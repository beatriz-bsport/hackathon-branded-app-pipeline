// @flow

import type { State } from '../../state/types';

const ADMIN_ROLE = 0;
const STAFF_ROLE = 1;
const RESTRICTED_STAFF_ROLE = 2;

const getRoleState = (state: State): UserRoleState => state.role;

const getPermissionsId = () => [ADMIN_ROLE, STAFF_ROLE, RESTRICTED_STAFF_ROLE];

const defaultPermissions: Permissions = {
  name: 'Admin',
  description: 'Accès admin, aucune restriction, peut créer des comptes staff',
  offer: {
    delete: true,
    edit: true,
    create: true,
    retrieve: true,
  },
  member: {
    create: true,
    search: true,
    retrieve: true,
    delete: true,
    edit: true,
  },
  search: true,
  navigation: true,
};

const getPermissionById = (id: number): Permissions => {
  switch (id) {
    case 0:
      return defaultPermissions;
    case 1:
      return {
        ...defaultPermissions,
        navigation: false,
        name: 'Professeur',
        description:
          'Accès à la gestion de la séance (modification et annulation), aux membres, et au checkin.',
      };

    case 2:
      return {
        ...defaultPermissions,
        name: 'Checkin',
        description: 'Accès seulement au checkin.',
        navigation: false,
        member: {
          create: true,
          retrieve: false,
          edit: false,
          delete: false,
          search: false,
        },
        offer: {
          delete: false,
          retrieve: true,
          edit: false,
          create: false,
        },
      };
    default:
      return defaultPermissions;
  }
};

export const getPermissions = (state: State): Permissions => {
  if (
    state.auth &&
    state.auth.role !== null &&
    state.auth.role !== 'undefined'
  ) {
    return getPermissionById(state.auth.role);
  }
  return defaultPermissions;
};

export const getPermissionsSet = (): { [id: number]: Permissions } => {
  return getPermissionsId().map((id) => ({ id, ...getPermissionById(id) }));
};

export const getUsersWithRole = (state: State) =>
  getRoleState(state).users.map((u) => ({
    ...u,
    permissions: getPermissionById(u.role),
  }));
