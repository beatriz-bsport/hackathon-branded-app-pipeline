import Immutable from 'seamless-immutable';

import actionTypes from '../actions/offer.types';
import authActionTypes from '../actions/auth.types';

const initialState = Immutable({
  calendar: [],
  offers: [],
  loading: true,
  error: false,
  errorMsg: '',
  compatiblePacks: [],
  compatiblePacksLoading: false,
});

const REFRESHED_INTERVAL = 60 * 60 * 24 * 5;

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

    case actionTypes.START_FETCH_DETAILED_OFFERS: {
      const { offers } = state;
      return Immutable.merge(state, {
        offers: offers.filter(
          (o) => o.refreshed_on - new Date() / 1000 < REFRESHED_INTERVAL,
        ),
      });
    }
    case actionTypes.HAS_FETCHED_DETAILED_OFFERS: {
      const { offers } = action;
      const oldOffers = state.offers.filter(
        (old_o) => !offers.find((new_o) => new_o.id === old_o.id),
      );
      return Immutable.merge(state, {
        offers: [
          ...oldOffers,
          ...offers.map((o) => ({ ...o, refreshed_on: new Date() / 1000 })),
        ],
      });
    }

    default:
      return state;
  }
}
