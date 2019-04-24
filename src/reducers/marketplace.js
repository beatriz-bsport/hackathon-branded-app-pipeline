import Immutable from 'seamless-immutable';

import actionTypes from '../actions/marketplace.types';

const initialState = Immutable({
  detailedOffers: [],
  detaildOffersLoading: false,
  offers: [],
  paymentPacks: [],
  paymentPacksLoading: false,
  loading: true,
  companyLoading: false,
  refreshing: false,
  company: null,
});

export default function marketplaceReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.MARKETPLACE_COMPANY_FETCH_SUCCESS:
      return state.set('company', action.company).set('companyLoading', false);

    case actionTypes.MARKETPLACE_COMPANY_FETCH_START:
      return state.set('companyLoading', true);
    case actionTypes.MARKETPLACE_COMPANY_FETCH_ERROR:
      return state.set('company', null).set('companyLoading', false);

    case actionTypes.MARKETPLACE_CALENDAR_FETCH_SUCCESS:
      return state
        .set('loading', false)
        .set('refreshing', false)
        .set('offers', action.offers);

    case actionTypes.MARKETPLACE_CALENDAR_FETCH_START:
      if (
        state.company &&
        state.company.id === parseInt(action.companyId, 10)
      ) {
        return state.set('refreshing', true);
      }
      return state.set('loading', true).set('offers', []);

    case actionTypes.MARKETPLACE_CALENDAR_FETCH_ERROR:
      return state
        .set('offers', [])
        .set('loading', false)
        .set('refreshing', false);

    case actionTypes.MARKETPLACE_OFFERS_BY_DAY_FETCH_SUCCESS:
      return state
        .set('detailedOffers', action.offers)
        .set('detailedOffersLoading', false);

    case actionTypes.MARKETPLACE_OFFERS_BY_DAY_FETCH_START:
      return state.set('detailedOffers', []).set('detailedOffersLoading', true);
    case actionTypes.MARKETPLACE_OFFERS_BY_DAY_FETCH_ERROR:
      return state
        .set('detailedOffers', [])
        .set('detailedOffersLoading', false);

    case actionTypes.MARKETPLACE_PACKS_FETCH_SUCCESS:
      return state
        .set('paymentPacks', action.paymentPacks)
        .set('paymentPacksLoading', false);

    case actionTypes.MARKETPLACE_PACKS_DAY_FETCH_ERROR:
      return state.set('paymentPacksLoading', false);
    case actionTypes.MARKETPLACE_PACKS_FETCH_START:
      return state.set('paymentPacks', [], 'paymentPacksLoading', true);

    default:
      return state;
  }
}
