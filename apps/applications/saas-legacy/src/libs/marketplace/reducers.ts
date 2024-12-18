import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  marketplaceSettingsAction,
  bookingFunnelConfigurationAction,
} from './actions';
import type {
  MarketplaceSettingState,
  BookingFunnelConfiguration,
  MarketplaceSettings,
} from './types';

const initialState: Immutable.Immutable<MarketplaceSettingState> =
  Immutable<MarketplaceSettingState>({
    loading: false,
    error: null,
    settings: null,
    bookingFunnel: {
      loading: false,
      error: null,
      configuration: null,
    },
  });

export default handleActions<Immutable.Immutable<MarketplaceSettingState>, any>(
  {
    [marketplaceSettingsAction.success.toString()]: (
      state,
      { payload }: { payload: MarketplaceSettings },
    ) => {
      return state.setIn(['settings'], payload);
    },
    [marketplaceSettingsAction.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['loading'], payload);
    },
    [marketplaceSettingsAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['error'], payload);
    },
    [bookingFunnelConfigurationAction.success.toString()]: (
      state,
      {
        payload,
      }: {
        payload: BookingFunnelConfiguration;
      },
    ) => {
      return state.setIn(['bookingFunnel', 'configuration'], payload);
    },
    [bookingFunnelConfigurationAction.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['bookingFunnel', 'loading'], payload);
    },
    [bookingFunnelConfigurationAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['bookingFunnel', 'error'], payload);
    },
  },
  initialState,
);
