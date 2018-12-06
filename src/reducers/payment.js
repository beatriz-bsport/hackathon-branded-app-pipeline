import Immutable from 'seamless-immutable';

import actionTypes from '../actions/payment.types';

const initialState = Immutable({
  loading: false,
  wantedOffer: null,
  wantedPaymentPack: null,
  compatibleConsumerPacks: [],
  compatibleConsumerPacksLoading: false,
  compatiblePaymentPacksLoading: false,
  bookings: [],
  options: [],
  paymentPacks: [],
});

export default function paymentReducers(state = initialState, action = {}) {
  switch (action.type) {
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

    case actionTypes.PAYMENT_HAS_FETCHED_COMPATIBLE_PASS:
      return Immutable.merge(state, {
        compatibleConsumerPacks: action.consumerPacks,
        compatibleConsumerPacksLoading: false,
      });
    case actionTypes.PAYMENT_ERROR_FETCHING_COMPATIBLE_PASS:
      return Immutable.merge(state, {
        compatibleConsumerPacks: [],
        compatibleConsumerPacksLoading: false,
      });
    case actionTypes.PAYMENT_START_FETCH_COMPATIBLE_PASS:
      return Immutable.merge(state, { compatibleConsumerPacksLoading: true });

    case actionTypes.PAYMENT_HAS_FETCHED_COMPATIBLE_PAYMENT_PACKS:
      return Immutable.merge(state, {
        compatiblePaymentPacks: action.paymentPacks,
        compatiblePaymentPacksLoading: false,
      });
    case actionTypes.PAYMENT_ERROR_FETCHING_COMPATIBLE_PAYMENT_PACKS:
      return Immutable.merge(state, {
        compatiblePaymentPacks: [],
        compatiblePaymentPacksLoading: false,
      });
    case actionTypes.PAYMENT_START_FETCH_COMPATIBLE_PAYMENT_PACKS:
      return Immutable.merge(state, { compatiblePaymentPacksLoading: true });

    default:
      return state;
  }
}
