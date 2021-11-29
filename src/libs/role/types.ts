import { ErrorAndLoading } from '../types';

// FOR CREATING A STAFF USER
export type UserRoleData = {
  email: string;
  password: string;
  role: number;
};

export type Permission = {
  offer: {
    delete: boolean; // X
    edit: boolean; // X
    create: boolean; // X
  };
  member: {
    search: boolean; // X
    retrieve: boolean; // X
    create: boolean;
  };
  checkin: boolean; // X
  navigation: boolean; // X
  appbarButtons: {
    ledger: boolean;
    notificationCenter: boolean;
  };
  calendar: boolean; // X
  restrictedPaths: string[]; // X
  navigationMenu: {
    dashboard: boolean;
    calendar: boolean;
    schedule: boolean;
    myClub: boolean;
    products: boolean;
    payments: boolean;
    marketing: boolean;
    digitalOffer: boolean;
    member: boolean;
    reporting: boolean;
    settings: boolean;
  };
};

export type Role = {
  id: number;
  name: string;
  description: string;
  editable: boolean;
  company: number;
  permissions: Permission;
};

export type UserRole = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_restricted: boolean;
  role: number;
};

export type RoleState = ErrorAndLoading & {
  users: UserRole[];
  role: ErrorAndLoading & {
    byId: { [key: string]: Role };
    allIds: number[];
    createOrUpdate: ErrorAndLoading;
  };
  createOrUpdate: ErrorAndLoading;
};
