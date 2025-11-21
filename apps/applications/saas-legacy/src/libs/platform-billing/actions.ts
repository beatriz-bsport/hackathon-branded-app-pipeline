import { createAction } from 'redux-actions';

import { getFeatureListWithoutLoading } from '#src/libs/company/actions';
import {
  UpsellPackageSubscribedAPI,
  type UpsellPackage,
} from '#src/libs/company/types';
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
  fetchPlatformCustomerEntity as fetchPlatformCustomerEntityAPI,
  updatePlatformCustomerEntityVatInformation as updatePlatformCustomerEntityVatInformationAPI,
  fetchPlatformCustomerEntityRepresentatives as fetchPlatformCustomerEntityRepresentativesAPI,
  createPlatformCustomerEntityRepresentative as createPlatformCustomerEntityRepresentativeAPI,
  updatePlatformCustomerEntityRepresentative as updatePlatformCustomerEntityRepresentativeAPI,
} from './api';

import { snackbarError, snackbarSuccess } from '../snackbar/actions';
import {
  PlatformSubscriptionPaymentStatus,
  PlatformCustomerEntity,
  PlatformCustomerEntityRepresentative,
  PlatformCustomerEntityRepresentativeInput,
  UpdatePlatformCustomerEntityVatInformationParams,
} from './type';

import type { Dispatch, OptionCallback } from '#src/state/types';

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

export const fetchPlatformCustomerEntityActions = {
  isLoading: createAction('PLATFORM_CUSTOMER_ENTITY/FETCH/IS_LOADING'),
  error: createAction('PLATFORM_CUSTOMER_ENTITY/FETCH/ERROR'),
  success: createAction('PLATFORM_CUSTOMER_ENTITY/FETCH/SUCCESS'),
};

export function fetchPlatformCustomerEntity(
  options?: OptionCallback<PlatformCustomerEntity>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchPlatformCustomerEntityActions.isLoading(true));
    dispatch(fetchPlatformCustomerEntityActions.error(null));
    try {
      const response = await fetchPlatformCustomerEntityAPI();

      dispatch(fetchPlatformCustomerEntityActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(fetchPlatformCustomerEntityActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(fetchPlatformCustomerEntityActions.isLoading(false));
  };
}

export function updatePlatformCustomerEntityVatInformation(
  params: UpdatePlatformCustomerEntityVatInformationParams,
  options: OptionCallback,
) {
  return async (_dispatch: Dispatch) => {
    try {
      await updatePlatformCustomerEntityVatInformationAPI(params);
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (err) {
      console.error(err);
      if (options && options.onError) options.onError();
    }
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

export const listPlatformCustomerEntityRepresentativesActions = {
  isLoading: createAction<boolean>(
    'PLATFORM_CUSTOMER_ENTITY_REPRESENTATIVE/LIST/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'PLATFORM_CUSTOMER_ENTITY_REPRESENTATIVE/LIST/ERROR',
  ),
  success: createAction<PlatformCustomerEntityRepresentative[]>(
    'PLATFORM_CUSTOMER_ENTITY_REPRESENTATIVE/LIST/SUCCESS',
  ),
};

export function fetchPlatformCustomerEntityRepresentatives(
  options?: OptionCallback<PlatformCustomerEntityRepresentative[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listPlatformCustomerEntityRepresentativesActions.isLoading(true));
    dispatch(listPlatformCustomerEntityRepresentativesActions.error(null));
    try {
      const response = await fetchPlatformCustomerEntityRepresentativesAPI();
      const representatives = response.data.results || [];
      dispatch(
        listPlatformCustomerEntityRepresentativesActions.success(
          representatives,
        ),
      );
      options?.onSuccess?.(representatives);
    } catch (err) {
      console.error(err);
      dispatch(
        listPlatformCustomerEntityRepresentativesActions.error(
          err instanceof Error ? err : new Error(String(err)),
        ),
      );
      options?.onError?.();
    }
    dispatch(listPlatformCustomerEntityRepresentativesActions.isLoading(false));
  };
}

export const createPlatformCustomerEntityRepresentativeActions = {
  isLoading: createAction<boolean>(
    'PLATFORM_CUSTOMER_ENTITY_REPRESENTATIVE/CREATE/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'PLATFORM_CUSTOMER_ENTITY_REPRESENTATIVE/CREATE/ERROR',
  ),
  success: createAction<PlatformCustomerEntityRepresentative>(
    'PLATFORM_CUSTOMER_ENTITY_REPRESENTATIVE/CREATE/SUCCESS',
  ),
};

export function createPlatformCustomerEntityRepresentative(
  data: PlatformCustomerEntityRepresentativeInput,
  options?: OptionCallback<PlatformCustomerEntityRepresentative>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createPlatformCustomerEntityRepresentativeActions.isLoading(true));
    dispatch(createPlatformCustomerEntityRepresentativeActions.error(null));
    try {
      const response = await createPlatformCustomerEntityRepresentativeAPI(
        data,
      );
      dispatch(
        createPlatformCustomerEntityRepresentativeActions.success(
          response.data,
        ),
      );
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(
        createPlatformCustomerEntityRepresentativeActions.error(
          err instanceof Error ? err : new Error(String(err)),
        ),
      );
      options?.onError?.();
    }
    dispatch(
      createPlatformCustomerEntityRepresentativeActions.isLoading(false),
    );
  };
}

export const updatePlatformCustomerEntityRepresentativeActions = {
  isLoading: createAction<boolean>(
    'PLATFORM_CUSTOMER_ENTITY_REPRESENTATIVE/UPDATE/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'PLATFORM_CUSTOMER_ENTITY_REPRESENTATIVE/UPDATE/ERROR',
  ),
  success: createAction<PlatformCustomerEntityRepresentative>(
    'PLATFORM_CUSTOMER_ENTITY_REPRESENTATIVE/UPDATE/SUCCESS',
  ),
};

export function updatePlatformCustomerEntityRepresentative(
  id: number,
  data: Partial<PlatformCustomerEntityRepresentativeInput>,
  options?: OptionCallback<PlatformCustomerEntityRepresentative>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updatePlatformCustomerEntityRepresentativeActions.isLoading(true));
    dispatch(updatePlatformCustomerEntityRepresentativeActions.error(null));
    try {
      const response = await updatePlatformCustomerEntityRepresentativeAPI(
        id,
        data,
      );
      dispatch(
        updatePlatformCustomerEntityRepresentativeActions.success(
          response.data,
        ),
      );
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(
        updatePlatformCustomerEntityRepresentativeActions.error(
          err instanceof Error ? err : new Error(String(err)),
        ),
      );
      options?.onError?.();
    }
    dispatch(
      updatePlatformCustomerEntityRepresentativeActions.isLoading(false),
    );
  };
}
