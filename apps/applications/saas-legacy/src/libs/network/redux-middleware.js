// @flow weak
import {
  updateNetworkStatusForUnreachableServer,
  beginConnectionRestored,
  testNetworkActions,
} from './actions';

import {
  NETWORK_ERROR_MESSAGES,
  MS_BETWEEN_NETWORK_STATUS_UPDATE,
} from './constants';

import { NetworkState } from './types';

export default (store) => (next) => (action) => {
  const state = store.getState();

  if (
    typeof action.type === 'string' &&
    action.type.toLowerCase().includes('error')
  ) {
    if (
      (action.payload &&
        NETWORK_ERROR_MESSAGES.includes(action.payload.message)) ||
      (action.error && NETWORK_ERROR_MESSAGES.includes(action.error.message)) ||
      (action.err && NETWORK_ERROR_MESSAGES.includes(action.err.message))
    ) {
      const canUpdate =
        state.network.lastNetworkStatusUpdateTime +
          MS_BETWEEN_NETWORK_STATUS_UPDATE <
        Date.now();
      if (canUpdate && !state.network.fetchOrigin.loading) {
        store.dispatch(updateNetworkStatusForUnreachableServer());
      }
    }
  }
  if (
    typeof action.type === 'string' &&
    action.type !== testNetworkActions.success.toString() && // otherwise we would get false positives on network tests
    (action.type.toLowerCase().includes('loaded') ||
      action.type.toLowerCase().includes('success'))
  ) {
    if (
      [NetworkState.OFFLINE, NetworkState.SERVER_ERROR].includes(
        state.network.networkStateBuffer,
      )
    ) {
      store.dispatch(beginConnectionRestored());
    }
  }
  return next(action);
};
