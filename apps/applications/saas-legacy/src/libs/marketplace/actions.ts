import { createAction } from 'redux-actions';

import { snackbarError, snackbarSuccess } from '#src/libs/snackbar/actions';
import { Dispatch, OptionCallback } from '../../state/types';

import {
  fetchMarketplaceSettings as fetchMarketplaceSettingsAPI,
  updateMarketplaceSettings as updateMarketplaceSettingsAPI,
  fetchBookingFunnelConfiguration as fetchBookingFunnelConfigurationAPI,
  updateBookingFunnelConfiguration as updateBookingFunnelConfigurationAPI,
} from './api';
import {
  BookingFunnelConfiguration,
  MarketplaceSettings,
  PricingOptionOrdering,
} from './types';
import { getMarketplaceDefaultConfig } from './constants';

export const marketplaceSettingsAction = {
  error: createAction<Error | null>('MARKETPLACE_SETTINGS/ERROR'),
  isLoading: createAction<boolean>('MARKETPLACE_SETTINGS/IS_LOADING'),
  success: createAction<MarketplaceSettings>('MARKETPLACE_SETTINGS/SUCCESS'),
};

const MARKETPLACE_DEFAULT_CONFIG = getMarketplaceDefaultConfig();

export function fetchMarketplaceSettings(
  companyId: string,
  options?: OptionCallback<MarketplaceSettings>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(marketplaceSettingsAction.isLoading(true));
    dispatch(marketplaceSettingsAction.error(null));

    try {
      const response = await fetchMarketplaceSettingsAPI(companyId);

      // If the manager didnt config the marketplace tabs, we return the default config
      const marketplaceSettings: MarketplaceSettings = {
        ...response.data,
        config: response.data.is_custom
          ? response.data.config
          : MARKETPLACE_DEFAULT_CONFIG,
      };

      dispatch(marketplaceSettingsAction.success(marketplaceSettings));
      dispatch(marketplaceSettingsAction.error(null));
      options?.onSuccess?.(marketplaceSettings);
    } catch (error) {
      console.error(error);
      dispatch(marketplaceSettingsAction.error(error));
      options?.onError?.(error);
    } finally {
      dispatch(marketplaceSettingsAction.isLoading(false));
    }
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
      dispatch(snackbarError('marketplace.update.error'));
      dispatch(marketplaceSettingsAction.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(marketplaceSettingsAction.isLoading(false));
  };
}

export const bookingFunnelConfigurationAction = {
  error: createAction<Error | null>('BOOKING_FUNNEL_CONFIGURATION/FETCH/ERROR'),
  isLoading: createAction<boolean>(
    'BOOKING_FUNNEL_CONFIGURATION/FETCH/IS_LOADING',
  ),
  success: createAction<BookingFunnelConfiguration>(
    'BOOKING_FUNNEL_CONFIGURATION/FETCH/SUCCESS',
  ),
};

export function fetchBookingFunnelConfiguration(
  companyId: number,
  options?: OptionCallback<BookingFunnelConfiguration>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(bookingFunnelConfigurationAction.isLoading(true));
    dispatch(bookingFunnelConfigurationAction.error(null));

    try {
      const response = await fetchBookingFunnelConfigurationAPI(companyId);
      dispatch(bookingFunnelConfigurationAction.success(response.data));
      dispatch(bookingFunnelConfigurationAction.error(null));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(bookingFunnelConfigurationAction.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(bookingFunnelConfigurationAction.isLoading(false));
  };
}

export function updateBookingFunnelConfiguration(
  companyId: number,
  data: {
    custom_pricing_option_ordering_enabled: boolean;
    custom_pricing_option_ordering?: PricingOptionOrdering;
  },
  options?: OptionCallback<BookingFunnelConfiguration>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(bookingFunnelConfigurationAction.isLoading(true));
    dispatch(bookingFunnelConfigurationAction.error(null));

    try {
      const res = await updateBookingFunnelConfigurationAPI(companyId, data);
      const resultData = res.data;
      dispatch(bookingFunnelConfigurationAction.success(resultData));
      dispatch(bookingFunnelConfigurationAction.error(null));
      dispatch(snackbarSuccess('settings.update.success'));
      if (options && options.onSuccess) {
        options.onSuccess(resultData);
      }
    } catch (error) {
      console.error(error);
      dispatch(bookingFunnelConfigurationAction.error(error));
      dispatch(snackbarError('settings.update.error'));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(bookingFunnelConfigurationAction.isLoading(false));
  };
}
