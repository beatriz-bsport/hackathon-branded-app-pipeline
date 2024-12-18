// @flow weak
import { networkActions } from './reducers';

const NETWORK_ERROR_MESSAGES = [
  'Network Error',
  // eslint-disable-next-line
  "Cannot read property 'data' of undefined",
];

export default (store) => (next) => (action) => {
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
      if (store.getState().network.isAvailable) {
        store.dispatch(networkActions.isUnavailable());
      }
    }
  }
  if (
    typeof action.type === 'string' &&
    (action.type.toLowerCase().includes('loaded') ||
      action.type.toLowerCase().includes('success'))
  ) {
    if (!store.getState().network.isAvailable) {
      store.dispatch(networkActions.isAvailable());
    }
  }
  return next(action);
};
