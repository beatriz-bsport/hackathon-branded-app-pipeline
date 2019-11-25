// @flow

import { createAction } from 'redux-actions';

import api from './api';

import type { Dispatch, ThunkAction, OptionCallback } from '../../state/types';

export const detailActions = {
  error: createAction('SUBSCRIPTION/LOAD/ERROR'),
  isLoading: createAction('SUBSCRIPTION/LOAD/IS_LOADING'),
  success: createAction('SUBSCRIPTION/LOAD/SUCCESS'),
};

export const stopActions = {
  error: createAction('SUBSCRIPTION/STOP/ERROR'),
  isLoading: createAction('SUBSCRIPTION/STOP/IS_LOADING'),
  success: createAction('SUBSCRIPTION/STOP/SUCCESS'),
};

export function fetch(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(detailActions.isLoading(true));
    dispatch(detailActions.error(null));

    try {
      const response = await api.fetchDetail(id);

      dispatch(detailActions.success(response.data));
    } catch (error) {
      dispatch(detailActions.error(error));
    }

    dispatch(detailActions.isLoading(false));
  };
}

export function stop(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(stopActions.isLoading(true));
    dispatch(stopActions.error(null));

    try {
      const response = await api.stop(id);

      dispatch(detailActions.success(response.data));
    } catch (error) {
      dispatch(stopActions.error(error));
    }

    dispatch(stopActions.isLoading(false));
  };
}

export const contractListActions = {
  error: createAction('SUBSCRIPTION_CONTRACT/LIST/ERROR'),
  isLoading: createAction('SUBSCRIPTION_CONTRACT/LIST/IS_LOADING'),
  success: createAction('SUBSCRIPTION_CONTRACT/LIST/SUCCESS'),
};

export const contractCreateOrUpdateActions = {
  error: createAction('SUBSCRIPTION_CONTRACT/CREATE_OR_UPDATE/ERROR'),
  isLoading: createAction('SUBSCRIPTION_CONTRACT/CREATE_OR_UPDATE/IS_LOADING'),
  success: createAction('SUBSCRIPTION_CONTRACT/CREATE_OR_UPDATE/SUCCESS'),
};

export const contractDeleteActions = {
  error: createAction('SUBSCRIPTION_CONTRACT/DELETE/ERROR'),
  isLoading: createAction('SUBSCRIPTION_CONTRACT/DELETE/IS_LOADING'),
  success: createAction('SUBSCRIPTION_CONTRACT/DELETE/SUCCESS'),
};

export function fetchContractList(params: any) {
  return async (dispatch: Dispatch) => {
    dispatch(contractListActions.error(null));
    dispatch(contractListActions.isLoading(true));
    try {
      const response = await api.fetchContractList(params);
      dispatch(contractListActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(contractListActions.error(err));
    }
    dispatch(contractListActions.isLoading(false));
  };
}

export function createOrUpdateContract(data: any, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(contractCreateOrUpdateActions.error(null));
    dispatch(contractCreateOrUpdateActions.isLoading(true));
    try {
      const response = await api.createOrUpdateContract(data);
      dispatch(contractCreateOrUpdateActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(contractCreateOrUpdateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(contractCreateOrUpdateActions.isLoading(false));
  };
}

export function deleteContract(id: number, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(contractDeleteActions.error(null));
    dispatch(contractDeleteActions.isLoading(true));
    try {
      await api.deleteContract(id);
      dispatch(contractDeleteActions.success(id));
      if (options && options.onSuccess) options.onSuccess(id);
    } catch (err) {
      console.error(err);
      dispatch(contractDeleteActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(contractDeleteActions.isLoading(false));
  };
}
