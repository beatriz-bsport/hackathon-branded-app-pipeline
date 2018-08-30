import Immutable from 'seamless-immutable';
import actionTypes from '../actions/consumer.types';

const initialState = Immutable({
  error: false,
  errorMsg: null,
  optionsLoading: false,
  bookingsLoading: false,
  paymentPacksLoading: false,
  futureBookings: [],
  pastBookings: [],
  bookingOptions: [],
  consumerPaymentPacks: [],
});

export default function consumerReducers(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.CONSUMER_HAS_FETCHED_BOOKINGS:
      return Immutable.merge(state, {
        bookingsloading: false,
        error: false,
        futureBookings: action.futureBookings,
        pastBookings: action.pastBookings,
      });

    case actionTypes.CONSUMER_START_FETCH_BOOKINGS:
      return Immutable.merge(state, { bookingsLoading: true, error: false });

    case actionTypes.CONSUMER_ERROR_FETCHING_BOOKINGS:
      return Immutable.merge(state, {
        bookingsLoading: false,
        error: true,
        errorMsg: action.error,
      });

    case actionTypes.CONSUMER_HAS_FETCHED_OPTIONS:
      return Immutable.merge(state, {
        optionsLoading: false,
        error: false,
        bookingOptions: action.bookingOptions,
      });

    case actionTypes.CONSUMER_START_FETCH_OPTIONS:
      return Immutable.merge(state, { optionsLoading: true, error: false });

    case actionTypes.CONSUMER_ERROR_FETCHING_OPTIONS:
      return Immutable.merge(state, {
        optionsLoading: false,
        error: true,
        errorMsg: action.error,
      });

    case actionTypes.CONSUMER_HAS_FETCHED_PAYMENT_PACKS:
      return Immutable.merge(state, {
        paymentPacksLoading: false,
        error: false,
        consumerPaymentPacks: action.consumerPaymentPacks,
      });

    case actionTypes.CONSUMER_START_FETCH_PAYMENT_PACKS:
      return Immutable.merge(state, {
        paymentPacksLoading: true,
        error: false,
      });

    case actionTypes.CONSUMER_ERROR_FETCHING_PAYMENT_PACKS:
      return Immutable.merge(state, {
        paymentPacksLoading: false,
        error: true,
        errorMsg: action.error,
      });
    default:
      return state;
  }
}
