import Immutable from 'seamless-immutable';

import actionTypes from '../actions/transaction.types';

const initialState = Immutable({
  all: [],
  loading: true,
});

export default function transactionReducers(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.HAS_FETCHED_TRANSACTIONS:
      return Immutable.merge(state, {
        loading: false,
        error: false,
        all: action.transactions,
      });

    case actionTypes.START_FETCH_TRANSACTIONS:
      return Immutable.merge(state, { loading: true, error: false });

    case actionTypes.ERROR_FETCHING_TRANSACTIONS:
      return Immutable.merge(state, {
        loading: false,
        error: true,
        errorMsg: action.error,
      });

    default:
      return state;
  }
}
