import Immutable from 'seamless-immutable';
import { actionsType } from './actions';
// @ts-ignore
import authActionTypes from '../../actions/auth.types';
import { ConsumerState } from './types';

const initialState: Immutable.Immutable<ConsumerState> =
  Immutable<ConsumerState>({
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
    bookingAndPrivateBooking: {
      booking: {
        byId: {},
        next_page: 1,
        rest: [],
      },
      privateBooking: {
        byId: {},
        next_page: 1,
        rest: [],
      },
      allObj: [],
      count: 0,
      loading: true,
      error: null,
      hasMore: true,
    },
  });

export default function consumerReducers(state = initialState, action: any) {
  switch (action.type) {
    case authActionTypes.DISCONNECT:
      return initialState;
    case actionsType.CONSUMER_HAS_FETCHED_PROFILE:
      return state.merge({ profile: action.profile });
    case actionsType.CONSUMER_CANCELLING_BOOKING_OPTION:
      return state.merge({
        optionCurrentlyCancelling: action.optionId,
      });
    case actionsType.CONSUMER_BOOKING_OPTION_CANCELLED:
      return state.merge({
        optionCurrentlyCancelling: null,
        bookingOptions: state.bookingOptions.filter(
          (bo) => bo.id !== action.optionId,
        ),
      });
    case actionsType.CONSUMER_ERROR_CANCELLING_BOOKING_OPTION:
      return state.merge({
        optionCurrentlyCancelling: null,
      });
    case actionsType.CONSUMER_HAS_FETCHED_BOOKINGS:
      return state.merge({
        bookingsLoading: false,
        error: false,
        futureBookings: action.futureBookings,
        pastBookings: action.pastBookings,
      });

    case actionsType.CONSUMER_START_FETCH_BOOKINGS:
      return state.set('bookingsLoading', true).set('error', false);

    case actionsType.CONSUMER_ERROR_FETCHING_BOOKINGS:
      return state.merge({
        bookingsLoading: false,
        error: true,
        errorMsg: action.error,
      });

    case actionsType.CONSUMER_HAS_FETCHED_OPTIONS:
      return state.merge({
        optionsLoading: false,
        error: false,
        bookingOptions: action.bookingOptions,
      });

    case actionsType.CONSUMER_START_FETCH_OPTIONS:
      return state.merge({ optionsLoading: true, error: false });

    case actionsType.CONSUMER_ERROR_FETCHING_OPTIONS:
      return state.merge({
        optionsLoading: false,
        error: true,
        errorMsg: action.error,
      });

    case actionsType.CONSUMER_HAS_FETCHED_PAYMENT_PACKS:
      return state.merge({
        paymentPacksLoading: false,
        error: false,
        consumerPaymentPacks: action.consumerPaymentPacks || [],
      });

    case actionsType.CONSUMER_START_FETCH_PAYMENT_PACKS:
      return state.merge({
        paymentPacksLoading: true,
        error: false,
      });

    case actionsType.CONSUMER_ERROR_FETCHING_PAYMENT_PACKS:
      return state.merge({
        paymentPacksLoading: false,
        error: true,
        errorMsg: action.error,
      });

    case actionsType.CONSUMER_BOOKING_DISCARD_SUCCESS:
      return state.merge({
        futureBookings: state.futureBookings.filter(
          (fb) => fb.id !== action.bookingId,
        ),
      });

    case actionsType.CONSUMER_BOOKING_AND_PRIVATE_BOOKING_RESET:
      return state.merge(
        {
          bookingAndPrivateBooking: {
            booking: {
              byId: {},
              next_page: 1,
              rest: [],
            },
            privateBooking: {
              byId: {},
              next_page: 1,
              rest: [],
            },
            allObj: [],
            loading: false,
            error: null,
            hasMore: true,
          },
        },
        { deep: true },
      );

    case actionsType.CONSUMER_BOOKING_AND_PRIVATE_BOOKING_LOADING:
      return state.setIn(
        ['bookingAndPrivateBooking', 'loading'],
        action.payload,
      );
    case actionsType.CONSUMER_BOOKING_AND_PRIVATE_BOOKING_ERROR:
      return state.setIn(['bookingAndPrivateBooking', 'error'], action.payload);
    case actionsType.CONSUMER_BOOKING_AND_PRIVATE_BOOKING_SUCCESS:
      return state
        .merge(
          {
            bookingAndPrivateBooking: {
              booking: {
                byId: action.payload.booking.results.reduce(
                  (acc: any, v: any) => {
                    acc[v.id] = v;
                    return acc;
                  },
                  {},
                ),
              },
              privateBooking: {
                byId: action.payload.privateBooking.results.reduce(
                  (acc: any, v: any) => {
                    acc[v.id] = v;
                    return acc;
                  },
                  {},
                ),
              },
            },
          },
          { deep: true },
        )
        .setIn(
          ['bookingAndPrivateBooking', 'booking', 'rest'],
          action.payload.booking.rest,
        )
        .setIn(
          ['bookingAndPrivateBooking', 'booking', 'next_page'],
          action.payload.booking.next_page,
        )
        .setIn(
          ['bookingAndPrivateBooking', 'privateBooking', 'rest'],
          action.payload.privateBooking.rest,
        )
        .setIn(
          ['bookingAndPrivateBooking', 'privateBooking', 'next_page'],
          action.payload.privateBooking.next_page,
        )
        .setIn(
          ['bookingAndPrivateBooking', 'allObj'],
          [
            ...state.bookingAndPrivateBooking.allObj.asMutable(),
            ...action.payload.allObj,
          ],
        )
        .setIn(['bookingAndPrivateBooking', 'hasMore'], action.payload.hasMore)
        .setIn(
          ['bookingAndPrivateBooking', 'count'],
          action.payload.count !== null
            ? action.payload.count
            : state.bookingAndPrivateBooking.count,
        );
    default:
      return state;
  }
}
