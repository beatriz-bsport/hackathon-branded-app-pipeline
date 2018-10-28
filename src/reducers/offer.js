import Immutable from 'seamless-immutable';

import actionTypes from '../actions/offer.types';
import authActionTypes from '../actions/auth.types';

const initialState = Immutable({
  calendar: [],
  loading: true,
  error: false,
  errorMsg: '',
  compatiblePacks: [],
  compatiblePacksLoading: false,
});

export default function offerReducers(state = initialState, action = {}) {
  switch (action.type) {
    case authActionTypes.DISCONNECT:
      return initialState;

    case actionTypes.HAS_FETCHED_ALL_OFFERS:
      return Immutable.merge(state, {
        loading: false,
        error: false,
        calendar: action.offers,
      });

    case actionTypes.HAS_FETCHED_OFFER_COMPATIBLE_PACKS:
      return Immutable.merge(state, {
        compatiblePacksLoading: false,
        compatiblePacks: action.compatiblePacks,
      });

    case actionTypes.START_FETCH_OFFER_COMPATIBLE_PACKS:
      return Immutable.merge(state, {
        compatiblePacksLoading: true,
        compatiblePacks: [],
      });

    case actionTypes.ERROR_FETCHING_OFFER_COMPATIBLE_PACKS:
      return Immutable.merge(state, {
        compatiblePacksLoading: false,
        compatiblePacks: [],
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
