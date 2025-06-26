import { createAction } from 'redux-actions';

import {
  fetchManagerCssWidgetConfiguration as fetchManagerCssWidgetConfigurationAPI,
  resetCssWidgetConfiguration as resetCssWidgetConfigurationAPI,
  fetchCompanyCssWidgetConfiguration as fetchCompanyCssWidgetConfigurationAPI,
  saveCssWidgetConfiguration as saveCssWidgetConfigurationAPI,
  fetchCompanyCssWidgetConfigurationWithCache,
} from './api';

import { snackbarSuccess } from '../snackbar/actions';

import { OptionCallback, Dispatch } from '../../state/types';
import { MarketplaceCSSConfiguration } from './types';

export const retrieveManagerCssConfigurationActions = {
  isLoading: createAction<boolean>('WIDGET/RETRIEVE_MANAGER_CONFIG/IS_LOADING'),
  error: createAction<Error>('WIDGET/RETRIEVE_MANAGER_CONFIG/ERROR'),
  success: createAction<MarketplaceCSSConfiguration>(
    'WIDGET/RETRIEVE_MANAGER_CONFIG/SUCCESS',
  ),
};

export function retrieveManagerCssConfiguration(
  options?: OptionCallback<MarketplaceCSSConfiguration>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveManagerCssConfigurationActions.isLoading(true));
    dispatch(retrieveManagerCssConfigurationActions.error(null));
    try {
      const response = await fetchManagerCssWidgetConfigurationAPI();

      dispatch(retrieveManagerCssConfigurationActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(retrieveManagerCssConfigurationActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(retrieveManagerCssConfigurationActions.isLoading(false));
  };
}

export const retrieveCompanyCssConfigurationActions = {
  isLoading: createAction<boolean>('WIDGET/RETRIEVE_COMPANY_CONFIG/IS_LOADING'),
  error: createAction<Error>('WIDGET/RETRIEVE_COMPANY_CONFIG/ERROR'),
  success: createAction<MarketplaceCSSConfiguration>(
    'WIDGET/RETRIEVE_COMPANY_CONFIG/SUCCESS',
  ),
};

export function retrieveCompanyCssConfiguration(
  company: number,
  options?: OptionCallback<MarketplaceCSSConfiguration[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveCompanyCssConfigurationActions.isLoading(true));
    dispatch(retrieveCompanyCssConfigurationActions.error(null));
    try {
      const response = await fetchCompanyCssWidgetConfigurationAPI(company);
      dispatch(
        retrieveCompanyCssConfigurationActions.success(response.data?.[0]),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(retrieveCompanyCssConfigurationActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(retrieveCompanyCssConfigurationActions.isLoading(false));
  };
}

export function retrieveCompanyCssConfigurationWithCache(
  company: number,
  options?: OptionCallback<MarketplaceCSSConfiguration[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveCompanyCssConfigurationActions.isLoading(true));
    dispatch(retrieveCompanyCssConfigurationActions.error(null));
    try {
      const response = await fetchCompanyCssWidgetConfigurationWithCache(
        company,
      );
      dispatch(
        retrieveCompanyCssConfigurationActions.success(response.data?.[0]),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(retrieveCompanyCssConfigurationActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(retrieveCompanyCssConfigurationActions.isLoading(false));
  };
}

export const saveCssConfigurationActions = {
  isLoading: createAction<boolean>('WIDGET/SAVE_CONFIG/IS_LOADING'),
  error: createAction<Error>('WIDGET/SAVE_CONFIG/ERROR'),
  success: createAction<MarketplaceCSSConfiguration>(
    'WIDGET/SAVE_CONFIG/SUCCESS',
  ),
};

export function saveCssConfiguration(
  configId: number,
  componentsCss: MarketplaceCSSConfiguration['components_css'],
  options?: OptionCallback<MarketplaceCSSConfiguration>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(saveCssConfigurationActions.isLoading(true));
    dispatch(saveCssConfigurationActions.error(null));
    try {
      const response = await saveCssWidgetConfigurationAPI(
        configId,
        componentsCss,
      );

      dispatch(saveCssConfigurationActions.success(response.data));
      dispatch(snackbarSuccess('widget:widget.customCss.snackbarSuccessSave'));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(saveCssConfigurationActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(saveCssConfigurationActions.isLoading(false));
  };
}

export const resetConfigurationActions = {
  isLoading: createAction<boolean>('WIDGET/RESET_CONFIG/IS_LOADING'),
  error: createAction<Error>('WIDGET/RESET_CONFIG/ERROR'),
  success: createAction<MarketplaceCSSConfiguration>(
    'WIDGET/RESET_CONFIG/SUCCESS',
  ),
};

export function resetCssWidgetConfiguration(
  options?: OptionCallback<MarketplaceCSSConfiguration>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(resetConfigurationActions.isLoading(true));
    dispatch(resetConfigurationActions.error(null));
    try {
      const response = await resetCssWidgetConfigurationAPI();
      dispatch(
        snackbarSuccess('widget:widget.customCss.snackbarSuccessResetAll'),
      );

      dispatch(resetConfigurationActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(resetConfigurationActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(resetConfigurationActions.isLoading(false));
  };
}
