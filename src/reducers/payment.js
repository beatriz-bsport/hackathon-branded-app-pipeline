import Immutable from 'seamless-immutable';

import actionTypes from '../actions/payment.types';

const initialState = Immutable({
  loading: false,
  wantedOffer: null,
  wantedPaymentPack: null,
  wantedShopItem: null,

  compatibleConsumerPacks: [],
  compatiblePaymentPacks: [],

  compatibleConsumerPacksLoading: false,
  compatiblePaymentPacksLoading: false,
  bookings: [],
  options: [],
  bookingOption: { hasOne: false, data: null, loading: false, error: null },
  paymentPacks: [],
});

export default function paymentReducers(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.PAYMENT_HAS_CHECKED_OPTION_EXISTENCE:
      return state.setIn(['bookingOption', 'hasOne'], action.exists);

    case actionTypes.PAYMENT_HAS_FETCHED_OPTION:
      return state.set('bookingOption', {
        loading: false,
        error: null,
        data: action.option,
      });
    case actionTypes.PAYMENT_START_FETCH_OPTION:
      return state.set('bookingOption', {
        loading: true,
        error: null,
        data: null,
      });
    case actionTypes.PAYMENT_ERROR_FETCHING_OPTION: {
      if (action.err) {
        return state.set('bookingOption', {
          loading: false,
          error: action.err,
          data: null,
        });
      }
      return state.set('bookingOption', {
        error: null,
      });
    }
    case actionTypes.PAYMENT_HAS_FETCHED_OFFER:
      return Immutable.merge(state, {
        wantedOffer: action.offer,
        loading: false,
      });
    case actionTypes.PAYMENT_ERROR_FETCHING_OFFER:
      return Immutable.merge(state, { wantedOffer: null, loading: false });
    case actionTypes.PAYMENT_START_FETCH_OFFER:
      return Immutable.merge(state, { loading: true });

    case actionTypes.PAYMENT_ERROR_FETCHING_PAYMENT_PACK:
      return Immutable.merge(state, {
        wantedPaymentPack: null,
        loading: false,
      });
    case actionTypes.PAYMENT_START_FETCH_PAYMENT_PACK:
      return Immutable.merge(state, { loading: true });
    case actionTypes.PAYMENT_HAS_FETCHED_PAYMENT_PACK:
      return Immutable.merge(state, {
        wantedPaymentPack: action.paymentPack,
        loading: false,
      });

    case actionTypes.PAYMENT_ERROR_FETCHING_SHOP_ITEM:
      return Immutable.merge(state, {
        wantedShopItem: null,
        loading: false,
      });
    case actionTypes.PAYMENT_START_FETCH_SHOP_ITEM:
      return Immutable.merge(state, { loading: true });
    case actionTypes.PAYMENT_HAS_FETCHED_SHOP_ITEM:
      return Immutable.merge(state, {
        wantedShopItem: action.shopItem,
        loading: false,
      });

    case actionTypes.PAYMENT_HAS_FETCHED_COMPATIBLE_PASS:
      return state
        .set('compatibleConsumerPacks', action.consumerPacks)
        .set('compatibleConsumerPacksLoading', false);

    case actionTypes.PAYMENT_ERROR_FETCHING_COMPATIBLE_PASS: {
      if (action.error) {
        return Immutable.merge(state, {
          compatibleConsumerPacks: [],
          compatibleConsumerPacksLoading: false,
        });
      }
      return Immutable.merge(state, {
        compatibleConsumerPacks: [],
      });
    }
    case actionTypes.PAYMENT_START_FETCH_COMPATIBLE_PASS:
      return state
        .set('compatibleConsumerPacksLoading', true)
        .set('compatiblePaymentPacks', []);

    case actionTypes.PAYMENT_HAS_FETCHED_COMPATIBLE_PAYMENT_PACKS:
      return Immutable.merge(state, {
        compatiblePaymentPacks: action.paymentPacks,
        compatiblePaymentPacksLoading: false,
      });
    case actionTypes.PAYMENT_ERROR_FETCHING_COMPATIBLE_PAYMENT_PACKS: {
      if (action.error) {
        return Immutable.merge(state, {
          compatiblePaymentPacks: [],
          compatiblePaymentPacksLoading: false,
        });
      }
      return Immutable.merge(state, {
        compatiblePaymentPacks: [],
      });
    }
    case actionTypes.PAYMENT_START_FETCH_COMPATIBLE_PAYMENT_PACKS:
      return state.set('compatiblePaymentPacksLoading', true);

    default:
      return state;
  }
}
