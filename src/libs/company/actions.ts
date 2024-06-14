import { createAction } from 'redux-actions';

import {
  PAYPAL_ACCOUNT_ALREADY_LINKED_TO_OTHER_COMPANY,
  PAYPAL_API_EXCEPTION,
} from '@bsport/common/lib/master-data/error-codes/payment.js';
import {
  fetchCompanyList as fetchCompanyListAPI,
  createCompany as createCompanyAPI,
  attachExternalAccount as attachExternalAccountAPI,
  retrieveMyCompanySetup as retrieveMyCompanySetupAPI,
  retrievePayPalAccountStatusAPI,
  getFeatureList as getFeatureListAPI,
  retrieveStripeCompanyRefreshedAPI,
  validateAccountConfigurationStepAPI,
  retrieveStripeCompanyAPI,
  getPayPalOnboardingLink as getPayPalOnboardingLinkAPI,
  retrieveStripeAccountStatusAPI,
  retrievePOSMember as retrievePOSMemberAPI,
} from './api';
import type { Dispatch, OptionCallback } from '../../state/types';
import type {
  AccountConfigurationStep,
  Company,
  CompanySetup,
  FeatureList,
  PayPalCompany,
  StripeAccountStatus,
  StripeCompany,
} from './types';
import { memberBulkActions } from '#src/libs/member/actions';
import type { Member } from '#src/libs/member/types';
import { isErrorWithCustomCode } from '../utils';
import { snackbarError } from '#src/actions/snackbar.actions';

export const searchActions = {
  success: createAction<Company[]>('COMPANY/SEARCH/SUCCESS'),
  isLoading: createAction<boolean>('COMPANY/SEARCH/IS_LOADING'),
  error: createAction<Error | null>('COMPANY/SEARCH/ERROR'),
};

export function searchCompany(
  text: string,
  options?: OptionCallback<Company[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(searchActions.isLoading(true));
    dispatch(searchActions.error(null));

    try {
      const response = await fetchCompanyListAPI({
        search: text,
      });
      dispatch(searchActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(searchActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(searchActions.isLoading(false));
  };
}
export function fetchCompanyBulk(
  id__in: Array<number>,
  options?: OptionCallback<Company[]>,
) {
  return async (dispatch: Dispatch) => {
    if (!id__in || id__in?.length === 0) {
      return;
    }
    dispatch(searchActions.isLoading(true));
    dispatch(searchActions.error(null));

    try {
      const response = await fetchCompanyListAPI({
        id__in,
      });
      dispatch(searchActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(searchActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(searchActions.isLoading(false));
  };
}

export const createCompanyActions = {
  success: createAction<StripeCompany>('COMPANY/CREATE/SUCCESS'),
  isLoading: createAction<boolean>('COMPANY/CREATE/IS_LOADING'),
  error: createAction<Error | null>('COMPANY/CREATE/ERROR'),
};

export function createCompany(
  data: { email: string; password: string; name: string; locale: string },
  options: OptionCallback<StripeCompany>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createCompanyActions.isLoading(true));
    dispatch(createCompanyActions.error(null));

    try {
      const response = await createCompanyAPI(data);
      dispatch(createCompanyActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(createCompanyActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(createCompanyActions.isLoading(false));
  };
}

export const attachExternalAccountActions = {
  success: createAction<StripeCompany>(
    'COMPANY/ATTACH_EXTERNAL_ACCOUNT/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'COMPANY/ATTACH_EXTERNAL_ACCOUNT/IS_LOADING',
  ),
  error: createAction<Error | null>('COMPANY/ATTACH_EXTERNAL_ACCOUNT/ERROR'),
};

export function attachExternalAccount(
  token: string,
  options: OptionCallback<StripeCompany>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(attachExternalAccountActions.isLoading(true));
    dispatch(attachExternalAccountActions.error(null));

    try {
      const response = await attachExternalAccountAPI(token);
      dispatch(attachExternalAccountActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(attachExternalAccountActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(attachExternalAccountActions.isLoading(false));
  };
}

export const listFeatureActions = {
  success: createAction<FeatureList>('COMPANY/LIST_FEATURE/SUCCESS'),
  isLoading: createAction<boolean>('COMPANY/LIST_FEATURE/IS_LOADING'),
  error: createAction<Error | null>('COMPANY/LIST_FEATURE/ERROR'),
};

export function getFeatureList(options?: OptionCallback<FeatureList>) {
  return async (dispatch: Dispatch) => {
    dispatch(listFeatureActions.isLoading(true));
    dispatch(listFeatureActions.error(null));

    try {
      const response = await getFeatureListAPI();
      dispatch(listFeatureActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(listFeatureActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(listFeatureActions.isLoading(false));
  };
}

/**
 * Retrieves the feature list without dispatching the loading action.
 *
 * ⚠️ WARNING: This function does not dispatch the loading action to avoid unnecessary reloading of the backoffice. Use it with caution ! ⚠️
 *
 * @param options - Optional callback options.
 * @returns An async function that takes a dispatch function as a parameter.
 */
export function getFeatureListWithoutLoading(
  options?: OptionCallback<FeatureList>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listFeatureActions.error(null));

    try {
      const response = await getFeatureListAPI();
      dispatch(listFeatureActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(listFeatureActions.error(err));
      if (options && options.onError) options.onError(err);
    }
  };
}

export const retrieveMyCompanyActions = {
  success: createAction<CompanySetup>('COMPANY/ME/SUCCESS'),
  isLoading: createAction<boolean>('COMPANY/ME/IS_LOADING'),
  error: createAction<Error | null>('COMPANY/ME/ERROR'),
};

export function retrieveMyCompanySetup(options?: OptionCallback<CompanySetup>) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveMyCompanyActions.isLoading(true));
    dispatch(retrieveMyCompanyActions.error(null));

    try {
      const response = await retrieveMyCompanySetupAPI();
      dispatch(retrieveMyCompanyActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(retrieveMyCompanyActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(retrieveMyCompanyActions.isLoading(false));
  };
}

export const fetchPayPalOnboardingLinkActions = {
  success: createAction<{ onboarding_url: string }>(
    'PAYPAL_COMPANY/ONBOARDING_LINK/FETCH/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'PAYPAL_COMPANY/ONBOARDING_LINK/FETCH/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'PAYPAL_COMPANY/ONBOARDING_LINK/FETCH/ERROR',
  ),
};

export function fetchPayPalOnboardingLink(
  options?: OptionCallback<{ onboarding_url: string }>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchPayPalOnboardingLinkActions.isLoading(true));
    dispatch(fetchPayPalOnboardingLinkActions.error(null));

    try {
      const response = await getPayPalOnboardingLinkAPI();
      dispatch(fetchPayPalOnboardingLinkActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(fetchPayPalOnboardingLinkActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(fetchPayPalOnboardingLinkActions.isLoading(false));
  };
}

export const retrievePayPalAccountStatusActions = {
  success: createAction<PayPalCompany>('PAYPAL_COMPANY/FETCH/SUCCESS'),
  isLoading: createAction<boolean>('PAYPAL_COMPANY/FETCH/IS_LOADING'),
  error: createAction<Error | null>('PAYPAL_COMPANY/FETCH/ERROR'),
};

export function retrievePayPalCompany(options?: OptionCallback<PayPalCompany>) {
  return async (dispatch: Dispatch) => {
    dispatch(retrievePayPalAccountStatusActions.isLoading(true));
    dispatch(retrievePayPalAccountStatusActions.error(null));

    try {
      const response = await retrievePayPalAccountStatusAPI();
      dispatch(retrievePayPalAccountStatusActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      if (
        isErrorWithCustomCode(err) &&
        err.response?.data?.error_code ===
          PAYPAL_ACCOUNT_ALREADY_LINKED_TO_OTHER_COMPANY
      ) {
        dispatch(snackbarError(`paypal.${err.response?.data?.error_code}`));
      } else if (
        isErrorWithCustomCode(err) &&
        err.response?.data?.error_code === PAYPAL_API_EXCEPTION
      ) {
        dispatch(snackbarError('paypal.couldNotReachPayPal'));
      } else {
        dispatch(snackbarError('paypal.connectionAttemptFailed'));
      }
      console.error(err);
      dispatch(retrievePayPalAccountStatusActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(retrievePayPalAccountStatusActions.isLoading(false));
  };
}

export const stripeCompanyRetrieveActions = {
  error: createAction<Error | null>('STRIPE_COMPANY/FETCH/ERROR'),
  isLoading: createAction<boolean>('STRIPE_COMPANY/FETCH/IS_LOADING'),
  success: createAction<StripeCompany>('STRIPE_COMPANY/FETCH/SUCCESS'),
};

export function retrieveStripeCompanyAction(
  params?: { refreshed?: boolean },
  options?: OptionCallback<StripeCompany>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(stripeCompanyRetrieveActions.isLoading(true));
    dispatch(stripeCompanyRetrieveActions.error(null));
    try {
      const response = params?.refreshed
        ? await retrieveStripeCompanyRefreshedAPI()
        : await retrieveStripeCompanyAPI();
      dispatch(stripeCompanyRetrieveActions.success(response.data));
      options?.onSuccess && options.onSuccess(response.data);
    } catch (error) {
      dispatch(stripeCompanyRetrieveActions.error(error));
      options?.onError && options.onError(error);
    }
    dispatch(stripeCompanyRetrieveActions.isLoading(false));
  };
}

export const validateAccountConfigurationStepActions = {
  isLoading: createAction<boolean>(
    'ACCOUNT_CONFIGURATION_STEP/VALIDATE/LOADING',
  ),
  error: createAction<Error | null>(
    'ACCOUNT_CONFIGURATION_STEP/VALIDATE/ERROR',
  ),
  success: createAction<AccountConfigurationStep>(
    'ACCOUNT_CONFIGURATION_STEP/VALIDATE/SUCCESS',
  ),
};

export function validateAccountConfigurationStepAction(
  data: { step: AccountConfigurationStep },
  options?: OptionCallback<void>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(validateAccountConfigurationStepActions.isLoading(true));
    dispatch(validateAccountConfigurationStepActions.error(null));
    try {
      const response = await validateAccountConfigurationStepAPI(data);
      dispatch(validateAccountConfigurationStepActions.success(data.step));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(validateAccountConfigurationStepActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(validateAccountConfigurationStepActions.isLoading(false));
  };
}
export const retrieveStripeAccountStatusActions = {
  isLoading: createAction<boolean>('RETRIEVE_STRIPE_ACCOUNT_STATUS/LOADING'),
  error: createAction<Error | null>('RETRIEVE_STRIPE_ACCOUNT_STATUS/ERROR'),
  success: createAction<StripeAccountStatus>(
    'RETRIEVE_STRIPE_ACCOUNT_STATUS/SUCCESS',
  ),
};

export function retrieveStripeAccountStatusAction(
  options: OptionCallback<StripeAccountStatus>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveStripeAccountStatusActions.isLoading(true));
    dispatch(retrieveStripeAccountStatusActions.error(null));
    try {
      const response = await retrieveStripeAccountStatusAPI();
      dispatch(retrieveStripeAccountStatusActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(retrieveStripeAccountStatusActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(retrieveStripeAccountStatusActions.isLoading(false));
  };
}

export function retrievePOSMember(
  companyId: number,
  options?: OptionCallback<Member>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(memberBulkActions.isLoading(true));
    dispatch(memberBulkActions.error(null));

    try {
      const response = await retrievePOSMemberAPI(companyId);
      dispatch(memberBulkActions.success([response.data]));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(memberBulkActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }

    dispatch(memberBulkActions.isLoading(false));
  };
}
