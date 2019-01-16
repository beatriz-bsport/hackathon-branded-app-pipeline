import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';
import { byOfferByMember } from '../actions/consumer-payment-pack.actions';

const initialState = Immutable({
  byOfferByMember: [],
  loading: false,
  error: false,
});

export default handleActions(
  {
    [byOfferByMember.isLoading]: (state, { payload }) => {
      return state.set(['loading'], payload);
    },
    [byOfferByMember.error]: (state, { payload }) => {
      return state.set(['error'], payload);
    },
    [byOfferByMember.success]: (state, { payload }) => {
      return state.set(['byOfferByMember'], payload);
    },
  },
  initialState,
);
