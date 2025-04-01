import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import { testNetworkActions, networkActions } from './actions';
import { ImmutableNetworkState, NetworkState } from './types';

const initialState: ImmutableNetworkState = Immutable({
  networkState: NetworkState.ONLINE,
  networkStateBuffer: NetworkState.ONLINE,
  lastNetworkStatusUpdateTime: Date.now(),
  fetchOrigin: {
    success: null,
    loading: false,
    error: null,
  },
});

export default handleActions<any>(
  {
    [networkActions.isOnline.toString()]: (state) => {
      return state.set('networkState', NetworkState.ONLINE);
    },
    [networkActions.isOffline.toString()]: (state) => {
      return state.set('networkState', NetworkState.OFFLINE);
    },
    [networkActions.serverIsUnavailable.toString()]: (state) => {
      return state.set('networkState', NetworkState.SERVER_ERROR);
    },
    [networkActions.networkRestored.toString()]: (state) => {
      return state.set('networkState', NetworkState.NETWORK_RESTORED);
    },
    [networkActions.serverRestored.toString()]: (state) => {
      return state.set('networkState', NetworkState.SERVER_RESTORED);
    },

    [networkActions.bufferIsOnline.toString()]: (state) => {
      return state.set('networkStateBuffer', NetworkState.ONLINE);
    },
    [networkActions.bufferIsOffline.toString()]: (state) => {
      return state.set('networkStateBuffer', NetworkState.OFFLINE);
    },
    [networkActions.bufferServerIsUnavailable.toString()]: (state) => {
      return state.set('networkStateBuffer', NetworkState.SERVER_ERROR);
    },

    [networkActions.lastNetworkStatusUpdateTime.toString()]: (
      state,
      { payload }: { payload: number },
    ) => {
      return state.set('lastNetworkStatusUpdateTime', payload);
    },
    [testNetworkActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['fetchOrigin', 'loading'], payload);
    },
    [testNetworkActions.success.toString()]: (
      state,
      { payload }: { payload: boolean | null },
    ) => {
      return state.setIn(['fetchOrigin', 'success'], payload);
    },
    [testNetworkActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['fetchOrigin', 'error'], payload);
    },
  },
  initialState,
);
