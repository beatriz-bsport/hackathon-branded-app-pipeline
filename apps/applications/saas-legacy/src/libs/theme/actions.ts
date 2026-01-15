import { createAction } from 'redux-actions';

import { SPIVI_DOUBLE_BOOKING_ACTIVATION_EXCEPTION } from '@bsport/common/lib/master-data/error-codes/spivi.js';

import { Settings } from 'luxon';
import api, {
  fetchCompanyThemeWithCache as fetchCompanyThemeWithCacheAPI,
} from './api';
import { Dispatch, OptionCallback } from '../../state/types';
import { CompanyTheme } from './types';
import { snackbarSuccess, snackbarError } from '../snackbar/actions';

export const COMPANY_THEME_COVER_SIZE_EXCEPTION = 80003;

export const themeDetail = {
  error: createAction('THEME/DETAIL/ERROR'),
  isLoading: createAction('THEME/DETAIL/IS_LOADING'),
  success: createAction('THEME/DETAIL/SUCCESS'),
};

export const themeUpdate = {
  error: createAction('THEME/UDPATE/ERROR'),
  isLoading: createAction('THEME/UPDATE/IS_LOADING'),
};

export function fetchCompanyTheme(
  companyId?: number,
  options?: OptionCallback<CompanyTheme>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(themeDetail.isLoading(true));
    dispatch(themeDetail.error(null));

    try {
      const response = await api.fetchCompanyTheme(companyId);
      const theme = response.data;
      Settings.defaultZone = theme.timezone_name;
      dispatch(themeDetail.success(theme));
      if (options && options.onSuccess) {
        options.onSuccess(theme);
      }
    } catch (err) {
      console.error(err);
      dispatch(themeDetail.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(themeDetail.isLoading(false));
  };
}

export function fetchCompanyThemeWithCache(
  companyId: number,
  options?: OptionCallback<CompanyTheme>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(themeDetail.isLoading(true));
    dispatch(themeDetail.error(null));

    try {
      const response = await fetchCompanyThemeWithCacheAPI(companyId);
      const theme = response.data;
      Settings.defaultZone = theme.timezone_name;
      dispatch(themeDetail.success(theme));
      if (options && options.onSuccess) {
        options.onSuccess(theme);
      }
    } catch (err) {
      console.error(err);
      dispatch(themeDetail.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(themeDetail.isLoading(false));
  };
}

// this action does not have any loading,
// It was created to fetch the is_roll_call_mandatory variable without setting state.theme.theme.loading to true
// which unmounts components to render <LoadingBackOffice /> instead
export function refreshCompanyTheme(
  companyId?: number,
  options?: OptionCallback<CompanyTheme>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(themeDetail.error(null));

    try {
      const response = await api.fetchCompanyTheme(companyId);
      const theme = response.data;
      dispatch(themeDetail.success(theme));
      dispatch(themeDetail.isLoading(false));
      if (options && options.onSuccess) {
        options.onSuccess(theme);
      }
    } catch (err) {
      console.error(err);
      dispatch(themeDetail.error(err));
      dispatch(themeDetail.isLoading(false));
      if (options && options.onError) {
        options.onError(err);
      }
    }
  };
}

export function updateCompanyTheme(
  companyId: number,
  data: any,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(themeUpdate.isLoading(true));
    dispatch(themeUpdate.error(null));

    try {
      const response = await api.updateCompanyTheme(companyId, data);
      const theme = response.data;
      dispatch(themeDetail.success(theme));
      dispatch(themeUpdate.isLoading(false));
      dispatch(snackbarSuccess('companyTheme.update.success'));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      if (err.response?.data?.error_code) {
        if (
          err.response?.data?.error_code ===
          SPIVI_DOUBLE_BOOKING_ACTIVATION_EXCEPTION
        ) {
          dispatch(
            snackbarError(
              `snackbar:spivi.error.${err.response?.data?.error_code}`,
            ),
          );
        } else if (
          err.response?.data?.error_code === COMPANY_THEME_COVER_SIZE_EXCEPTION
        ) {
          dispatch(
            snackbarError(
              `companyTheme.update.customError.${err.response?.data?.error_code}`,
            ),
          );
        } else {
          dispatch(
            snackbarError(
              `companyTheme.provincialTax.customError.${err.response?.data?.error_code}`,
            ),
          );
        }
      } else {
        dispatch(snackbarError('companyTheme.update.error'));
      }

      dispatch(themeUpdate.error(err));
      dispatch(themeUpdate.isLoading(false));
      if (options && options.onError) options.onError();
    }
  };
}
export const provincialTaxCreateOrUpdateActions = {
  error: createAction('PROVINCIAL_TAX/CREATEORUPDATE/ERROR'),
  isLoading: createAction('PROVINCIAL_TAX/CREATEORUPDATE/IS_LOADING'),
  success: createAction('PROVINCIAL_TAX/CREATEORUPDATE/SUCCESS'),
};
