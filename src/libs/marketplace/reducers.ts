// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { marketplaceSettingsAction } from './actions';
import { MarketplaceSettingState } from './types';

const initialState: MarketplaceSettingState = Immutable<MarketplaceSettingState>(
  {
    loading: false,
    error: null,
    settings: null,
  },
);

export default handleActions(
  {
    [marketplaceSettingsAction.success]: (
      state: MarketplaceSettingState,
      { payload },
    ) => {
      return state.setIn(['settings'], payload);
    },
    [marketplaceSettingsAction.isLoading]: (
      state: MarketplaceSettingState,
      { payload },
    ) => {
      return state.set('loading', payload);
    },
    [marketplaceSettingsAction.error]: (
      state: MarketplaceSettingState,
      { payload },
    ) => {
      return state.set('error', payload);
    },
  },
  initialState,
) as () => MarketplaceSettingState;
