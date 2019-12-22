// @flow

import { createAction } from 'redux-actions';

import api from './api';

import type { Dispatch, ThunkAction, OptionCallback } from '../../state/types';

export const listSubscriptionActions = {
  error: createAction('SUBSCRIPTION/LIST/ERROR'),
  isLoading: createAction('SUBSCRIPTION/LIST/IS_LOADING'),
  success: createAction('SUBSCRIPTION/LIST/SUCCESS'),
};

export function fetchSubscriptionList(params: any, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(listSubscriptionActions.isLoading(true));
    dispatch(listSubscriptionActions.error(null));

    try {
      const response = await api.fetchSubscriptionList(params);
      dispatch(listSubscriptionActions.success(response.data));

      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (error) {
      dispatch(listSubscriptionActions.error(error));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }

    dispatch(listSubscriptionActions.isLoading(false));
  };
}

export const byMemberSubscriptionActions = {
  error: createAction('SUBSCRIPTION/BY_MEMBER/ERROR'),
  isLoading: createAction('SUBSCRIPTION/BY_MEMBER/IS_LOADING'),
  success: createAction('SUBSCRIPTION/BY_MEMBER/SUCCESS'),
};

export function fetchSubscriptionListByMember(
  member: number,
  params: any = {},
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(byMemberSubscriptionActions.isLoading(true));
    dispatch(byMemberSubscriptionActions.error(null));

    try {
      const response = await api.fetchSubscriptionList({ ...params, member });
      dispatch(byMemberSubscriptionActions.success(response.data));

      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (error) {
      dispatch(byMemberSubscriptionActions.error(error));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }

    dispatch(byMemberSubscriptionActions.isLoading(false));
  };
}

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

export const contractMarketplaceListActions = {
  error: createAction('SUBSCRIPTION_CONTRACT/MARKETPLACE_LIST/ERROR'),
  isLoading: createAction('SUBSCRIPTION_CONTRACT/MARKETPLACE_LIST/IS_LOADING'),
  success: createAction('SUBSCRIPTION_CONTRACT/MARKETPLACE_LIOST/SUCCESS'),
};

export function fetchMarketplaceContractList(
  company: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(contractMarketplaceListActions.error(null));
    dispatch(contractMarketplaceListActions.isLoading(true));
    try {
      const response = await api.fetchContractList({
        company,
        manager_only: false,
        page_size: 300,
      });
      dispatch(contractMarketplaceListActions.success(response.data.results));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      console.error(err);
      dispatch(contractMarketplaceListActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(contractMarketplaceListActions.isLoading(false));
  };
}
