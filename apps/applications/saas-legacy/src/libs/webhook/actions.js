// @flow

import { createAction } from 'redux-actions';
import {
  fetchAllWebhooks as fetchAllWebhooksAPI,
  createWebhook as createWebhookAPI,
  deleteWebhook as deleteWebhookAPI,
  updateWebhook as updateWebhookAPI,
  fetchWebhookEventList as fetchWebhookEventListAPI,
} from './api';
import type { Dispatch, ThunkAction, OptionCallback } from '../../state/types';
import { snackbarSuccess, snackbarError } from '../snackbar/actions';
import { createDictionnaryById, createIdList } from '../../actions/utils';

export const webhookListAction = {
  success: createAction('WEBHOOK/LIST/SUCCESS'),
  error: createAction('WEBHOOK/LIST/ERROR'),
  loading: createAction('WEBHOOK/LIST/IS_LOADING'),
};

export const webhookEventListAction = {
  success: createAction('WEBHOOK_EVENT/LIST/SUCCESS'),
  error: createAction('WEBHOOK_EVENT/LIST/ERROR'),
  loading: createAction('WEBHOOK_EVENT/LIST/IS_LOADING'),
};

export function fetchWebhookEventList(): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(webhookEventListAction.error(null));
    dispatch(webhookEventListAction.loading(true));
    try {
      const response = await fetchWebhookEventListAPI();
      dispatch(webhookEventListAction.success(response.data));
    } catch (error) {
      dispatch(webhookEventListAction.error(error));
    }
    dispatch(webhookEventListAction.loading(false));
  };
}

export function fetchAllWebhooks(): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(webhookListAction.error(null));
    dispatch(webhookListAction.loading(true));
    try {
      const response = await fetchAllWebhooksAPI();
      dispatch(
        webhookListAction.success({
          webhookIdList: createIdList(response.data),
          webhookDict: createDictionnaryById(response.data),
        }),
      );
    } catch (error) {
      dispatch(webhookListAction.error(error));
    }
    dispatch(webhookListAction.loading(false));
  };
}

export const createWebhookAction = {
  success: createAction('WEBHOOK/CREATE/SUCCESS'),
  error: createAction('WEBHOOK/CREATE/ERROR'),
  loading: createAction('WEBHOOK/CREATE/IS_LOADING'),
};

export function createWebhook(data: any, options: OptionCallback): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(createWebhookAction.error(null));
    dispatch(createWebhookAction.loading(true));
    try {
      const response = await createWebhookAPI(data);
      dispatch(createWebhookAction.success(response.data));
      dispatch(snackbarSuccess('webhook.success'));
      if (options && options.onSuccess) {
        options.onSuccess(response);
      }
    } catch (error) {
      dispatch(createWebhookAction.error(error));
      dispatch(snackbarError('webhook.error'));
      if (options && options.onError) {
        options.onError(error);
      }
    }
  };
}

export const updateWebhookAction = {
  success: createAction('WEBHOOK/UPDATE/SUCCESS'),
  error: createAction('WEBHOOK/UPDATE/ERROR'),
  loading: createAction('WEBHOOK/UPDATE/IS_LOADING'),
};

export function updateWebhook(
  id: number,
  data: any,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(updateWebhookAction.error(null));
    dispatch(updateWebhookAction.loading(true));
    try {
      const response = await updateWebhookAPI(id, data);
      dispatch(updateWebhookAction.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response);
      }
      dispatch(snackbarSuccess('webhook.success'));
    } catch (error) {
      dispatch(updateWebhookAction.error(error));
      dispatch(snackbarError('webhook.error'));
      if (options && options.onError) {
        options.onError(error);
      }
    }
  };
}

export const deleteWebhookAction = {
  success: createAction('WEBHOOK/DELETE/SUCCESS'),
  error: createAction('WEBHOOK/DELETE/ERROR'),
  loading: createAction('WEBHOOK/DELETE/IS_LOADING'),
};

export function deleteWebhook(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(deleteWebhookAction.error(null));
    dispatch(deleteWebhookAction.loading(true));
    try {
      await deleteWebhookAPI(id);
      dispatch(deleteWebhookAction.success(id));
    } catch (error) {
      dispatch(deleteWebhookAction.error(error));
    }
  };
}
