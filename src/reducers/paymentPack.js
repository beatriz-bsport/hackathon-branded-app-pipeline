import Immutable from 'seamless-immutable';

import actionTypes from '../actions/paymentPack.types';

const initialState = Immutable({
  all: [],
  updatingConsumerPacks: [],
  loading: true,
  error: false,
  errorMsg: '',
});

export default function activityReducers(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.HAS_FETCHED_ALL_PAYMENT_PACKS:
      return Immutable.merge(state, {
        all: Array.from(action.paymentPacks),
        loading: false,
        error: false,
      });

    case actionTypes.START_FETCH_ALL_PAYMENT_PACKS:
      return Immutable.merge(state, { loading: true, error: false });

    case actionTypes.ERROR_FETCHING_ALL_PAYMENT_PACKS:
      return Immutable.merge(state, {
        loading: false,
        error: true,
        errorMsg: action.err,
      });

    case actionTypes.UPDATING_CONSUMER_PACK_CREDIT: {
      const updatingConsumerPacks = [
        ...state.updatingConsumerPacks,
        action.consumerPackId,
      ];
      return Immutable.merge(state, { updatingConsumerPacks });
    }
    case actionTypes.UPDATE_CONSUMER_PACK_CREDIT_FAILED:
    case actionTypes.UPDATE_CONSUMER_PACK_CREDIT_DONE: {
      return Immutable.merge(state, {
        updatingConsumerPacks: state.updatingConsumerPacks.filter(
          (id) => id !== action.consumerPackId,
        ),
      });
    }

    default:
      return state;
  }
}
