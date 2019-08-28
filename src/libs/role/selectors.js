// @flow

import type { State } from '../../state/types';

const OWNER_ROLE = 0;
const STAFF_ROLE = 1;
const RESTRICTED_STAFF_ROLE = 2;
const CHECKIN_APP_ROLE = 3;
const ADMIN_ROLE = 4;

const getRoleState = (state: State): UserRoleState => state.role;

const getPermissionsId = () => [
  OWNER_ROLE,
  ADMIN_ROLE,
  STAFF_ROLE,
  RESTRICTED_STAFF_ROLE,
  CHECKIN_APP_ROLE,
];

const defaultPermissions: Permissions = {
  name: 'Owner',
  description: 'Accès admin, aucune restriction, peut créer des comptes staff',
  editable: false,
  id: 0,

  checkin: false,
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
        editable: true,
        id: 1,
        navigation: false,
        name: 'Professeur',
        description:
          'Accès à la gestion de la séance (modification et annulation), aux membres, et au checkin.',
      };

    case 2:
      return {
        ...defaultPermissions,
        name: 'Checkin',
        id: 2,
        editable: true,
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
    case 3:
      return {
        ...defaultPermissions,
        id: 3,
        name: 'Checkin-App',
        description:
          // eslint-disable-next-line
          "Compte pour application d'auto-checkin (contactez votre chargé de compte bsport)",
        navigation: false,
        checkin: true,
        member: {
          create: false,
          retrieve: false,
          edit: false,
          delete: false,
          search: false,
        },
        offer: {
          delete: false,
          retrieve: false,
          edit: false,
          create: false,
        },
      };
    case 4:
      return {
        ...defaultPermissions,
        id: 4,
        name: 'Admin',
        description:
          // eslint-disable-next-line
          'Admin, même accès que Owner mais peut être supprimé/créé',
        editable: true,
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
