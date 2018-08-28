import Immutable from 'seamless-immutable';

import actionTypes from '../actions/consumer.types';

const initialState = Immutable({
  loading: false,
  bookings: [],
  options: [],
  paymentPacks: [],
});

export default function consumerReducers(state = initialState, action = {}) {
  switch (action.type) {
    default:
      return state;
  }
}
