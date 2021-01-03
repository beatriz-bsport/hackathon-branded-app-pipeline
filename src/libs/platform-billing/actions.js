// @flow

import { createAction } from 'redux-actions';

import {
  fetchPlatformInvoiceList as fetchPlatformInvoiceListAPI,
  fetchUpsellPackageList as fetchUpsellPackageListAPI,
  fetchUpsellPackageSubscribedList as fetchUpsellPackageSubscribedListAPI,
  fetchPlatformBillingPlanList as fetchPlatformBillingPlanListAPI,
  fetchPlatformBillingStageList as fetchPlatformBillingStageListAPI,
  retrieveSubscription as retrieveSubscriptionAPI,
  retrievePlatformBillingPlanGroup as retrievePlatformBillingPlanGroupAPI,
  requestUpsellPackage as requestUpsellPackageAPI,
} from './api';

import type { Dispatch, OptionCallback } from '../../state/types';

export const listPlatformInvoiceActions = {
  isLoading: createAction('PLATFORM_INVOICE/LIST/IS_LOADING'),
  error: createAction('PLATFORM_INVOICE/LIST/ERROR'),
  success: createAction('PLATFORM_INVOICE/LIST/SUCCESS'),
};

export function fetchPlatformInvoiceList(
  params: any = {},
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listPlatformInvoiceActions.isLoading(true));
    dispatch(listPlatformInvoiceActions.error(null));
    try {
      const response = await fetchPlatformInvoiceListAPI(params);
      dispatch(listPlatformInvoiceActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(listPlatformInvoiceActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(listPlatformInvoiceActions.isLoading(false));
  };
}

export const listUpsellPackageActions = {
  isLoading: createAction('UPSELL_PACKAGE/LIST/IS_LOADING'),
  error: createAction('UPSELL_PACKAGE/LIST/ERROR'),
  success: createAction('UPSELL_PACKAGE/LIST/SUCCESS'),
};

export function fetchUpsellPackageList(
  params: any = {},
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listUpsellPackageActions.isLoading(true));
    dispatch(listUpsellPackageActions.error(null));
    try {
      const response = await fetchUpsellPackageListAPI(params);
      dispatch(listUpsellPackageActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(listUpsellPackageActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(listUpsellPackageActions.isLoading(false));
  };
}

export const listUpsellPackageSubscribedActions = {
  isLoading: createAction('UPSELL_PACKAGE_SUBSCRIBED/LIST/IS_LOADING'),
  error: createAction('UPSELL_PACKAGE_SUBSCRIBED/LIST/ERROR'),
  success: createAction('UPSELL_PACKAGE_SUBSCRIBED/LIST/SUCCESS'),
};

export function fetchUpsellPackageSubscribedList(
  params: any = {},
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listUpsellPackageSubscribedActions.isLoading(true));
    dispatch(listUpsellPackageSubscribedActions.error(null));
    try {
      const response = await fetchUpsellPackageSubscribedListAPI(params);
      dispatch(listUpsellPackageSubscribedActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(listUpsellPackageSubscribedActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(listUpsellPackageSubscribedActions.isLoading(false));
  };
}

export const listBillingPlanActions = {
  isLoading: createAction('BILLING_PLAN/LIST/IS_LOADING'),
  error: createAction('BILLING_PLAN/LIST/ERROR'),
  success: createAction('BILLING_PLAN/LIST/SUCCESS'),
};

export function fetchPlatformBillingPlanList(
  params: any = {},
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listBillingPlanActions.isLoading(true));
    dispatch(listBillingPlanActions.error(null));
    try {
      const response = await fetchPlatformBillingPlanListAPI(params);
      dispatch(listBillingPlanActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(listBillingPlanActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(listBillingPlanActions.isLoading(false));
  };
}

export const listBillingStageActions = {
  isLoading: createAction('BILLING_STAGE/LIST/IS_LOADING'),
  error: createAction('BILLING_STAGE/LIST/ERROR'),
  success: createAction('BILLING_STAGE/LIST/SUCCESS'),
};

export function fetchPlatformBillingStageList(
  params: any = {},
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listBillingStageActions.isLoading(true));
    dispatch(listBillingStageActions.error(null));
    try {
      const response = await fetchPlatformBillingStageListAPI(params);
      dispatch(listBillingStageActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(listBillingStageActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(listBillingStageActions.isLoading(false));
  };
}

export const retrieveSubscriptionActions = {
  isLoading: createAction('PLATFORM_SUBSCRIPTION/RETRIEVE/IS_LOADING'),
  error: createAction('PLATFORM_SUBSCRIPTION/RETRIEVE/ERROR'),
  success: createAction('PLATFORM_SUBSCRIPTION/RETRIEVE/SUCCESS'),
};

export function retrievePlatformSubscription(
  id: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveSubscriptionActions.isLoading(true));
    dispatch(retrieveSubscriptionActions.error(null));
    try {
      const response = await retrieveSubscriptionAPI();
      dispatch(retrieveSubscriptionActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(retrieveSubscriptionActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(retrieveSubscriptionActions.isLoading(false));
  };
}

export const retrievePlatformBillingPlanGroupActions = {
  isLoading: createAction('PLATFORM_BILLING_GROUP/RETRIEVE/IS_LOADING'),
  error: createAction('PLATFORM_BILLING_GROUP/RETRIEVE/ERROR'),
  success: createAction('PLATFORM_BILLING_GROUP/RETRIEVE/SUCCESS'),
};

export function retrievePlatformBillingGroup(options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(retrievePlatformBillingPlanGroupActions.isLoading(true));
    dispatch(retrievePlatformBillingPlanGroupActions.error(null));
    try {
      const response = await retrievePlatformBillingPlanGroupAPI();
      dispatch(retrievePlatformBillingPlanGroupActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(retrievePlatformBillingPlanGroupActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(retrievePlatformBillingPlanGroupActions.isLoading(false));
  };
}

export const requestUpsellPackageActions = {
  isLoading: createAction('UPSELL_PACKAGE/REQUEST_FEATURE/IS_LOADING'),
  error: createAction('UPSELL_PACKAGE/REQUEST_FEATURE/ERROR'),
  success: createAction('UPSELL_PACKAGE/REQUEST_FEATURE/SUCCESS'),
};

export function requestUpsellPackage(id: number, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(requestUpsellPackageActions.isLoading(true));
    dispatch(requestUpsellPackageActions.error(null));
    try {
      const response = await requestUpsellPackageAPI(id);
      dispatch(requestUpsellPackageActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(requestUpsellPackageActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(requestUpsellPackageActions.isLoading(false));
  };
}
