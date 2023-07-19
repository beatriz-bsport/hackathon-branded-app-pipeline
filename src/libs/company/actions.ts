import { createAction } from 'redux-actions';

import {
  fetchCompanyList as fetchCompanyListAPI,
  createCompany as createCompanyAPI,
  attachExternalAccount as attachExternalAccountAPI,
  retrieveMyCompanySetup as retrieveMyCompanySetupAPI,
  getFeatureList as getFeatureListAPI,
  retrieveStripeCompanyRefreshedAPI,
  validateAccountConfigurationStepAPI,
  retrieveStripeCompanyAPI,
  retrieveStripeAccountStatusAPI,
  retrievePOSMember as retrievePOSMemberAPI,
} from './api';
import type { Dispatch, OptionCallback } from '../../state/types';
import type {
  AccountConfigurationStep,
  Company,
  CompanySetup,
  StripeCompany,
  UpsellSumup,
} from './types';
import { memberBulkActions } from '#libs/member/actions';
import type { Member } from '#libs/member/types';

export const searchActions = {
  success: createAction('COMPANY/SEARCH/SUCCESS'),
  isLoading: createAction('COMPANY/SEARCH/IS_LOADING'),
  error: createAction('COMPANY/SEARCH/ERROR'),
};

export function searchCompany(
  text: string,
  options?: OptionCallback<Array<Company>>,
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
  options?: OptionCallback<Array<Company>>,
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
  success: createAction('COMPANY/CREATE/SUCCESS'),
  isLoading: createAction('COMPANY/CREATE/IS_LOADING'),
  error: createAction('COMPANY/CREATE/ERROR'),
};

export function createCompany(
  data: { email: string; password: string; name: string; country: string },
  options: OptionCallback<Company>,
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
  success: createAction('COMPANY/ATTACH_EXTERNAL_ACCOUNT/SUCCESS'),
  isLoading: createAction('COMPANY/ATTACH_EXTERNAL_ACCOUNT/IS_LOADING'),
  error: createAction('COMPANY/ATTACH_EXTERNAL_ACCOUNT/ERROR'),
};

export function attachExternalAccount(
  token: string,
  options: OptionCallback<string>,
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
  success: createAction('COMPANY/LIST_FEATURE/SUCCESS'),
  isLoading: createAction('COMPANY/LIST_FEATURE/IS_LOADING'),
  error: createAction('COMPANY/LIST_FEATURE/ERROR'),
};

export function getFeatureList(options: OptionCallback<UpsellSumup>) {
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
export const retrieveMyCompanyActions = {
  success: createAction('COMPANY/ME/SUCCESS'),
  isLoading: createAction('COMPANY/ME/IS_LOADING'),
  error: createAction('COMPANY/ME/ERROR'),
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

export const stripeCompanyRetrieveActions = {
  error: createAction('STRIPE_COMPANY/FETCH/ERROR'),
  isLoading: createAction('STRIPE_COMPANY/FETCH/IS_LOADING'),
  success: createAction('STRIPE_COMPANY/FETCH/SUCCESS'),
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
  isLoading: createAction('ACCOUNT_CONFIGURATION_STEP/VALIDATE/LOADING'),
  error: createAction('ACCOUNT_CONFIGURATION_STEP/VALIDATE/ERROR'),
  success: createAction('ACCOUNT_CONFIGURATION_STEP/VALIDATE/SUCCESS'),
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
  isLoading: createAction('RETRIEVE_STRIPE_ACCOUNT_STATUS/LOADING'),
  error: createAction('RETRIEVE_STRIPE_ACCOUNT_STATUS/ERROR'),
  success: createAction('RETRIEVE_STRIPE_ACCOUNT_STATUS/SUCCESS'),
};

export function retrieveStripeAccountStatusAction(options: OptionCallback) {
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
