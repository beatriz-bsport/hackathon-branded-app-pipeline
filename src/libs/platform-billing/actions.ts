import { createAction } from 'redux-actions';

import {
  fetchPlatformInvoiceList as fetchPlatformInvoiceListAPI,
  fetchUpsellPackages as fetchUpsellPackagesAPI,
  fetchUpsellPackageSubscribedIds as fetchUpsellPackageSubscribedIdsAPI,
  fetchPlatformBillingPlanList as fetchPlatformBillingPlanListAPI,
  fetchPlatformBillingStageList as fetchPlatformBillingStageListAPI,
  retrieveSubscription as retrieveSubscriptionAPI,
  retrievePlatformBillingPlanGroup as retrievePlatformBillingPlanGroupAPI,
  requestUpsellPackage as requestUpsellPackageAPI,
  checkPlatformSubscriptionSetup as checkPlatformSubscriptionSetupAPI,
  payInvoice as payInvoiceAPI,
  retrievePlatformSubscriptionPaymentStatusAPI,
  subscribeUpsellPackage as subscribeUpsellPackageAPI,
} from './api';

import { snackbarError, snackbarSuccess } from '../snackbar/actions';
import { PlatformSubscriptionPaymentStatus } from './type';
import { getFeatureListWithoutLoading } from '#libs/company/actions';

import type { Dispatch, OptionCallback } from '../../state/types';
import {
  UpsellPackageSubscribedAPI,
  type UpsellPackage,
} from '#libs/company/types';

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
        // @ts-expect-error
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

export const fetchUpsellPackageActions = {
  isLoading: createAction<boolean>('UPSELL_PACKAGE/RETRIEVE_BY_ID/IS_LOADING'),
  error: createAction<Error | null>('UPSELL_PACKAGE/RETRIEVE_BY_ID/ERROR'),
  success: createAction<UpsellPackage>('UPSELL_PACKAGE/RETRIEVE_BY_ID/SUCCESS'),
};

/**
 * Fetches an upsell package based on the upsell identifier.
 *
 * @param upsellIdentifier - The identifier of the upsell package.
 * @returns - The async thunk function.
 */
export function fetchUpsellPackage(upsellIdentifier: number) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchUpsellPackageActions.isLoading(true));
    dispatch(fetchUpsellPackageActions.error(null));
    try {
      const response = await fetchUpsellPackagesAPI({
        upsell_identifier: upsellIdentifier,
      });
      // @ts-expect-error
      dispatch(fetchUpsellPackageActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(fetchUpsellPackageActions.error(err));
    }
    dispatch(fetchUpsellPackageActions.isLoading(false));
  };
}

export const listUpsellPackagesActions = {
  isLoading: createAction<boolean>('UPSELL_PACKAGE/LIST/IS_LOADING'),
  error: createAction<Error | null>('UPSELL_PACKAGE/LIST/ERROR'),
  success: createAction<UpsellPackage[]>('UPSELL_PACKAGE/LIST/SUCCESS'),
};

/**
 * Fetches the upsell packages with the given parameters and options.
 *
 * @param params - The parameters for the fetch request, passed through the url.
 * @param options - The callback options for the fetch request.
 * @returns - A promise that resolves with the fetched data.
 */
export function fetchUpsellPackages(params: any = {}, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(listUpsellPackagesActions.isLoading(true));
    dispatch(listUpsellPackagesActions.error(null));
    try {
      const response = await fetchUpsellPackagesAPI(params);
      dispatch(listUpsellPackagesActions.success(response.data));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(listUpsellPackagesActions.error(err));
      if (options && options.onError) {
        options.onError();
      }
    }
    dispatch(listUpsellPackagesActions.isLoading(false));
  };
}

export const listUpsellPackageSubscribedIdsActions = {
  isLoading: createAction<boolean>('UPSELL_PACKAGE_SUBSCRIBED/LIST/IS_LOADING'),
  error: createAction<Error | null>('UPSELL_PACKAGE_SUBSCRIBED/LIST/ERROR'),
  success: createAction<UpsellPackageSubscribedAPI[]>(
    'UPSELL_PACKAGE_SUBSCRIBED/LIST/SUCCESS',
  ),
};

/**
 * Fetches the subscribed upsell package IDs.
 *
 * @param params - The parameters for the fetch request, passed in the url.
 * @param options - The callback options for the fetch request.
 * @returns - The async thunk function.
 */
export function fetchUpsellPackageSubscribedIds(
  // @ts-expect-error
  params,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listUpsellPackageSubscribedIdsActions.isLoading(true));
    dispatch(listUpsellPackageSubscribedIdsActions.error(null));
    try {
      const response = await fetchUpsellPackageSubscribedIdsAPI(params);
      dispatch(listUpsellPackageSubscribedIdsActions.success(response.data));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(listUpsellPackageSubscribedIdsActions.error(err));
      if (options && options.onError) {
        options.onError();
      }
    }
    dispatch(listUpsellPackageSubscribedIdsActions.isLoading(false));
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
        // @ts-expect-error
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
        // @ts-expect-error
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
        // @ts-expect-error
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
        // @ts-expect-error
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

export function requestUpsellPackage(
  upsellIdentifier: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(requestUpsellPackageActions.isLoading(true));
    dispatch(requestUpsellPackageActions.error(null));
    try {
      const response = await requestUpsellPackageAPI(upsellIdentifier);
      dispatch(requestUpsellPackageActions.success(response.data));
      if (options && options.onSuccess) {
        // @ts-expect-error
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

export const subscribeUpsellPackageActions = {
  isLoading: createAction<boolean>('UPSELL_PACKAGE/SUBSCRIBE/IS_LOADING'),
  error: createAction<Error | null>('UPSELL_PACKAGE/SUBSCRIBE/ERROR'),
  success: createAction<{
    upsell_package_subscribed: UpsellPackageSubscribedAPI;
    upsell_package: UpsellPackage;
  }>('UPSELL_PACKAGE/SUBSCRIBE/SUCCESS'),
};

/**
 * Subscribes to an upsell package directly from the backoffice.
 *
 * @param id - The id of the upsell package.
 * @param options - The callback options for the subscription.
 * @returns - The async thunk function.
 */
export function subscribeUpsellPackage(id: number, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(subscribeUpsellPackageActions.isLoading(true));
    dispatch(subscribeUpsellPackageActions.error(null));
    try {
      const response = await subscribeUpsellPackageAPI(id);
      // Update feature list after subscription
      dispatch(getFeatureListWithoutLoading());
      dispatch(subscribeUpsellPackageActions.success(response.data));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(subscribeUpsellPackageActions.error(err));
      if (options && options.onError) {
        options.onError();
      }
    }
    dispatch(subscribeUpsellPackageActions.isLoading(false));
  };
}

export const checkPlatformSubscriptionSetupActions = {
  isLoading: createAction('PLATFORM_SUBSCRIPTION/CHECK_SETUP/IS_LOADING'),
  error: createAction('PLATFORM_SUBSCRIPTION/CHECK_SETUP/ERROR'),
  success: createAction('PLATFORM_SUBSCRIPTION/CHECK_SETUP/SUCCESS'),
};

export function checkPlatformSubscriptionSetup(options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(checkPlatformSubscriptionSetupActions.isLoading(true));
    dispatch(checkPlatformSubscriptionSetupActions.error(null));
    try {
      const response = await checkPlatformSubscriptionSetupAPI();
      dispatch(checkPlatformSubscriptionSetupActions.success(response.data));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(checkPlatformSubscriptionSetupActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(checkPlatformSubscriptionSetupActions.isLoading(false));
  };
}

export const payInvoiceActions = {
  isLoading: createAction('PLATFORM_INVOICE/PAY/IS_LOADING'),
  error: createAction('PLATFORM_INVOICE/PAY/ERROR'),
  success: createAction('PLATFORM_INVOICE/PAY/SUCCESS'),
};

export function payNowInvoice(
  payment_backend_id: string,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(payInvoiceActions.isLoading(true));
    dispatch(payInvoiceActions.error(null));
    try {
      const response = await payInvoiceAPI(payment_backend_id);
      dispatch(payInvoiceActions.success(response.data));
      if (options && options.onSuccess) {
        dispatch(snackbarSuccess('platformBilling.payNowInvoice.success'));
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(payInvoiceActions.error(err));
      dispatch(snackbarError('platformBilling.payNowInvoice.error'));
      if (options && options.onError) options.onError();
    }
    dispatch(payInvoiceActions.isLoading(false));
  };
}
export const retrievePlatformSubscriptionPaymentStatusActions = {
  isLoading: createAction(
    'RETRIEVE_PLATFORM_SUBSCRIPTION_PAYMENT_STATUS/LOADING',
  ),
  error: createAction('RETRIEVE_PLATFORM_SUBSCRIPTION_PAYMENT_STATUS/ERROR'),
  success: createAction(
    'RETRIEVE_PLATFORM_SUBSCRIPTION_PAYMENT_STATUS/SUCCESS',
  ),
};

export function retrievePlatformSubscriptionPaymentStatusAction(
  options: OptionCallback<PlatformSubscriptionPaymentStatus>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrievePlatformSubscriptionPaymentStatusActions.isLoading(true));
    dispatch(retrievePlatformSubscriptionPaymentStatusActions.error(null));
    try {
      const response = await retrievePlatformSubscriptionPaymentStatusAPI();
      dispatch(
        retrievePlatformSubscriptionPaymentStatusActions.success(response.data),
      );
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(retrievePlatformSubscriptionPaymentStatusActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(retrievePlatformSubscriptionPaymentStatusActions.isLoading(false));
  };
}
