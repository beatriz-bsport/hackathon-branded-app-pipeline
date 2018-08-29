import Immutable from 'seamless-immutable';

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
