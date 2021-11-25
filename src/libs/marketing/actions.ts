import { createAction } from 'redux-actions';
import { snackbarSuccess, snackbarError } from '../snackbar/actions';

import {
  fetchMarketingNotificationList as fetchMarketingNotificationListAPI,
  fetchMarketingNotification as fetchMarketingNotificationAPI,
  createOrUpdateMarketingNotification as createOrUpdateMarketingNotificationAPI,
  deleteMarketingNotification as deleteMarketingNotificationAPI,
  createMarketingNotification as createMarketingNotificationAPI,
  updateMarketingNotification as updateMarketingNotificationAPI,
} from './api';

import type { Dispatch, OptionCallback } from '../../state/types';

export const marketingNotificationListActions = {
  error: createAction('MARKETING_NOTIFICATION/LIST/ERROR'),
  isLoading: createAction('MARKETING_NOTIFICATION/LIST/IS_LOADING'),
  success: createAction('MARKETING_NOTIFICATION/LIST/SUCCESS'),
};

export function fetchMarketingNotificationList(
  params: any = {},
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(marketingNotificationListActions.isLoading(true));
    dispatch(marketingNotificationListActions.error(null));
    let data = null;
    try {
      const response_custom = await fetchMarketingNotificationListAPI(params);
      data = [...response_custom.data];
      dispatch(marketingNotificationListActions.success(data));
      if (options && options.onSuccess) {
        options.onSuccess(data);
      }
    } catch (error) {
      console.error(error);
      dispatch(marketingNotificationListActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(marketingNotificationListActions.isLoading(false));
    return data;
  };
}

export const marketingNotificationActions = {
  error: createAction('MARKETING_NOTIFICATION/DETAIL/ERROR'),
  isLoading: createAction('MARKETING_NOTIFICATION/DETAIL/IS_LOADING'),
  success: createAction('MARKETING_NOTIFICATION/DETAIL/SUCCESS'),
};

export function fetchMarketingNotification(
  id: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(marketingNotificationActions.isLoading(true));
    dispatch(marketingNotificationActions.error(null));

    try {
      const response = await fetchMarketingNotificationAPI(id);
      dispatch(marketingNotificationActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(marketingNotificationActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(marketingNotificationActions.isLoading(false));
  };
}

export const deleteMarketingNotificationActions = {
  error: createAction('MARKETING_NOTIFICATION/DELETE/ERROR'),
  isLoading: createAction('MARKETING_NOTIFICATION/DELETE/IS_LOADING'),
  success: createAction('MARKETING_NOTIFICATION/DELETE/SUCCESS'),
};

export function deleteMarketingNotification(
  id: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteMarketingNotificationActions.isLoading(true));
    dispatch(deleteMarketingNotificationActions.error(null));

    try {
      await deleteMarketingNotificationAPI(id);
      dispatch(deleteMarketingNotificationActions.success(id));
      if (options && options.onSuccess) {
        options.onSuccess(id);
      }
    } catch (error) {
      console.error(error);
      dispatch(deleteMarketingNotificationActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(deleteMarketingNotificationActions.isLoading(false));
  };
}

export const marketingNotificationCreateOrUpdateActions = {
  error: createAction('MARKETING_NOTIFICATION/CREATE_OR_UPDATE/ERROR'),
  isLoading: createAction('MARKETING_NOTIFICATION/CREATE_OR_UPDATE/IS_LOADING'),
  success: createAction('MARKETING_NOTIFICATION/CREATE_OR_UPDATE/SUCCESS'),
};

export function createOrUpdateMarketingNotification(
  data: any,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(marketingNotificationCreateOrUpdateActions.isLoading(true));
    dispatch(marketingNotificationCreateOrUpdateActions.error(null));

    try {
      const response = await createOrUpdateMarketingNotificationAPI(data);
      dispatch(
        marketingNotificationCreateOrUpdateActions.success(response.data),
      );
      dispatch(marketingNotificationCreateOrUpdateActions.error(null));
      dispatch(snackbarSuccess('notificationRule.createOrUpdate.success'));
      dispatch(fetchMarketingNotificationList());
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(marketingNotificationCreateOrUpdateActions.error(error));
      dispatch(snackbarError('notificationRule.createOrUpdate.error'));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(marketingNotificationCreateOrUpdateActions.isLoading(false));
  };
}

export const marketingNotificationCreateActions = {
  error: createAction('MARKETING_NOTIFICATION/CREATE/ERROR'),
  isLoading: createAction('MARKETING_NOTIFICATION/CREATE/IS_LOADING'),
  success: createAction('MARKETING_NOTIFICATION/CREATE/SUCCESS'),
};

export function createMarketingNotification(
  data: any,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(marketingNotificationCreateActions.isLoading(true));
    dispatch(marketingNotificationCreateActions.error(null));

    try {
      const response = await createMarketingNotificationAPI(data);
      dispatch(marketingNotificationCreateActions.success(response.data));
      dispatch(marketingNotificationCreateActions.error(null));
      dispatch(snackbarSuccess('notificationRule.createOrUpdate.success'));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(marketingNotificationCreateActions.error(error));
      dispatch(snackbarError('notificationRule.createOrUpdate.error'));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(marketingNotificationCreateActions.isLoading(false));
  };
}

export const marketingNotificationUpdateActions = {
  error: createAction('MARKETING_NOTIFICATION/UPDATE/ERROR'),
  isLoading: createAction('MARKETING_NOTIFICATION/UPDATE/IS_LOADING'),
  success: createAction('MARKETING_NOTIFICATION/UPDATE/SUCCESS'),
};

export function updateMarketingNotification(
  id: number,
  data: any,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(marketingNotificationUpdateActions.isLoading(true));
    dispatch(marketingNotificationUpdateActions.error(null));

    try {
      const response = await updateMarketingNotificationAPI(id, data);
      dispatch(marketingNotificationUpdateActions.success(response.data));
      dispatch(marketingNotificationUpdateActions.error(null));
      dispatch(snackbarSuccess('notificationRule.createOrUpdate.success'));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(marketingNotificationUpdateActions.error(error));
      dispatch(snackbarError('notificationRule.createOrUpdate.error'));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(marketingNotificationUpdateActions.isLoading(false));
  };
}
