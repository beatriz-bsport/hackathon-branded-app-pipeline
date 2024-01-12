import moment from 'moment-timezone';
import { createAction } from 'redux-actions';
import { AxiosResponse } from 'axios';

import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';
import api from './api';
import { RootState } from '../../reducers';
import {
  cancelBookingV2 as cancelBookingV2API,
  fetchBookingListV2 as fetchBookingListAPI,
} from '../booking/api';
import { fetchPrivateBookings } from '../private-service/api';

import type {
  Dispatch,
  OptionCallback,
  ThunkAction,
  PaginatedResponse,
} from '../../state/types';
import type { PrivateBooking } from '../private-service/types';
import type { ConsumerPaymentPack } from '../consumer-payment-pack/types';
import type { BookingOrPrivateBooking, Profile } from './types';
import type {
  Booking,
  BookingOption,
  BookingREST,
  CancelBookingFilterParams,
} from '#libs/booking/types';

export const actionsType = {
  CONSUMER_HAS_FETCHED_OPTIONS: 'CONSUMER_HAS_FETCHED_OPTIONS_SUCCESS',
  CONSUMER_START_FETCH_OPTIONS: 'CONSUMER_START_FETCH_OPTIONS',
  CONSUMER_FETCH_BOOKING_ERROR: 'CONSUMER_FETCH_BOOKING_ERROR',
  CONSUMER_ERROR_FETCHING_OPTIONS: 'CONSUMER_ERROR_FETCHING_OPTIONS_ERROR',
  CONSUMER_HAS_FETCHED_BOOKINGS: 'CONSUMER_HAS_FETCHED_BOOKINGS_SUCCESS',
  CONSUMER_START_FETCH_BOOKINGS: 'CONSUMER_START_FETCH_BOOKINGS',
  CONSUMER_ERROR_FETCHING_BOOKINGS: 'CONSUMER_ERROR_FETCHING_BOOKINGS_ERROR',
  CONSUMER_START_FETCH_PAYMENT_PACKS: 'CONSUMER_START_FETCH_PAYMENT_PACKS',
  CONSUMER_ERROR_FETCHING_PAYMENT_PACKS:
    'CONSUMER_ERROR_FETCHING_PAYMENT_PACKS_ERROR',
  CONSUMER_HAS_FETCHED_PAYMENT_PACKS:
    'CONSUMER_HAS_FETCHED_PAYMENT_PACKS_SUCCESS',
  CONSUMER_CANCELLING_BOOKING_OPTION: 'CONSUMER_CANCELLING_BOOKING_OPTION',
  CONSUMER_ERROR_CANCELLING_BOOKING_OPTION:
    'CONSUMER_ERROR_CANCELLING_BOOKING_OPTION_ERROR',
  CONSUMER_BOOKING_OPTION_CANCELLED: 'CONSUMER_BOOKING_OPTION_CANCELLED',
  CONSUMER_HAS_FETCHED_PROFILE: 'CONSUMER_HAS_FETCHED_PROFILE_SUCCESS',
  CONSUMER_START_FETCH_PROFILE: 'CONSUMER_START_FETCH_PROFILE',
  CONSUMER_ERROR_FETCHING_PROFILE: 'CONSUMER_ERROR_FETCHING_PROFILE_ERROR',

  CONSUMER_BOOKING_DISCARD_START: 'CONSUMER_BOOKING_DISCARD_START',
  CONSUMER_BOOKING_DISCARD_SUCCESS: 'CONSUMER_BOOKING_DISCARD_SUCCESS',
  CONSUMER_BOOKING_DISCARD_ERROR: 'CONSUMER_BOOKING_DISCARD_ERROR',

  CONSUMER_BOOKING_AND_PRIVATE_BOOKING_SUCCESS:
    'CONSUMER_BOOKING_AND_PRIVATE_BOOKING_SUCCESS',
  CONSUMER_BOOKING_AND_PRIVATE_BOOKING_ERROR:
    'CONSUMER_BOOKING_AND_PRIVATE_BOOKING_ERROR',
  CONSUMER_BOOKING_AND_PRIVATE_BOOKING_LOADING:
    'CONSUMER_BOOKING_AND_PRIVATE_BOOKING_LOADING',
  CONSUMER_BOOKING_AND_PRIVATE_BOOKING_RESET:
    'CONSUMER_BOOKING_AND_PRIVATE_BOOKING_RESET',
};

export function startFetchBookings() {
  return { type: actionsType.CONSUMER_START_FETCH_BOOKINGS };
}

export function errorFetchingBookings() {
  return { type: actionsType.CONSUMER_ERROR_FETCHING_BOOKINGS };
}

export function fetchBookingError(error?: Error) {
  return { type: actionsType.CONSUMER_FETCH_BOOKING_ERROR, error };
}

export function fetchedBookings({
  futureBookings,
  pastBookings,
}: {
  futureBookings: Array<Booking>;
  pastBookings: Array<Booking>;
}) {
  return {
    type: actionsType.CONSUMER_HAS_FETCHED_BOOKINGS,
    futureBookings,
    pastBookings,
  };
}

export function fetchBookings() {
  return async (dispatch: Dispatch) => {
    dispatch(startFetchBookings());
    dispatch(fetchBookingError(null));

    try {
      const response = await api.fetchFutureBookings();
      // @ts-expect-error
      const futureBookings = response.data.results;

      const response_ = await api.fetchPastBookings();
      // @ts-expect-error
      const pastBookings = response_.data.results;
      dispatch(fetchedBookings({ futureBookings, pastBookings }));
    } catch (err) {
      console.error(err);
      dispatch(fetchBookingError(err));
    }
  };
}

export function startFetchOptions() {
  return { type: actionsType.CONSUMER_START_FETCH_OPTIONS };
}

export function errorFetchingOptions(error?: Error) {
  return { type: actionsType.CONSUMER_ERROR_FETCHING_OPTIONS, error };
}

export function fetchedOptions(bookingOptions: Array<BookingOption>) {
  return { type: actionsType.CONSUMER_HAS_FETCHED_OPTIONS, bookingOptions };
}

export function fetchOptions() {
  return async (dispatch: Dispatch) => {
    dispatch(startFetchOptions());
    dispatch(errorFetchingOptions(null));

    try {
      const response = await api.fetchOptions();
      const bookingOptions = response.data;

      // @ts-expect-error
      dispatch(fetchedOptions(bookingOptions));
    } catch (err) {
      dispatch(errorFetchingOptions(err));
    }
  };
}

export function startCancellingOption(optionId: number) {
  return { type: actionsType.CONSUMER_CANCELLING_BOOKING_OPTION, optionId };
}

export function optionCancelled(optionId: number) {
  return { type: actionsType.CONSUMER_BOOKING_OPTION_CANCELLED, optionId };
}

export function errorCancellingOption(error?: Error) {
  return { type: actionsType.CONSUMER_ERROR_CANCELLING_BOOKING_OPTION, error };
}

export function cancelBookingOption(optionId: number) {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    if (getState().consumer.optionCurrentlyCancelling !== null) {
      return;
    }
    dispatch(startCancellingOption(optionId));
    dispatch(errorCancellingOption(null));

    try {
      await api.discardBookingOption(optionId);
      dispatch(optionCancelled(optionId));
    } catch (err) {
      console.error(err);
      dispatch(errorCancellingOption(err));
    }
  };
}

export function startFetchConsumerPaymentPacks() {
  return { type: actionsType.CONSUMER_START_FETCH_PAYMENT_PACKS };
}

export function errorFetchingConsumerPaymentPacks(error?: Error) {
  return { type: actionsType.CONSUMER_ERROR_FETCHING_PAYMENT_PACKS, error };
}

export function fetchedConsumerPaymentPacks(
  consumerPaymentPacks: Array<ConsumerPaymentPack>,
) {
  return {
    type: actionsType.CONSUMER_HAS_FETCHED_PAYMENT_PACKS,
    consumerPaymentPacks,
  };
}

export function fetchConsumerPaymentPacks() {
  return async (dispatch: Dispatch) => {
    dispatch(startFetchConsumerPaymentPacks());
    dispatch(errorFetchingConsumerPaymentPacks(null));

    try {
      const response = await api.fetchConsumerPaymentPacks();
      const consumerPaymentPacks = response.data;

      // @ts-expect-error
      dispatch(fetchedConsumerPaymentPacks(consumerPaymentPacks));
    } catch (err) {
      dispatch(errorFetchingConsumerPaymentPacks(err));
    }
  };
}

export function startFetchProfile() {
  return { type: actionsType.CONSUMER_START_FETCH_PROFILE };
}

export function errorFetchingProfile(error?: Error) {
  return { type: actionsType.CONSUMER_ERROR_FETCHING_PROFILE, error };
}

export function fetchedProfile(profile: Profile) {
  return {
    type: actionsType.CONSUMER_HAS_FETCHED_PROFILE,
    profile,
  };
}

export function fetchProfile(options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(startFetchProfile());
    dispatch(errorFetchingProfile(null));

    try {
      const response = await api.fetchProfile();
      const profile = response.data;
      // @ts-expect-error
      dispatch(fetchedProfile(profile));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(profile);
    } catch (err) {
      dispatch(errorFetchingProfile(err));
      if (options && options.onError) options.onError(err);
    }
  };
}

export function discardBookingStart(bookingId: number) {
  return { type: actionsType.CONSUMER_BOOKING_DISCARD_START, bookingId };
}

export function discardBookingSuccess(bookingId: number) {
  return { type: actionsType.CONSUMER_BOOKING_DISCARD_SUCCESS, bookingId };
}

export function discardBookingError(error?: Error) {
  return { type: actionsType.CONSUMER_BOOKING_DISCARD_ERROR, error };
}

export function discardBooking(bookingId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(discardBookingStart(bookingId));
    dispatch(discardBookingError(null));

    try {
      await api.discardBooking(bookingId);
      dispatch(discardBookingSuccess(bookingId));
    } catch (err) {
      console.error(err);
      dispatch(discardBookingError(err));
    }
  };
}

const sortBookingAndPrivateBookingList = (arr: BookingOrPrivateBooking[]) => {
  return [...arr].sort((a, b) => {
    let dateA = '';
    let dateB = '';

    if (a.type === 'booking' && a.booking) {
      dateA = a.booking.offer_date_start;
    }
    if (a.type === 'privateBooking' && a.privateBooking) {
      dateA = a.privateBooking.date_start;
    }
    if (b.type === 'booking' && b.booking) {
      dateB = b.booking.offer_date_start;
    }
    if (b.type === 'privateBooking' && b.privateBooking) {
      dateB = b.privateBooking.date_start;
    }

    // @ts-ignore
    return moment(dateA).format('x') - moment(dateB).format('x');
  });
};

const consumerBookingAndPrivateBookingSuccess = (payload: any) => {
  return {
    type: actionsType.CONSUMER_BOOKING_AND_PRIVATE_BOOKING_SUCCESS,
    payload,
  };
};

const consumerBookingAndPrivateBookingLoading = (payload: any) => {
  return {
    type: actionsType.CONSUMER_BOOKING_AND_PRIVATE_BOOKING_LOADING,
    payload,
  };
};

const consumerBookingAndPrivateBookingError = (payload: any) => {
  return {
    type: actionsType.CONSUMER_BOOKING_AND_PRIVATE_BOOKING_ERROR,
    payload,
  };
};

const consumerBookingAndPrivateBookingReset = () => {
  return {
    type: actionsType.CONSUMER_BOOKING_AND_PRIVATE_BOOKING_RESET,
  };
};

export enum BookingsAndPrivateBookingsTypeEnum {
  future,
  past,
  beforeDateEnd,
}

export function fetchBookingsAndPrivateBookings(args: {
  member: number;
  date_start: string;
  page?: number;
  options?: OptionCallback<BookingOrPrivateBooking[]>;
  type?: BookingsAndPrivateBookingsTypeEnum;
}): ThunkAction {
  return async (dispatch: Dispatch, getState) => {
    args.page === 1 && dispatch(consumerBookingAndPrivateBookingReset());
    dispatch(consumerBookingAndPrivateBookingLoading(true));

    try {
      const { bookingAndPrivateBooking } = getState().consumer;
      const pageSize = 10;

      const bookingPage =
        args.page || bookingAndPrivateBooking.booking.next_page;
      const privateBookingPage =
        args.page || bookingAndPrivateBooking.privateBooking.next_page;

      let bookingRest = bookingAndPrivateBooking.booking.rest;
      let privateBookingRest = bookingAndPrivateBooking.privateBooking.rest;

      let bookingResults: Booking[] = [];
      let privateBookingResults: PrivateBooking[] = [];
      let bookingNextPage = bookingPage;
      let privateBookingNextPage = privateBookingPage;

      const promises: Promise<null | any>[] = [];

      if (
        bookingRest.length < pageSize &&
        bookingAndPrivateBooking.booking.next_page
      ) {
        const params: any = {
          member: args.member,
          page: bookingPage,
          page_size: pageSize,
          mine: true,
          booking_status_code: BOOKING_STATUS_OK.id,
          ordering: 'offer__date_start',
        };
        if (args.date_start) params.min_date = args.date_start;

        if (args.type === BookingsAndPrivateBookingsTypeEnum.past) {
          delete params.min_date;
          params.max_date = args.date_start;
          params.ordering = '-offer__date_start';
        }

        if (args.type === BookingsAndPrivateBookingsTypeEnum.beforeDateEnd) {
          delete params.min_date;
          params.before_date_end = true;
        }

        const promise = fetchBookingListAPI(params);
        promises.push(promise);
      } else {
        promises.push(new Promise((resolve) => resolve(null)));
      }

      if (
        privateBookingRest.length < pageSize &&
        bookingAndPrivateBooking.privateBooking.next_page
      ) {
        const params: any = {
          member: args.member,
          booking_status_code: BOOKING_STATUS_OK.id,
          page: privateBookingPage,
          page_size: pageSize,
          ordering: 'date_start', // -date_start
        };
        if (args.date_start) params.date_start__gte = args.date_start;

        if (args.type === BookingsAndPrivateBookingsTypeEnum.past) {
          delete params.date_start__gte;
          params.date_start__lte = args.date_start;
          params.ordering = '-date_start';
        }

        if (args.type === BookingsAndPrivateBookingsTypeEnum.beforeDateEnd) {
          delete params.date_start__gte;
          params.before_date_end = true;
        }

        const promise = fetchPrivateBookings(params);
        promises.push(promise);
      } else {
        promises.push(new Promise((resolve) => resolve(null)));
      }

      const [bookingResponse, privateBookingResponse] = await Promise.all(
        promises,
      );

      if (bookingResponse) {
        bookingResults = bookingResponse.data.results;
        bookingNextPage = bookingResponse.data.next_page;
      }
      if (privateBookingResponse) {
        privateBookingResults = privateBookingResponse.data.results;
        privateBookingNextPage = privateBookingResponse.data.next_page;
      }

      let count: null | number = null;

      if (args.page === 1 && bookingResponse && privateBookingResponse) {
        count = bookingResponse.data.count + privateBookingResponse.data.count;
      }

      bookingResults = [...bookingResults, ...bookingRest];
      privateBookingResults = [...privateBookingResults, ...privateBookingRest];

      // @ts-ignore
      const all: BookingOrPrivateBooking[] = [
        ...bookingResults.map((booking) => ({
          type: 'booking',
          booking,
        })),
        ...privateBookingResults.map((privateBooking) => ({
          type: 'privateBooking',
          privateBooking,
        })),
      ];

      let sortedByDateAll = sortBookingAndPrivateBookingList(all);

      if (args.type === BookingsAndPrivateBookingsTypeEnum.past) {
        sortedByDateAll = sortedByDateAll.reverse();
      }

      const sortedByDatePaged = sortedByDateAll.splice(0, pageSize);

      bookingRest = [];
      privateBookingRest = [];

      sortedByDateAll.forEach((bookingObj) => {
        bookingObj.booking && bookingRest.push(bookingObj.booking);
        bookingObj.privateBooking &&
          privateBookingRest.push(bookingObj.privateBooking);
      });

      const allObj = sortedByDatePaged.map((bookingObj) => {
        return {
          type: bookingObj.type,
          [bookingObj.type]: bookingObj[bookingObj.type].id,
        };
      });

      const hasMore =
        bookingNextPage !== null ||
        privateBookingNextPage !== null ||
        bookingRest.length ||
        privateBookingRest.length;

      const payload = {
        booking: {
          rest: bookingRest,
          results: bookingResults,
          next_page: bookingNextPage,
        },
        privateBooking: {
          rest: privateBookingRest,
          results: privateBookingResults,
          next_page: privateBookingNextPage,
        },
        count,
        allObj,
        hasMore,
      };

      await dispatch(consumerBookingAndPrivateBookingSuccess(payload));
      if (args.options && args.options.onSuccess) {
        // @ts-expect-error
        args.options.onSuccess(payload);
      }
    } catch (err) {
      console.error(err);
      dispatch(consumerBookingAndPrivateBookingError(err));
    }

    dispatch(consumerBookingAndPrivateBookingLoading(false));
  };
}

export const fetchMyPastBookingAsMemberActions = {
  success: createAction<AxiosResponse<PaginatedResponse<BookingREST>>>(
    'BOOKING/PAST/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>('BOOKING/PAST/AS_MEMBER/IS_LOADING'),
  error: createAction<Error | null>('BOOKING/PAST/AS_MEMBER/ERROR'),
};

export function fetchMyPastBookingAsMember(
  // TODO : For franchise we must remove member and add franchise params in back-end
  {
    member,
    page_size = 30,
  }: {
    member: number;
    page_size?: number;
  },
  options?: OptionCallback<BookingREST[]>,
): ThunkAction {
  return async (dispatch: Dispatch, getState) => {
    dispatch(fetchMyPastBookingAsMemberActions.isLoading(true));
    dispatch(fetchMyPastBookingAsMemberActions.error(null));

    const currentState = getState().consumerReworked.myBookings.bookings.past;
    const nextPage = currentState.next_page ?? 1;
    try {
      const response = await fetchBookingListAPI({
        // TODO : For franchise we must remove member and add franchise params in back-end
        member,
        page: nextPage,
        page_size,
        mine: true,
        past_booking: true,
        offer_is_workshop: false,
      });
      dispatch(fetchMyPastBookingAsMemberActions.success(response));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      dispatch(fetchMyPastBookingAsMemberActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(fetchMyPastBookingAsMemberActions.isLoading(false));
  };
}

export const fetchMyFutureBookingAsMemberActions = {
  success: createAction<AxiosResponse<PaginatedResponse<BookingREST>>>(
    'BOOKING/FUTURE/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>('BOOKING/FUTURE/AS_MEMBER/IS_LOADING'),
  error: createAction<Error | null>('BOOKING/FUTURE/AS_MEMBER/ERROR'),
};

export function fetchMyFutureBookingAsMember(
  // TODO : For franchise we must remove member and add franchise params in back-end
  {
    member,
    page_size = 30,
  }: {
    member: number;
    page_size?: number;
  },
  options?: OptionCallback<BookingREST[]>,
): ThunkAction {
  return async (dispatch: Dispatch, getState) => {
    dispatch(fetchMyFutureBookingAsMemberActions.isLoading(true));
    dispatch(fetchMyFutureBookingAsMemberActions.error(null));

    const currentState = getState().consumerReworked.myBookings.bookings.future;
    const nextPage = currentState.next_page ?? 1;
    try {
      const response = await fetchBookingListAPI({
        // TODO : For franchise we must remove member and add franchise params in back-end
        member,
        page: nextPage,
        page_size,
        mine: true,
        future_booking: true,
        offer_is_workshop: false,
      });
      dispatch(fetchMyFutureBookingAsMemberActions.success(response));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      dispatch(fetchMyFutureBookingAsMemberActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(fetchMyFutureBookingAsMemberActions.isLoading(false));
  };
}

export const fetchMyPastBookingWorkshopAsMemberActions = {
  success: createAction<AxiosResponse<PaginatedResponse<BookingREST>>>(
    'WORKSHOP/PAST/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>('WORKSHOP/PAST/AS_MEMBER/IS_LOADING'),
  error: createAction<Error | null>('WORKSHOP/PAST/AS_MEMBER/ERROR'),
};

export function fetchMyPastBookingWorkshopAsMember(
  // TODO : For franchise we must remove member and add franchise params in back-end
  {
    member,
    page_size = 30,
  }: {
    member: number;
    page_size?: number;
  },
  options?: OptionCallback<BookingREST[]>,
): ThunkAction {
  return async (dispatch: Dispatch, getState) => {
    dispatch(fetchMyPastBookingWorkshopAsMemberActions.isLoading(true));
    dispatch(fetchMyPastBookingWorkshopAsMemberActions.error(null));

    const currentState =
      getState().consumerReworked.myBookings.bookingsWorkshop.past;
    const nextPage = currentState.next_page ?? 1;
    try {
      const response = await fetchBookingListAPI({
        // TODO : For franchise we must remove member and add franchise params in back-end
        member,
        page: nextPage,
        page_size,
        mine: true,
        past_booking: true,
        offer_is_workshop: true,
      });
      dispatch(fetchMyPastBookingWorkshopAsMemberActions.success(response));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      dispatch(fetchMyPastBookingWorkshopAsMemberActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(fetchMyPastBookingWorkshopAsMemberActions.isLoading(false));
  };
}

export const fetchMyFutureBookingWorkshopAsMemberActions = {
  success: createAction<AxiosResponse<PaginatedResponse<BookingREST>>>(
    'WORKSHOP/FUTURE/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>('WORKSHOP/FUTURE/AS_MEMBER/IS_LOADING'),
  error: createAction<Error | null>('WORKSHOP/FUTURE/AS_MEMBER/ERROR'),
};

export function fetchMyFutureBookingWorkshopAsMember(
  // TODO : For franchise we must remove member and add franchise params in back-end
  {
    member,
    page_size = 30,
  }: {
    member: number;
    page_size?: number;
  },
  options?: OptionCallback<BookingREST[]>,
): ThunkAction {
  return async (dispatch: Dispatch, getState) => {
    dispatch(fetchMyFutureBookingWorkshopAsMemberActions.isLoading(true));
    dispatch(fetchMyFutureBookingWorkshopAsMemberActions.error(null));

    const currentState =
      getState().consumerReworked.myBookings.bookingsWorkshop.future;
    const nextPage = currentState.next_page ?? 1;
    try {
      const response = await fetchBookingListAPI({
        // TODO : For franchise we must remove member and add franchise params in back-end
        member,
        page: nextPage,
        page_size,
        mine: true,
        future_booking: true,
        offer_is_workshop: true,
      });
      dispatch(fetchMyFutureBookingWorkshopAsMemberActions.success(response));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      dispatch(fetchMyFutureBookingWorkshopAsMemberActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(fetchMyFutureBookingWorkshopAsMemberActions.isLoading(false));
  };
}

export const resetConsumerStateActions = {
  all: createAction('CONSUMER_STATE_REWORKED/RESET'),
};

export function resetConsumerState(): ThunkAction {
  return (dispatch: Dispatch) => {
    dispatch(resetConsumerStateActions.all());
  };
}

export const cancelBookingAsMemberActions = {
  success: createAction<AxiosResponse<BookingREST>>(
    'BOOKING/CANCEL/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>('BOOKING/CANCEL/AS_MEMBER/IS_LOADING'),
  error: createAction<Error | null>('BOOKING/CANCEL/AS_MEMBER/ERROR'),
};

export function cancelBookingAsMember(
  id: number,
  params: CancelBookingFilterParams,
  options?: OptionCallback<BookingREST>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(cancelBookingAsMemberActions.isLoading(true));
    dispatch(cancelBookingAsMemberActions.error(null));

    try {
      const response = await cancelBookingV2API(id, params);
      dispatch(cancelBookingAsMemberActions.success(response));

      options?.onSuccess?.(response.data);
    } catch (err) {
      dispatch(cancelBookingAsMemberActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(cancelBookingAsMemberActions.isLoading(false));
  };
}
