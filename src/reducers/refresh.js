import Immutable from 'seamless-immutable';
import { Moment } from '../i18n';
import types from '../actions/refresh.types';
import authTypes from '../actions/auth.types';

const initialState = Immutable({
  lastUpdate: 0,
  isRefreshing: false,
});

export default function refreshReducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.REFRESH_STORE_START: {
      return Immutable.merge(state, {
        isRefreshing: true,
        lastUpdate: Moment().unix(),
      });
    }
    case types.REFRESH_STORE_UNNECESSARY:
    case types.REFRESH_STORE_DONE:
      return Immutable.merge(state, { isRefreshing: false });

    case authTypes.DISCONNECT: {
      return Immutable.merge(state, { lastUpdate: 0, isRefreshing: false });
    }
    default:
      return state;
  }
}
