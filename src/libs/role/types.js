// @flow

export type UserRoleData = {
  email: string,
  password: string,
  role: number,
};

export type Permission = {
  id: number,
  name: string,
  description: string,
  offer: {
    delete: boolean,
    edit: boolean,
    create: boolean,
    retrieve: boolean,
  },
  member: {
    create: boolean,
    search: boolean,
    retrieve: boolean,
    delete: boolean,
    edit: boolean,
  },
  search: boolean,
  navigation: boolean,
};
export type UserRole = {
  email: string,
  user_role: ?number,
  id: number,
};

export type UserRoleState = {
  users: UserRole,
  createOrUpdate: {
    loading: boolean,
    error: ?Error,
  },
  loading: boolean,
  error: ?Error,
};
