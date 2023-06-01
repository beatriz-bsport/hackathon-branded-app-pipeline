// @ts-nocheck
import { createAction } from 'redux-actions';
import * as Sentry from '@sentry/react';
import { push } from 'connected-react-router';
import { v4 as uuid4 } from 'uuid';
import {
  fetchCompanyUserRoles as fetchCompanyUserRolesAPI,
  createUserRole as createUserRoleAPI,
  updateUserRole as updateUserRoleAPI,
  deleteStaffUser as deleteStaffUserAPI,
  fetchCompanyRoles as fetchCompanyRolesAPI,
  createCompanyRole as createCompanyRoleAPI,
  updateCompanyRole as updateCompanyRoleAPI,
  deleteCompanyRole as deleteCompanyRoleAPI,
  fetchFranchiseUserRoles as fetchFranchiseUserRolesAPI,
  createFranchiseUserRole as createFranchiseUserRoleAPI,
  updateFranchiseUserRole as updateFranchiseUserRoleAPI,
  deleteStaffFranchiseUser as deleteStaffFranchiseUserAPI,
  fetchFranchiseRoles as fetchFranchiseRolesAPI,
  createFranchiseRole as createFranchiseRoleAPI,
  updateFranchiseRole as updateFranchiseRoleAPI,
  deleteFranchiseRole as deleteFranchiseRoleAPI,
  updateUserCommission as updateUserCommissionAPI,
  updateFranchiseUserCommission as updateFranchiseUserCommissionAPI,
} from './api';
import {
  Dispatch,
  OptionCallback,
  OptionPaginatedCallback,
} from '../../state/types';
import { snackbarSuccess, snackbarError } from '../snackbar/actions';
import {
  FranchiseRolePermission,
  FranchiseRole,
  FranchiseUserRoleData,
  RolePermission,
  Role,
  UserRoleData,
  RedirectionParameters,
} from './types';

import { getPermissions } from './selectors';
import { matchUrlToRelevantPermissionKey, getNestedKeyInObject } from './utils';
import { RootState } from '../../reducers';
import { displayBackgroundDialog } from '#libs/background-dialog/actions';
import {
  DISPLAY_ACCESS_DENIED,
  ACTION_MODE_REDIRECT,
} from '#libs/background-dialog/types';

export const userRoleList = {
  error: createAction('ROLE/USER/LIST/ERROR'),
  isLoading: createAction('ROLE/USER/LIST/IS_LOADING'),
  success: createAction('ROLE/USER/LIST/SUCCESS'),
};
export const userRoleListPaginated = {
  error: createAction('ROLE/USER/LIST_PAGINATED/ERROR'),
  isLoading: createAction('ROLE/USER/LIST_PAGINATED/IS_LOADING'),
  success: createAction('ROLE/USER/LIST_PAGINATED/SUCCESS'),
};

export const userRoleUpdate = {
  error: createAction('ROLE/USER/UPDATE/ERROR'),
  isLoading: createAction('ROLE/USER/UPDATE/IS_LOADING'),
  success: createAction('ROLE/USER/UPDATE/SUCCESS'),
};

export const userRoleDelete = {
  error: createAction('ROLE/USER/DELETE/ERROR'),
  success: createAction('ROLE/USER/DELETE/SUCCESS'),
};

export const userCommissionUpdate = {
  error: createAction('ROLE/USER/COMMISSION_UPDATE/ERROR'),
  isLoading: createAction('ROLE/USER/COMMISSION_UPDATE/IS_LOADING'),
  success: createAction('ROLE/USER/COMMISSION_UPDATE/SUCCESS'),
};

export function fetchCompanyUserRoles(
  params?: { role__in?: number[]; role_exclude?: number[] },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(userRoleList.isLoading(true));
    dispatch(userRoleList.error(null));

    try {
      const response = await fetchCompanyUserRolesAPI(params);
      const roles = response.data;
      dispatch(userRoleList.success(roles));
      options?.onSuccess && options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(userRoleList.error(err));
      options?.onError && options.onError();
    }
    dispatch(userRoleList.isLoading(false));
  };
}
export function fetchCompanyUserRolesPaginated(
  params: {
    page: number;
    page_size: number;
    role?: number;
  },
  options?: OptionPaginatedCallback<Role>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(userRoleListPaginated.isLoading(true));
    dispatch(userRoleListPaginated.error(null));

    try {
      const response = await fetchCompanyUserRolesAPI({
        ...params,
        paginated: true,
      });
      const data = response.data;
      dispatch(userRoleListPaginated.success(data));
      options?.onSuccess && options.onSuccess(data);
    } catch (err) {
      console.error(err);
      dispatch(userRoleListPaginated.error(err));
      options?.onError && options.onError();
    }
    dispatch(userRoleListPaginated.isLoading(false));
  };
}
export function updateUserRole(
  userId: number,
  params: { roleId?: number; coaches?: number[] },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(userRoleUpdate.isLoading(true));
    dispatch(userRoleUpdate.error(null));

    try {
      const response = await updateUserRoleAPI(userId, params);
      const role = response.data;
      dispatch(userRoleUpdate.success(role));
      dispatch(snackbarSuccess('role.update.success'));
      options?.onSuccess && options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(userRoleUpdate.error(err));
      dispatch(snackbarError('role.error.generic'));
      options?.onError && options.onError();
    }
    dispatch(userRoleUpdate.isLoading(false));
  };
}

export function deleteStaffUser(userId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(userRoleUpdate.isLoading(true));
    dispatch(userRoleUpdate.error(null));

    try {
      await deleteStaffUserAPI(userId);
      dispatch(userRoleDelete.success(userId));
      dispatch(snackbarSuccess('role.update.success'));
    } catch (err) {
      console.error(err);
      dispatch(userRoleUpdate.error(err));
      dispatch(snackbarError('role.error.generic'));
    }
    dispatch(userRoleUpdate.isLoading(false));
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
      dispatch(snackbarSuccess('role.update.success'));
    } catch (err) {
      console.error(err);
      dispatch(userRoleUpdate.error(err));
      if (err && err.response && err.response.data && err.response.data.email) {
        dispatch(snackbarError('role.error.errorEmail'));
      } else {
        dispatch(snackbarError('role.error.generic'));
      }
    }
    dispatch(userRoleUpdate.isLoading(false));
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
  success: createAction('ROLE/UPDATE/SUCCESS'),
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
  permissions: RolePermission;
  has_booking_override_control: boolean;
}) {
  return async (dispatch: Dispatch) => {
    dispatch(roleUpdate.isLoading(true));
    dispatch(roleUpdate.error(null));
    try {
      const response = await createCompanyRoleAPI(data);
      dispatch(roleUpdate.success(response.data));
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
  permissions: RolePermission;
  has_booking_override_control: boolean;
}) {
  return async (dispatch: Dispatch) => {
    dispatch(roleUpdate.isLoading(true));
    dispatch(roleUpdate.error(null));
    try {
      const response = await updateCompanyRoleAPI(data.id, data);
      dispatch(roleUpdate.success(response.data));
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

export const franchiseUserRoleList = {
  error: createAction('FRANCHISE_ROLE/USER/LIST/ERROR'),
  isLoading: createAction('FRANCHISE_ROLE/USER/LIST/IS_LOADING'),
  success: createAction('FRANCHISE_ROLE/USER/LIST/SUCCESS'),
};
export function fetchFranchiseUserRoles(options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(franchiseUserRoleList.isLoading(true));
    dispatch(franchiseUserRoleList.error(null));

    try {
      const response = await fetchFranchiseUserRolesAPI();
      const roles = response.data;
      dispatch(franchiseUserRoleList.success(roles));
      options?.onSuccess && options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(franchiseUserRoleList.error(err));
      options?.onError && options.onError();
    }
    dispatch(franchiseUserRoleList.isLoading(false));
  };
}

export const franchiseUserRoleListPaginated = {
  error: createAction('FRANCHISE_ROLE/USER/LIST_PAGINATED/ERROR'),
  isLoading: createAction('FRANCHISE_ROLE/USER/LIST_PAGINATED/IS_LOADING'),
  success: createAction('FRANCHISE_ROLE/USER/LIST_PAGINATED/SUCCESS'),
};

export function fetchFranchiseUserRolesPaginated(
  params: {
    page: number;
    page_size: number;
  },
  options?: OptionPaginatedCallback<Role>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(franchiseUserRoleListPaginated.isLoading(true));
    dispatch(franchiseUserRoleListPaginated.error(null));

    try {
      const response = await fetchFranchiseUserRolesAPI({
        ...params,
        paginated: true,
      });
      const data = response.data;
      dispatch(franchiseUserRoleListPaginated.success(data));
      options?.onSuccess && options.onSuccess(data);
    } catch (err) {
      console.error(err);
      dispatch(franchiseUserRoleListPaginated.error(err));
      options?.onError && options.onError();
    }
    dispatch(franchiseUserRoleListPaginated.isLoading(false));
  };
}
export const franchiseUserRoleUpdate = {
  error: createAction('FRANCHISE_ROLE/USER/UPDATE/ERROR'),
  isLoading: createAction('FRANCHISE_ROLE/USER/UPDATE/IS_LOADING'),
  success: createAction('FRANCHISE_ROLE/USER/UPDATE/SUCCESS'),
};

export function updateFranchiseUserRole(
  userId: number,
  params: { roleId?: number; franchisees?: number[] },
) {
  return async (dispatch: Dispatch) => {
    dispatch(franchiseUserRoleUpdate.isLoading(true));
    dispatch(franchiseUserRoleUpdate.error(null));

    try {
      const response = await updateFranchiseUserRoleAPI(userId, params);
      const role = response.data;
      dispatch(franchiseUserRoleUpdate.success(role));
      dispatch(snackbarSuccess('role.update.success'));
    } catch (err) {
      console.error(err);
      dispatch(franchiseUserRoleUpdate.error(err));
      dispatch(snackbarError('role.error.generic'));
    }
    dispatch(franchiseUserRoleUpdate.isLoading(false));
  };
}
export const franchiseUserRoleDelete = {
  error: createAction('FRANCHISE_ROLE/USER/DELETE/ERROR'),

  success: createAction('FRANCHISE_ROLE/USER/DELETE/SUCCESS'),
};

export function deleteStaffFranchiseUser(userId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(franchiseUserRoleUpdate.isLoading(true));
    dispatch(franchiseUserRoleUpdate.error(null));

    try {
      await deleteStaffFranchiseUserAPI(userId);
      dispatch(franchiseUserRoleDelete.success(userId));
      dispatch(snackbarSuccess('role.update.success'));
    } catch (err) {
      console.error(err);
      dispatch(franchiseUserRoleUpdate.error(err));
      dispatch(snackbarError('role.error.generic'));
    }
    dispatch(franchiseUserRoleUpdate.isLoading(false));
  };
}

export function createStaffFranchiseUser(data: FranchiseUserRoleData) {
  return async (dispatch: Dispatch) => {
    dispatch(franchiseUserRoleUpdate.isLoading(true));
    dispatch(franchiseUserRoleUpdate.error(null));

    try {
      const response = await createFranchiseUserRoleAPI(data);
      const role = response.data;
      dispatch(franchiseUserRoleUpdate.success(role));
      dispatch(snackbarSuccess('role.update.success'));
    } catch (err) {
      console.error(err);
      dispatch(franchiseUserRoleUpdate.error(err));
      if (err && err.response && err.response.data && err.response.data.email) {
        dispatch(snackbarError('role.error.errorEmail'));
      } else {
        dispatch(snackbarError('role.error.generic'));
      }
    }
    dispatch(franchiseUserRoleUpdate.isLoading(false));
  };
}

export const franchiseRoleList = {
  error: createAction('FRANCHISE_ROLE/LIST/ERROR'),
  isLoading: createAction('FRANCHISE_ROLE/LIST/IS_LOADING'),
  success: createAction('FRANCHISE_ROLE/LIST/SUCCESS'),
};

export function fetchFranchiseRoles() {
  return async (dispatch: Dispatch) => {
    dispatch(franchiseRoleList.isLoading(true));
    dispatch(franchiseRoleList.error(null));
    try {
      const response = await fetchFranchiseRolesAPI();
      const roles = response.data;
      dispatch(franchiseRoleList.success(roles));
    } catch (err) {
      console.error(err);
      dispatch(franchiseRoleList.error(err));
    }
    dispatch(franchiseRoleList.isLoading(false));
  };
}

export const franchiseRoleUpdate = {
  error: createAction('FRANCHISE_ROLE/UPDATE/ERROR'),
  isLoading: createAction('FRANCHISE_ROLE/UPDATE/IS_LOADING'),
  success: createAction('FRANCHISE_ROLE/UPDATE/SUCCESS'),
  delete: createAction('FRANCHISE_ROLE/UPDATE/DELETE'),
};

export function createFranchiseRole(
  data: {
    name: string;
    description: string;
    permissions: FranchiseRolePermission;
    allowed_franchisees: number[];
    company_role: Role;
  },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(franchiseRoleUpdate.isLoading(true));
    dispatch(franchiseRoleUpdate.error(null));
    try {
      const response = await createFranchiseRoleAPI(data);
      dispatch(franchiseRoleUpdate.success(response.data));
      dispatch(snackbarSuccess('role.update.success'));
      options?.onSuccess && options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(franchiseRoleUpdate.error(err));
      dispatch(snackbarError('role.error.generic'));
      options?.onError && options.onError();
    }
    dispatch(franchiseRoleUpdate.isLoading(false));
  };
}

export function updateFranchiseRole(
  data: {
    id: number;
    name: string;
    description: string;
    permissions: FranchiseRolePermission;
    allowed_franchisees: number[];
    company_role: Role;
  },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(franchiseRoleUpdate.isLoading(true));
    dispatch(franchiseRoleUpdate.error(null));
    try {
      const response = await updateFranchiseRoleAPI(data.id, data);
      dispatch(franchiseRoleUpdate.success(response.data));
      dispatch(snackbarSuccess('role.update.success'));
      options?.onSuccess && options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(franchiseRoleUpdate.error(err));
      dispatch(snackbarError('role.error.generic'));
      options?.onError && options.onError();
    }
    dispatch(franchiseRoleUpdate.isLoading(false));
  };
}

export function deleteFranchiseRole(franchiseRole: FranchiseRole) {
  return async (dispatch: Dispatch) => {
    dispatch(franchiseRoleUpdate.isLoading(true));
    dispatch(franchiseRoleUpdate.error(null));
    try {
      await deleteFranchiseRoleAPI(franchiseRole.id);
      dispatch(franchiseRoleUpdate.delete(franchiseRole.id));
    } catch (err) {
      console.error(err);
      dispatch(franchiseRoleUpdate.error(err));
    }
    dispatch(franchiseRoleUpdate.isLoading(false));
  };
}

export function redirectIfAllowed(
  url: string,
  redirectionParameters: RedirectionParameters,
) {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    if (!url) {
      return;
    }

    try {
      const permissionKey = matchUrlToRelevantPermissionKey(url);
      const userPermissions = getPermissions(getState());

      const hasAccess = getNestedKeyInObject(userPermissions, permissionKey);
      if (hasAccess === undefined) {
        const error = new Error(
          `Fail to parse permission key : ${permissionKey}`,
        );
        const sentryObjectError = {
          error_message: `Fail to parse permission key : ${permissionKey}`,
          userPermissions,
        };
        Sentry.captureException(sentryObjectError);
        throw error;
      }
      if (!hasAccess) {
        if (redirectionParameters?.deniedAccessDialog?.display) {
          const uuid = uuid4();
          dispatch(
            displayBackgroundDialog(
              uuid,
              '',
              '',
              '',
              ACTION_MODE_REDIRECT,
              DISPLAY_ACCESS_DENIED,
            ),
          );
          return;
        }
        return;
      }

      const windowAction = redirectionParameters?.newWindow
        ? window.open
        : (_url: string) => dispatch(push(_url));

      windowAction(url);
    } catch (error) {
      console.error(error);
    }
  };
}

export function updateUserCommission(
  userId: number,
  params: {
    commission?: number;
  },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(userCommissionUpdate.isLoading(true));
    dispatch(userCommissionUpdate.error(null));

    try {
      const response = await updateUserCommissionAPI(userId, params);
      const commissionValue = response.data;
      dispatch(userCommissionUpdate.success(commissionValue));
      dispatch(snackbarSuccess(`role.update.successCommission`));
      options?.onSuccess && options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(userCommissionUpdate.error(err));
      dispatch(snackbarError('role.error.errorCommission'));
      options?.onError && options.onError();
    }
    dispatch(userCommissionUpdate.isLoading(false));
  };
}

export const franchiseUserCommissionUpdate = {
  error: createAction('FRANCHISE_ROLE/USER/COMMISSION_UPDATE/ERROR'),
  isLoading: createAction('FRANCHISE_ROLE/USER/COMMISSION_UPDATE/IS_LOADING'),
  success: createAction('FRANCHISE_ROLE/USER/COMMISSION_UPDATE/SUCCESS'),
};

export function updateFranchiseUserCommission(
  userId: number,
  params: {
    commission?: number;
  },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(franchiseUserCommissionUpdate.isLoading(true));
    dispatch(franchiseUserCommissionUpdate.error(null));

    try {
      const response = await updateFranchiseUserCommissionAPI(userId, params);
      const commissionValue = response.data;
      dispatch(franchiseUserCommissionUpdate.success(commissionValue));
      dispatch(snackbarSuccess(`role.update.successCommission`));
      options?.onSuccess && options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(franchiseUserCommissionUpdate.error(err));
      dispatch(snackbarError('role.error.errorCommission'));
      options?.onError && options.onError();
    }
    dispatch(franchiseUserCommissionUpdate.isLoading(false));
  };
}
