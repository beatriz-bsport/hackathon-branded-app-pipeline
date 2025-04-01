import { createAction } from 'redux-actions';
import type { Dispatch, GetState, ThunkAction } from '#src/state/types';
import { fetchOriginAPI } from './api';
import { sleep } from '#src/utils/storybookHelper';
import { NetworkState } from './types';
import { BUFFER_FOR_ERROR_MS_TIME, RESTORATION_MS_TIME } from './constants';

export const networkActions = {
  isOnline: createAction<void>('NETWORK/NETWORK_IS_AVAILABLE'),
  isOffline: createAction<void>('NETWORK/NETWORK_IS_UNAVAILABLE'),
  serverIsUnavailable: createAction<void>('NETWORK/BACKEND_IS_UNAVAILABLE'),
  serverRestored: createAction<void>('NETWORK/BACKEND_RESTORED'),
  networkRestored: createAction<void>('NETWORK/NETWORK_RESTORED'),

  bufferIsOnline: createAction<void>('NETWORK/BUFFER/IS_ONLINE'),
  bufferIsOffline: createAction<void>('NETWORK/BUFFER/NETWORK_IS_UNAVAILABLE'),
  bufferServerIsUnavailable: createAction<void>(
    'NETWORK/BUFFER/BACKEND_IS_UNAVAILABLE',
  ),

  lastNetworkStatusUpdateTime: createAction<number>(
    'NETWORK/LAST_NETWORK_STATUS_UPDATE_TIME',
  ),
};

export const testNetworkActions = {
  isLoading: createAction<boolean>('NETWORK/TEST_NETWORK/IS_LOADING'),
  error: createAction<Error | null>('NETWORK/TEST_NETWORK/ERROR'),
  success: createAction<boolean | null>('NETWORK/TEST_NETWORK/SUCCESS'),
};

// Only apply the network status change if the buffer state is the same after BUFFER_FOR_ERROR_MS_TIME milliseconds
function updateNetworkStateBasedOnBufferAfterTime(): ThunkAction {
  return async (dispatch: Dispatch, getState: GetState) => {
    const initialNetworkbufferState = getState().network.networkStateBuffer;
    await sleep(BUFFER_FOR_ERROR_MS_TIME);
    if (getState().network.networkStateBuffer === initialNetworkbufferState) {
      if (initialNetworkbufferState === NetworkState.OFFLINE) {
        dispatch(networkActions.isOffline());
      } else if (initialNetworkbufferState === NetworkState.SERVER_ERROR) {
        dispatch(networkActions.serverIsUnavailable());
      }
    }
  };
}

export function beginConnectionRestored(): ThunkAction {
  return async (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    // Prevents the network status from changing if the buffer state changes during updateNetworkStateBasedOnBufferAfterTime function sleep
    dispatch(networkActions.bufferIsOnline());
    if (state.network.networkState === NetworkState.SERVER_ERROR) {
      dispatch(networkActions.serverRestored());
      await sleep(RESTORATION_MS_TIME);

      // The state may change while waiting for the sleep to finish
      if (getState().network.networkState === NetworkState.SERVER_RESTORED) {
        dispatch(networkActions.isOnline());
      }
    }
    if (state.network.networkState === NetworkState.OFFLINE) {
      dispatch(networkActions.networkRestored());
      await sleep(RESTORATION_MS_TIME);

      // The state may change while waiting for the sleep to finish
      if (getState().network.networkState === NetworkState.NETWORK_RESTORED) {
        dispatch(networkActions.isOnline());
      }
    }
  };
}

/*  This function is used to test the network status of the user when the server is unreachable.
    It will dispatch the appropriate actions to update the network status of the user.*/
export function updateNetworkStatusForUnreachableServer(): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(testNetworkActions.error(null));
    dispatch(testNetworkActions.success(null));
    const currentTime = Date.now();
    dispatch(networkActions.lastNetworkStatusUpdateTime(currentTime));
    if (!self.navigator.onLine) {
      dispatch(networkActions.bufferIsOffline());
      dispatch(updateNetworkStateBasedOnBufferAfterTime());
      return;
    }

    dispatch(testNetworkActions.isLoading(true));
    try {
      const params = { currentTime: currentTime.toString() }; // to avoid caching
      await fetchOriginAPI(params);

      dispatch(testNetworkActions.success(true));

      dispatch(networkActions.bufferServerIsUnavailable());
      dispatch(updateNetworkStateBasedOnBufferAfterTime());
    } catch (error) {
      dispatch(testNetworkActions.success(false));
      dispatch(testNetworkActions.error(error as Error));

      dispatch(networkActions.bufferIsOffline());
      dispatch(updateNetworkStateBasedOnBufferAfterTime());
    }
    dispatch(testNetworkActions.isLoading(false));
  };
}
