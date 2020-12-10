// @flow

import { createSelector } from 'reselect';
import type { State } from '../../state/types';

import {
  OWNER_ROLE,
  STAFF_ROLE,
  RESTRICTED_STAFF_ROLE,
  CHECKIN_APP_ROLE,
  REPORT_ROLE,
  ADMIN_ROLE,
} from './role-types';

const getRoleState = (state: State): UserRoleState => state.role;

const getPermissionsId = () => [
  OWNER_ROLE,
  ADMIN_ROLE,
  STAFF_ROLE,
  RESTRICTED_STAFF_ROLE,
  REPORT_ROLE,
  CHECKIN_APP_ROLE,
];

const defaultPermissions: Permissions = {
  name: 'Owner',
  description: 'Accès admin, aucune restriction, peut créer des comptes staff',
  editable: false,
  id: OWNER_ROLE,
  appbarActions: true,

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
  calendar: true,
  schedule: true,
};
const OWNER_PERMISSION = {
  ...defaultPermissions,
  editable: true,
  id: STAFF_ROLE,
  navigation: false,
  name: 'Checkin étendu',
  description:
    'Accès à la gestion de la séance (modification et annulation), aux membres, et au checkin.',
};
const ADMIN_PERMISSION = {
  ...defaultPermissions,
  id: ADMIN_ROLE,
  name: 'Admin',
  description:
    // eslint-disable-next-line
    'Admin, même accès que Owner mais peut être supprimé/créé',
  editable: true,
};

const CHECKIN_PERMISSION = {
  ...defaultPermissions,
  name: 'Checkin restreint',
  description: 'Accès seulement au checkin.',
  id: RESTRICTED_STAFF_ROLE,
  editable: true,
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

const REPORT_PERMISSION = {
  ...defaultPermissions,
  name: 'Reporting',
  description: 'Accès seulement aux rapports.',
  id: REPORT_ROLE,
  editable: true,
  navigation: false,
  restrictedPaths: ['/reporting/'],
  appbarActions: false,
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
const CHECKIN_APP_PERMISSION = {
  ...defaultPermissions,
  id: CHECKIN_APP_ROLE,
  name: 'Checkin tablette',
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

const getPermissionById = (id: number): Permissions => {
  switch (id) {
    case 0:
      return defaultPermissions;
    case 1:
      return OWNER_PERMISSION;

    case 2:
      return CHECKIN_PERMISSION;
    case 3:
      return CHECKIN_APP_PERMISSION;
    case 4:
      return ADMIN_PERMISSION;
    case 5:
      return REPORT_PERMISSION;
    default:
      return defaultPermissions;
  }
};

const getAuthState = (state: State) => state.auth;

export const getPermissions = createSelector(
  getAuthState,
  (auth) => {
    if (auth && auth.role !== null && auth.role !== 'undefined') {
      return getPermissionById(auth.role);
    }
    return defaultPermissions;
  },
);

export const getPermissionsSet = (): { [id: number]: Permissions } => {
  return getPermissionsId().map((id) => ({ id, ...getPermissionById(id) }));
};

export const getUsers = (state) => getRoleState(state).users;

export const getUsersWithRole = createSelector(
  getUsers,
  (users) =>
    users.map((u) => ({
      ...u,
      permissions: getPermissionById(u.role),
    })),
);
