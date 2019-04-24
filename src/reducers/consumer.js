import Immutable from 'seamless-immutable';
import actionTypes from '../actions/consumer.types';
import authActionTypes from '../actions/auth.types';

const initialState = Immutable({
  error: false,
  errorMsg: null,
  optionsLoading: false,
  optionCurrentlyCancelling: null,
  bookingsLoading: false,
  paymentPacksLoading: false,
  futureBookings: [],
  pastBookings: [],
  bookingOptions: [],
  consumerPaymentPacks: [],
  profile: null,
});

export default function consumerReducers(state = initialState, action = {}) {
  switch (action.type) {
    case authActionTypes.DISCONNECT:
      return initialState;
    case actionTypes.CONSUMER_HAS_FETCHED_PROFILE:
      return Immutable.merge(state, { profile: action.profile });
    case actionTypes.CONSUMER_CANCELLING_BOOKING_OPTION:
      return Immutable.merge(state, {
        optionCurrentlyCancelling: action.optionId,
      });
    case actionTypes.CONSUMER_BOOKING_OPTION_CANCELLED:
      return Immutable.merge(state, {
        optionCurrentlyCancelling: null,
        bookingOptions: state.bookingOptions.filter(
          (bo) => bo.id !== action.optionId,
        ),
      });
    case actionTypes.CONSUMER_ERROR_CANCELLING_BOOKING_OPTION:
      return Immutable.merge(state, {
        optionCurrentlyCancelling: null,
      });
    case actionTypes.CONSUMER_HAS_FETCHED_BOOKINGS:
      return Immutable.merge(state, {
        bookingsLoading: false,
        error: false,
        futureBookings: action.futureBookings,
        pastBookings: action.pastBookings,
      });

    case actionTypes.CONSUMER_START_FETCH_BOOKINGS:
      return state.set('bookingsLoading', true).set('error', false);

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
        consumerPaymentPacks: action.consumerPaymentPacks || [],
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

    case actionTypes.CONSUMER_BOOKING_DISCARD_SUCCESS:
      return Immutable.merge(state, {
        futureBookings: state.futureBookings.filter(
          (fb) => fb.id !== action.bookingId,
        ),
      });

    default:
      return state;
  }
}
