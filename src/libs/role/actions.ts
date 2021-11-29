import { createAction } from 'redux-actions';
import {
  fetchCompanyUserRoles as fetchCompanyUserRolesAPI,
  createUserRole as createUserRoleAPI,
  updateUserRole as updateUserRoleAPI,
  deleteStaffUser as deleteStaffUserAPI,
  fetchCompanyRoles as fetchCompanyRolesAPI,
  createCompanyRole as createCompanyRoleAPI,
  updateCompanyRole as updateCompanyRoleAPI,
  deleteCompanyRole as deleteCompanyRoleAPI,
} from './api';
import { Dispatch } from '../../state/types';
import { snackbarSuccess, snackbarError } from '../snackbar/actions';
import { Permission, Role, UserRoleData } from './types';

export const userRoleList = {
  error: createAction('ROLE/USER/LIST/ERROR'),
  isLoading: createAction('ROLE/USER/LIST/IS_LOADING'),
  success: createAction('ROLE/USER/LIST/SUCCESS'),
};

export const userRoleUpdate = {
  error: createAction('ROLE/USER/UPDATE/ERROR'),
  isLoading: createAction('ROLE/USER/UPDATE/IS_LOADING'),
  success: createAction('ROLE/USER/UPDATE/SUCCESS'),
};

export const userRoleDelete = {
  error: createAction('ROLE/USER/DELETE/ERROR'),
  success: createAction('ROLE/USER/DELETE/ERROR'),
};

export function fetchCompanyUserRoles() {
  return async (dispatch: Dispatch) => {
    dispatch(userRoleList.isLoading(true));
    dispatch(userRoleList.error(null));

    try {
      const response = await fetchCompanyUserRolesAPI();
      const roles = response.data;
      dispatch(userRoleList.success(roles));
      dispatch(userRoleList.isLoading(false));
    } catch (err) {
      console.error(err);
      dispatch(userRoleList.error(err));
      dispatch(userRoleList.isLoading(false));
    }
  };
}

export function updateUserRole(userId: number, roleId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(userRoleUpdate.isLoading(true));
    dispatch(userRoleUpdate.error(null));

    try {
      const response = await updateUserRoleAPI(userId, roleId);
      const role = response.data;
      dispatch(userRoleUpdate.success(role));
      dispatch(userRoleUpdate.isLoading(false));
      dispatch(snackbarSuccess('role.update.success'));
    } catch (err) {
      console.error(err);
      dispatch(userRoleUpdate.error(err));
      dispatch(userRoleUpdate.isLoading(false));
      dispatch(snackbarError('role.error.generic'));
    }
  };
}

export function deleteStaffUser(userId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(userRoleUpdate.isLoading(true));
    dispatch(userRoleUpdate.error(null));

    try {
      await deleteStaffUserAPI(userId);
      dispatch(userRoleDelete.success(userId));
      dispatch(userRoleUpdate.isLoading(false));
      dispatch(snackbarSuccess('role.update.success'));
    } catch (err) {
      console.error(err);
      dispatch(userRoleUpdate.error(err));
      dispatch(userRoleUpdate.isLoading(false));
      dispatch(snackbarError('role.error.generic'));
    }
  };
}

export function createStaffUser(data: UserRoleData) {
  return async (dispatch: Dispatch) => {
    dispatch(userRoleUpdate.isLoading(true));
    dispatch(userRoleUpdate.error(null));

    try {
      const response = await createUserRoleAPI(data);
      const role = response.data;
      dispatch(userRoleUpdate.success(role));
      dispatch(userRoleUpdate.isLoading(false));
      dispatch(snackbarSuccess('role.update.success'));
    } catch (err) {
      console.error(err);
      dispatch(userRoleUpdate.error(err));
      dispatch(userRoleUpdate.isLoading(false));
      if (err && err.response && err.response.data && err.response.data.email) {
        dispatch(snackbarError('role.error.errorEmail'));
      } else {
        dispatch(snackbarError('role.error.generic'));
      }
    }
  };
}

export const roleList = {
  error: createAction('ROLE/LIST/ERROR'),
  isLoading: createAction('ROLE/LIST/IS_LOADING'),
  success: createAction('ROLE/LIST/SUCCESS'),
};

export const roleUpdate = {
  error: createAction('ROLE/UPDATE/ERROR'),
  isLoading: createAction('ROLE/UPDATE/IS_LOADING'),
  set: createAction('ROLE/UPDATE/SET'),
  delete: createAction('ROLE/UPDATE/DELETE'),
};

export function fetchCompanyRoles() {
  return async (dispatch: Dispatch) => {
    dispatch(roleList.isLoading(true));
    dispatch(roleList.error(null));
    try {
      const response = await fetchCompanyRolesAPI();
      const roles = response.data;
      dispatch(roleList.success(roles));
    } catch (err) {
      console.error(err);
      dispatch(roleList.error(err));
    }
    dispatch(roleList.isLoading(false));
  };
}

export function createCompanyRole(data: {
  name: string;
  description: string;
  permissions: Permission;
}) {
  return async (dispatch: Dispatch) => {
    dispatch(roleUpdate.isLoading(true));
    dispatch(roleUpdate.error(null));
    try {
      const response = await createCompanyRoleAPI(data);
      dispatch(roleUpdate.set(response.data));
    } catch (err) {
      console.error(err);
      dispatch(roleUpdate.error(err));
    }
    dispatch(roleUpdate.isLoading(false));
  };
}

export function updateCompanyRole(data: {
  id: number;
  name: string;
  description: string;
  permissions: Permission;
}) {
  return async (dispatch: Dispatch) => {
    dispatch(roleUpdate.isLoading(true));
    dispatch(roleUpdate.error(null));
    try {
      const response = await updateCompanyRoleAPI(data.id, data);
      dispatch(roleUpdate.set(response.data));
    } catch (err) {
      console.error(err);
      dispatch(roleUpdate.error(err));
    }
    dispatch(roleUpdate.isLoading(false));
  };
}

export function deleteCompanyRole(role: Role) {
  return async (dispatch: Dispatch) => {
    dispatch(roleUpdate.isLoading(true));
    dispatch(roleUpdate.error(null));
    try {
      await deleteCompanyRoleAPI(role.id);
      dispatch(roleUpdate.delete(role.id));
    } catch (err) {
      console.error(err);
      dispatch(roleUpdate.error(err));
    }
    dispatch(roleUpdate.isLoading(false));
  };
}
