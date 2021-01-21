import { createAction } from 'redux-actions';

import { Dispatch, OptionCallback } from '../../state/types';

import {
  fetchMarketplaceSettings as fetchMarketplaceSettingsAPI,
  updateMarketplaceSettings as updateMarketplaceSettingsAPI,
} from './api';
import { MarketplaceSettings } from './types';
import { MARKETPLACE_DEFAULT_CONFIG } from './constants';

export const marketplaceSettingsAction = {
  error: createAction('MARKETPLACE_SETTINGS/ERROR'),
  isLoading: createAction('MARKETPLACE_SETTINGS/IS_LOADING'),
  success: createAction('MARKETPLACE_SETTINGS/SUCCESS'),
};

export function fetchMarketplaceSettings(
  companyId: string,
  options?: OptionCallback<MarketplaceSettings>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(marketplaceSettingsAction.isLoading(true));
    dispatch(marketplaceSettingsAction.error(null));

    try {
      const res = await fetchMarketplaceSettingsAPI(companyId);
      const { data }: { data: MarketplaceSettings } = res;
      if (!data.is_custom) {
        data.config = MARKETPLACE_DEFAULT_CONFIG;
      }
      dispatch(marketplaceSettingsAction.success(data));
      dispatch(marketplaceSettingsAction.error(null));
      if (options && options.onSuccess) {
        options.onSuccess(data);
      }
    } catch (error) {
      console.error(error);
      dispatch(marketplaceSettingsAction.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(marketplaceSettingsAction.isLoading(false));
  };
}

export function updateMarketplaceSettings(
  companyId: string,
  params: any = {},
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(marketplaceSettingsAction.isLoading(true));
    dispatch(marketplaceSettingsAction.error(null));

    try {
      const res = await updateMarketplaceSettingsAPI(companyId, params);
      const data = { ...res.data };
      dispatch(marketplaceSettingsAction.success(data));
      dispatch(marketplaceSettingsAction.error(null));
      if (options && options.onSuccess) {
        options.onSuccess(data);
      }
    } catch (error) {
      console.error(error);
      dispatch(marketplaceSettingsAction.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(marketplaceSettingsAction.isLoading(false));
  };
}
