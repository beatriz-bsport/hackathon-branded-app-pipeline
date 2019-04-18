import Immutable from 'seamless-immutable';

import actionTypes from '../actions/marketplace.types';

const initialState = Immutable({
  detailedOffers: [],
  detaildOffersLoading: false,
  offers: [],
  paymentPacks: [],
  loading: true,
  companyLoading: false,
  refreshing: false,
  company: null,
});

export default function marketplaceReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.MARKETPLACE_COMPANY_FETCH_SUCCESS:
      return Immutable.merge(state, {
        company: action.company,
        companyLoading: false,
      });

    case actionTypes.MARKETPLACE_COMPANY_FETCH_START:
      return Immutable.merge(state, {
        companyLoading: true,
      });
    case actionTypes.MARKETPLACE_COMPANY_FETCH_ERROR:
      return Immutable.merge(state, {
        company: null,
        companyLoading: false,
      });

    case actionTypes.MARKETPLACE_CALENDAR_FETCH_SUCCESS:
      return Immutable.merge(state, {
        loading: false,
        refreshing: false,
        offers: action.offers,
      });

    case actionTypes.MARKETPLACE_CALENDAR_FETCH_START:
      if (
        state.company &&
        state.company.id === parseInt(action.companyId, 10)
      ) {
        return Immutable.merge(state, { refreshing: true });
      }
      return Immutable.merge(state, { loading: true, offers: [] });

    case actionTypes.MARKETPLACE_CALENDAR_FETCH_ERROR:
      return Immutable.merge(state, {
        offers: [],
        loading: false,
        refreshing: false,
      });

    case actionTypes.MARKETPLACE_OFFERS_BY_DAY_FETCH_SUCCESS:
      return Immutable.merge(state, {
        detailedOffers: action.offers,
        detailedOffersLoading: false,
      });

    case actionTypes.MARKETPLACE_OFFERS_BY_DAY_FETCH_START:
      return Immutable.merge(state, {
        detailedOffers: [],
        detailedOffersLoading: true,
      });
    case actionTypes.MARKETPLACE_OFFERS_BY_DAY_FETCH_ERROR:
      return Immutable.merge(state, {
        detailedOffers: [],
        detailedOffersLoading: false,
      });

    case actionTypes.MARKETPLACE_PACKS_FETCH_SUCCESS:
      return Immutable.merge(state, {
        paymentPacks: action.paymentPacks,
      });

    case actionTypes.MARKETPLACE_PACKS_DAY_FETCH_ERROR:
    case actionTypes.MARKETPLACE_PACKS_FETCH_START:
      return Immutable.merge(state, {
        paymentPacks: [],
      });

    default:
      return state;
  }
}
