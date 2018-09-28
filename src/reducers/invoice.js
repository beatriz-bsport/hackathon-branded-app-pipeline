import Immutable from 'seamless-immutable';

import actionTypes from '../actions/invoice.types';

const initialState = Immutable({
  all: [],
  loading: true,
});

export default function invoiceReducers(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.HAS_FETCHED_INVOICES:
      return Immutable.merge(state, {
        loading: false,
        error: false,
        all: action.invoices,
      });

    case actionTypes.START_FETCH_INVOICES:
      return Immutable.merge(state, { loading: true, error: false });

    case actionTypes.ERROR_FETCHING_INVOICES:
      return Immutable.merge(state, {
        loading: false,
        error: true,
        errorMsg: action.error,
      });

    default:
      return state;
  }
}
