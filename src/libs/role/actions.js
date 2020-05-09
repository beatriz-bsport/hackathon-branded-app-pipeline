// @flow

import { createAction } from 'redux-actions';
import {
  fetchCompanyRoles as fetchCompanyRolesAPI,
  createUserRole as createUserRoleAPI,
  updateUserRole as updateUserRoleAPI,
  deleteStaffUser as deleteStaffUserAPI,
} from './api';
import type { Dispatch } from '../../state/types';
import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';

export const roleList = {
  error: createAction('ROLE/LIST/ERROR'),
  isLoading: createAction('ROLE/LIST/IS_LOADING'),
  success: createAction('ROLE/LIST/SUCCESS'),
};

export const userRoleUpdate = {
  error: createAction('ROLE/UPDATE/ERROR'),
  isLoading: createAction('ROLE/UPDATE/IS_LOADING'),
  success: createAction('ROLE/UPDATE/SUCCESS'),
};

export const userRoleDelete = {
  error: createAction('ROLE/DELETE/ERROR'),
  success: createAction('ROLE/DELETE/ERROR'),
};

export function fetchCompanyRoles() {
  return async (dispatch: Dispatch) => {
    dispatch(roleList.isLoading(true));
    dispatch(roleList.error(null));

    try {
      const response = await fetchCompanyRolesAPI();
      const roles = response.data;
      dispatch(roleList.success(roles));
      dispatch(roleList.isLoading(false));
    } catch (err) {
      console.error(err);
      dispatch(roleList.error(err));
      dispatch(roleList.isLoading(false));
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

export function createStaffUser(data: {
  email: string,
  password: string,
  role: number,
}) {
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
