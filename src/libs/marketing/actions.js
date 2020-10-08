// @flow

import { createAction } from 'redux-actions';
import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';

import {
  fetchMarketingNotification as fetchMarketingNotificationAPI,
  createOrUpdateMarketingNotification as createOrUpdateMarketingNotificationAPI,
  deleteMarketingNotification as deleteMarketingNotificationAPI,
} from './api';

import type { Dispatch, OptionCallback } from '../../state/types';

export const marketingNotificationListActions = {
  error: createAction('MARKETING_NOTIFICATION/LIST/ERROR'),
  isLoading: createAction('MARKETING_NOTIFICATION/LIST/IS_LOADING'),
  success: createAction('MARKETING_NOTIFICATION/LIST/SUCCESS'),
};

export function fetchMarketingNotificationList(options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(marketingNotificationListActions.isLoading(true));
    dispatch(marketingNotificationListActions.error(null));

    try {
      const response_custom = await fetchMarketingNotificationAPI();

      const data = [...response_custom.data];
      dispatch(marketingNotificationListActions.success(data));
      dispatch(marketingNotificationListActions.error(null));
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
  };
}

export const deleteMarketingNotificationActions = {
  error: createAction('MARKETING_NOTIFICATION/DELETE/ERROR'),
  isLoading: createAction('MARKETING_NOTIFICATION/DELETE/IS_LOADING'),
  success: createAction('MARKETING_NOTIFICATION/DELETE/SUCCESS'),
};

export function deleteMarketingNotification(
  id: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteMarketingNotificationActions.isLoading(true));
    dispatch(deleteMarketingNotificationActions.error(null));

    try {
      await deleteMarketingNotificationAPI(id);
      dispatch(deleteMarketingNotificationActions.success(id));
      dispatch(deleteMarketingNotificationActions.error(null));
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
