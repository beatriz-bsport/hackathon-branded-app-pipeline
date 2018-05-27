import Immutable from 'seamless-immutable';

import actionTypes from '../actions/offer.types';

const initialState = Immutable({
  all: [],
  loading: false,
  error: false,
  errorMsg: '',
});

export default function offerReducers(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.HAS_FETCHED_ALL_OFFERS:
      return Immutable.merge(state, {
        loading: false,
        error: false,
        all: action.offers,
      });

    case actionTypes.START_FETCH_ALL_OFFERS:
      return Immutable.merge(state, { loading: true, error: false });

    case actionTypes.ERROR_FETCHING_ALL_OFFERS:
      return Immutable.merge(state, {
        loading: false,
        error: true,
        errorMsg: action.error,
      });

    default:
      return state;
  }
}
