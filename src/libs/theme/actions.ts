import { createAction } from 'redux-actions';
import moment from 'moment-timezone';

import api from './api';
// @ts-ignore
import { Dispatch, OptionCallback } from '../../state/types';
import { CompanyTheme } from './types';
import { snackbarSuccess, snackbarError } from '../snackbar/actions';

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
      moment.tz.setDefault(theme.timezone_name);
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
        dispatch(
          snackbarError(
            `companyTheme.provincialTax.customError.${err.response?.data?.error_code}`,
          ),
        );
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
