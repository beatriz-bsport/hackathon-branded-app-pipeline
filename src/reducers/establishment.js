import Immutable from 'seamless-immutable';

import actionTypes from '../actions/establishment.types';
import authActionTypes from '../actions/auth.types';

const initialState = Immutable({
  all: [],
  loading: true,
  error: false,
  errorMsg: '',
  // Create or Update
  createOrUpdatePending: false,
  createOrUpdateError: null,
  // Update
  updatedEstablishment: null,
});

export default function establishmentReducers(
  state = initialState,
  action = {},
) {
  switch (action.type) {
    case authActionTypes.DISCONNECT:
      return initialState;
    case actionTypes.HAS_FETCHED_ESTABLISHMENTS:
      return Immutable.merge(state, {
        loading: false,
        error: false,
        all: action.establishments,
      });

    case actionTypes.START_FETCH_ESTABLISHMENTS:
      return Immutable.merge(state, { loading: true, error: false });

    case actionTypes.ERROR_FETCHING_ESTABLISHMENTS:
      return Immutable.merge(state, {
        loading: false,
        error: true,
        errorMsg: action.error,
      });

    case actionTypes.ESTABLISHMENT_CREATE_OR_UPDATE:
      return state.merge({
        createOrUpdatePending: true,
      });

    case actionTypes.ESTABLISHMENT_CREATE_OR_UPDATE_SUCCESS:
      return state.merge({
        createOrUpdatePending: false,
      });

    case actionTypes.ESTABLISHMENT_CREATE_OR_UPDATE_ERROR:
      return state.merge({
        createOrUpdateError: action.error,
        createOrUpdatePending: false,
      });

    case actionTypes.ESTABLISHMENT_UPDATE:
      return state.merge({
        updated: action.establishment,
      });

    default:
      return state;
  }
}
