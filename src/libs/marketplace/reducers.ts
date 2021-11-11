import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { marketplaceSettingsAction } from './actions';
import { MarketplaceSettingState } from './types';

const initialState: Immutable.Immutable<MarketplaceSettingState> =
  Immutable<MarketplaceSettingState>({
    loading: false,
    error: null,
    settings: null,
  });

export default handleActions<Immutable.Immutable<MarketplaceSettingState>>(
  {
    [marketplaceSettingsAction.success.toString()]: (state, { payload }) => {
      return state.setIn(['settings'], payload);
    },
    [marketplaceSettingsAction.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [marketplaceSettingsAction.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
  },
  initialState,
);
