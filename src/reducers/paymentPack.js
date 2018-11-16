import Immutable from 'seamless-immutable';

import actionTypes from '../actions/paymentPack.types';
import authActionTypes from '../actions/auth.types';

const initialState = Immutable({
  all: [],
  updatingConsumerPacks: [],
  updatingPaymentPacks: [],
  loading: true,
  error: false,
  errorMsg: '',
});

export default function activityReducers(state = initialState, action = {}) {
  switch (action.type) {
    case authActionTypes.DISCONNECT:
      return initialState;

    case actionTypes.HAS_FETCHED_ALL_PAYMENT_PACKS:
      return Immutable.merge(state, {
        all: Array.from(action.paymentPacks),
        loading: false,
        error: false,
        updatingPaymentPacks: [],
        updatingConsumerPacks: [],
        createOrUpdatePending: false,
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

    case actionTypes.PAYMENT_PACK_PATCH_START:
      return Immutable.merge(state, {
        updatingPaymentPacks: [...state.updatingPaymentPacks, action.id],
      });

    case actionTypes.PAYMENT_PACK_PATCH_ERROR:
      return Immutable.merge(state, {
        updatingPaymentPacks: [
          ...state.updatingPaymentPacks.filter((id) => id !== action.id),
        ],
      });

    case actionTypes.PAYMENT_PACK_PATCH_SUCCESS: {
      const { paymentPack } = action;
      return Immutable.merge(state, {
        updatingPaymentPacks: [
          ...state.updatingPaymentPacks.filter((id) => id !== action.id),
        ],
        all: [
          paymentPack,
          ...state.all.filter((pp) => pp.id !== paymentPack.id),
        ],
      });
    }

    case actionTypes.PAYMENT_PACK_CREATEORUPDATE_START: {
      return Immutable.merge(state, { createOrUpdatePending: true });
    }
    case actionTypes.PAYMENT_PACK_CREATEORUPDATE_ERROR: {
      return Immutable.merge(state, { createOrUpdatePending: false });
    }
    case actionTypes.PAYMENT_PACK_CREATEORUPDATE_SUCCESS: {
      const { paymentPack } = action;
      const paymentPackArray = state.all.filter(
        (pp) => pp.id !== paymentPack.id,
      );
      return Immutable.merge(state, {
        all: [paymentPack, ...paymentPackArray],
        createOrUpdatePending: false,
      });
    }

    default:
      return state;
  }
}
