import Immutable from 'seamless-immutable';

import actionTypes from '../actions/paymentPack.types';

const initialState = Immutable({
  all: [],
  loading: true,
  error: false,
  errorMsg: '',
});

export default function activityReducers(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.HAS_FETCHED_ALL_PAYMENT_PACKS:
      return Immutable.merge(state, {
        all: Array.from(action.paymentPacks),
        loading: false,
        error: false,
      });

    case actionTypes.START_FETCH_ALL_PAYMENT_PACKS:
      return Immutable.merge(state, { loading: true, error: false });

    case actionTypes.ERROR_FETCHING_ALL_PAYMENT_PACKS:
      return Immutable.merge(state, {
        loading: false,
        error: true,
        errorMsg: action.err,
      });

    default:
      return state;
  }
}
