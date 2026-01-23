import { createAction } from 'redux-actions';
import type { RootState } from 'src/reducers';

import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code.js';
import uniq from 'lodash/uniq';
import { DateTime } from 'luxon';
import api, {
  fetchUniversalPasses as fetchUniversalPassesAPI,
  fetchMyPassesTabs as fetchMyPassesTabsAPI,
  fetchConsumerInvoices as fetchConsumerInvoicesAPI,
  fetchConsumerInvoicesComplementary as fetchConsumerInvoicesComplementaryAPI,
} from '#src/libs/consumer-space/api';
import {
  cancelBookingV2 as cancelBookingV2API,
  fetchBookingListV2 as fetchBookingListAPI,
} from '#src/libs/booking/api';
import {
  fetchPrivateBookings,
  fetchPrivateBookingsV2 as fetchPrivateBookingsV2API,
  disablePrivateBooking as disablePrivateBookingAPI,
  fetchPrivateConsumerPassList as fetchPrivateConsumerPassListAPI,
} from '#src/libs/private-service/api';
import {
  fetchFilteredBookingOptionsPaginated as fetchFilteredBookingOptionsPaginatedAPI,
  discardBookingOption as discardBookingOptionAPI,
} from '#src/libs/waiting-list/api';
import { fetchConsumerPackList as fetchConsumerPaymentPackListAPI } from '#src/libs/consumer-payment-pack/api';

import type {
  Dispatch,
  OptionCallback,
  ThunkAction,
  PaginatedResponse,
} from '#src/state/types';
import type {
  BookingOrPrivateBooking,
  ConsumerInvoiceParams,
  ConsumerPassesTabDisplay,
  Profile,
} from '#src/libs/consumer-space/types';
import type {
  PrivateBooking,
  PrivateBookingFilterParams,
  PrivateConsumerPassREST,
} from '#src/libs/private-service/types';
import type {
  ConsumerPaymentPack,
  ConsumerPaymentPackREST,
} from '#src/libs/consumer-payment-pack/types';
import type {
  Booking,
  BookingOption,
  BookingREST,
  CancelBookingParams,
  CancelPrivateBookingParams,
} from '#src/libs/booking/types';
import type {
  DiscardBookingOptionParams,
  WaitingListBookingOption,
  WaitingListBookingOptionPaginatedQueryParams,
} from '#src/libs/waiting-list/types';
import type { UniversalPassREST } from '#src/libs/universal-pass/types';
import type {
  ConsumerInvoiceComplementary,
  ConsumerInvoiceREST,
} from '#src/libs/invoice/types';

import {
  fetchBookingGuestNumberEligibleLeftByOfferBulk,
  fetchOfferWaitingListPositionList,
} from '#src/libs/offer/api';

import { CONSUMER_SPACE_API_PAGE_SIZE } from './constants';

import type { OfferStatusWaitingListPosition } from '#src/libs/offer/types';
import type { PaginationFilterParams } from '#src/libs/types';
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

    return (
      DateTime.fromISO(dateA).valueOf() - DateTime.fromISO(dateB).valueOf()
    );
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
  /**
   * For access monitoring purpose.
   * We want to fetch only today's next booking (ongoing or to come) until 2AM the next day
   * We also limit the page size to 1, since we only need the next booking
   * */
  todayNextBookingUntil2amOnly,
}

export function fetchBookingsAndPrivateBookings(args: {
  member: number;
  date_start?: string;
  only_future?: boolean;
  page?: number;
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
          booking_status_code: BOOKING_STATUS_OK.id,
          ordering: 'offer__date_start',
        };
        if (args.date_start) params.min_date = args.date_start;
        if (args.only_future) {
          params.future_booking = true;
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
        if (args.only_future) {
          params.strictly_future_booking = true;
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

      // @ts-expect-error
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
    } catch (err) {
      console.error(err);
      dispatch(consumerBookingAndPrivateBookingError(err));
    }

    dispatch(consumerBookingAndPrivateBookingLoading(false));
  };
}

export const fetchMyPastBookingAsMemberActions = {
  success: createAction<PaginatedResponse<BookingREST>>(
    'BOOKING/PAST/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>('BOOKING/PAST/AS_MEMBER/IS_LOADING'),
  error: createAction<Error | null>('BOOKING/PAST/AS_MEMBER/ERROR'),
};

export function fetchMyPastBookingAsMember(
  // TODO : For franchise we must remove member and add franchise params in back-end
  {
    page,
    member,
    page_size = CONSUMER_SPACE_API_PAGE_SIZE,
  }: PaginationFilterParams & {
    member: number;
  },
  options?: OptionCallback<PaginatedResponse<BookingREST>>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(fetchMyPastBookingAsMemberActions.isLoading(true));
    dispatch(fetchMyPastBookingAsMemberActions.error(null));
    try {
      const response = await fetchBookingListAPI({
        // TODO : For franchise we must remove member and add franchise params in back-end
        member,
        page: page ?? 1,
        page_size,
        mine_as_consumer: true,
        after_date_end: true,
        offer_is_workshop: false,
        ordering: '-offer__date_start',
      });
      dispatch(fetchMyPastBookingAsMemberActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(fetchMyPastBookingAsMemberActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(fetchMyPastBookingAsMemberActions.isLoading(false));
  };
}

export const fetchMyFutureBookingAsMemberActions = {
  success: createAction<PaginatedResponse<BookingREST>>(
    'BOOKING/FUTURE/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>('BOOKING/FUTURE/AS_MEMBER/IS_LOADING'),
  error: createAction<Error | null>('BOOKING/FUTURE/AS_MEMBER/ERROR'),
};

export function fetchMyFutureBookingAsMember(
  // TODO : For franchise we must remove member and add franchise params in back-end
  {
    member,
    page,
    page_size = CONSUMER_SPACE_API_PAGE_SIZE,
  }: PaginationFilterParams & {
    member: number;
  },
  options?: OptionCallback<PaginatedResponse<BookingREST>>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(fetchMyFutureBookingAsMemberActions.isLoading(true));
    dispatch(fetchMyFutureBookingAsMemberActions.error(null));
    try {
      const response = await fetchBookingListAPI({
        // TODO : For franchise we must remove member and add franchise params in back-end
        member,
        page: page ?? 1,
        page_size,
        mine_as_consumer: true,
        before_date_end: true,
        offer_is_workshop: false,
        ordering: 'offer__date_start',
      });
      dispatch(fetchMyFutureBookingAsMemberActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(fetchMyFutureBookingAsMemberActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(fetchMyFutureBookingAsMemberActions.isLoading(false));
  };
}

export const fetchMyPastBookingWorkshopAsMemberActions = {
  success: createAction<PaginatedResponse<BookingREST>>(
    'WORKSHOP/PAST/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>('WORKSHOP/PAST/AS_MEMBER/IS_LOADING'),
  error: createAction<Error | null>('WORKSHOP/PAST/AS_MEMBER/ERROR'),
};

export function fetchMyPastBookingWorkshopAsMember(
  // TODO : For franchise we must remove member and add franchise params in back-end
  {
    member,
    page,
    page_size = CONSUMER_SPACE_API_PAGE_SIZE,
  }: PaginationFilterParams & {
    member: number;
  },
  options?: OptionCallback<PaginatedResponse<BookingREST>>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(fetchMyPastBookingWorkshopAsMemberActions.isLoading(true));
    dispatch(fetchMyPastBookingWorkshopAsMemberActions.error(null));
    try {
      const response = await fetchBookingListAPI({
        // TODO : For franchise we must remove member and add franchise params in back-end
        member,
        page: page ?? 1,
        page_size,
        mine_as_consumer: true,
        after_date_end: true,
        offer_is_workshop: true,
        ordering: '-offer__date_start',
      });
      dispatch(
        fetchMyPastBookingWorkshopAsMemberActions.success(response.data),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(fetchMyPastBookingWorkshopAsMemberActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(fetchMyPastBookingWorkshopAsMemberActions.isLoading(false));
  };
}

export const fetchMyFutureBookingWorkshopAsMemberActions = {
  success: createAction<PaginatedResponse<BookingREST>>(
    'WORKSHOP/FUTURE/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>('WORKSHOP/FUTURE/AS_MEMBER/IS_LOADING'),
  error: createAction<Error | null>('WORKSHOP/FUTURE/AS_MEMBER/ERROR'),
};

export function fetchMyFutureBookingWorkshopAsMember(
  // TODO : For franchise we must remove member and add franchise params in back-end
  {
    member,
    page,
    page_size = CONSUMER_SPACE_API_PAGE_SIZE,
  }: PaginationFilterParams & {
    member: number;
  },
  options?: OptionCallback<PaginatedResponse<BookingREST>>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(fetchMyFutureBookingWorkshopAsMemberActions.isLoading(true));
    dispatch(fetchMyFutureBookingWorkshopAsMemberActions.error(null));

    try {
      const response = await fetchBookingListAPI({
        // TODO : For franchise we must remove member and add franchise params in back-end
        member,
        page: page ?? 1,
        page_size,
        mine_as_consumer: true,
        before_date_end: true,
        offer_is_workshop: true,
        ordering: 'offer__date_start',
      });
      dispatch(
        fetchMyFutureBookingWorkshopAsMemberActions.success(response.data),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
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
  success: createAction<BookingREST>('BOOKING/CANCEL/AS_MEMBER/SUCCESS'),
  isLoading: createAction<boolean>('BOOKING/CANCEL/AS_MEMBER/IS_LOADING'),
  error: createAction<Error | null>('BOOKING/CANCEL/AS_MEMBER/ERROR'),
};

export function cancelBookingAsMember(
  params: CancelBookingParams,
  options?: OptionCallback<BookingREST>,
): ThunkAction {
  const { bookingId, ...restParams } = params;
  return async (dispatch: Dispatch) => {
    dispatch(cancelBookingAsMemberActions.isLoading(true));
    dispatch(cancelBookingAsMemberActions.error(null));

    try {
      const response = await cancelBookingV2API(bookingId, restParams);
      dispatch(cancelBookingAsMemberActions.success(response.data));

      options?.onSuccess?.(response.data);
    } catch (err) {
      dispatch(cancelBookingAsMemberActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(cancelBookingAsMemberActions.isLoading(false));
  };
}

export const fetchMyPastPrivateBookingAsMemberActions = {
  success: createAction<PaginatedResponse<PrivateBooking>>(
    'PRIVATE_BOOKING/PAST/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>('PRIVATE_BOOKING/PAST/AS_MEMBER/IS_LOADING'),
  error: createAction<Error | null>('PRIVATE_BOOKING/PAST/AS_MEMBER/ERROR'),
};

export function fetchMyPastPrivateBookingAsMember(
  {
    member,
    page,
    page_size = CONSUMER_SPACE_API_PAGE_SIZE,
    company,
  }: PrivateBookingFilterParams,
  options?: OptionCallback<PaginatedResponse<PrivateBooking>>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(fetchMyPastPrivateBookingAsMemberActions.isLoading(true));
    dispatch(fetchMyPastPrivateBookingAsMemberActions.error(null));
    try {
      const response = await fetchPrivateBookingsV2API({
        page: page ?? 1,
        member,
        page_size,
        company,
        strictly_past_booking: true,
        ordering: '-date_start',
      });
      dispatch(fetchMyPastPrivateBookingAsMemberActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(fetchMyPastPrivateBookingAsMemberActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(fetchMyPastPrivateBookingAsMemberActions.isLoading(false));
  };
}

export const fetchMyFuturePrivateBookingAsMemberActions = {
  success: createAction<PaginatedResponse<PrivateBooking>>(
    'PRIVATE_BOOKING/FUTURE/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'PRIVATE_BOOKING/FUTURE/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>('PRIVATE_BOOKING/FUTURE/AS_MEMBER/ERROR'),
};

export function fetchMyFuturePrivateBookingAsMember(
  {
    member,
    page,
    page_size = CONSUMER_SPACE_API_PAGE_SIZE,
    company,
  }: PrivateBookingFilterParams,
  options?: OptionCallback<PaginatedResponse<PrivateBooking>>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(fetchMyFuturePrivateBookingAsMemberActions.isLoading(true));
    dispatch(fetchMyFuturePrivateBookingAsMemberActions.error(null));

    try {
      const response = await fetchPrivateBookingsV2API({
        page: page ?? 1,
        member,
        page_size,
        company,
        strictly_future_booking: true,
        ordering: 'date_start',
      });
      dispatch(
        fetchMyFuturePrivateBookingAsMemberActions.success(response.data),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(fetchMyFuturePrivateBookingAsMemberActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(fetchMyFuturePrivateBookingAsMemberActions.isLoading(false));
  };
}

export const cancelPrivateBookingAsMemberActions = {
  success: createAction<PrivateBooking>(
    'PRIVATE_BOOKING/CANCEL/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'PRIVATE_BOOKING/CANCEL/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>('PRIVATE_BOOKING/CANCEL/AS_MEMBER/ERROR'),
};

export function cancelPrivateBookingAsMember(
  params: CancelPrivateBookingParams,
  options?: OptionCallback<PrivateBooking>,
): ThunkAction {
  const { privateBookingId, ...restParams } = params;
  return async (dispatch: Dispatch) => {
    dispatch(cancelPrivateBookingAsMemberActions.isLoading(true));
    dispatch(cancelPrivateBookingAsMemberActions.error(null));

    try {
      const response = await disablePrivateBookingAPI(
        privateBookingId,
        restParams,
      );
      dispatch(cancelPrivateBookingAsMemberActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      dispatch(cancelPrivateBookingAsMemberActions.error(err));
      options?.onError?.(err);
    }
    dispatch(cancelPrivateBookingAsMemberActions.isLoading(false));
  };
}

export const fetchMyBookingOptionAsMemberActions = {
  success: createAction<PaginatedResponse<WaitingListBookingOption>>(
    'BOOKING_OPTION/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>('BOOKING_OPTION/AS_MEMBER/IS_LOADING'),
  error: createAction<Error | null>('BOOKING_OPTION/AS_MEMBER/ERROR'),
};

export function fetchMyBookingOptionAsMember(
  {
    page_size = CONSUMER_SPACE_API_PAGE_SIZE,
    page,
    company,
    consumer,
  }: WaitingListBookingOptionPaginatedQueryParams,
  options?: OptionCallback<PaginatedResponse<WaitingListBookingOption>>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(fetchMyBookingOptionAsMemberActions.isLoading(true));
    dispatch(fetchMyBookingOptionAsMemberActions.error(null));
    try {
      const response = await fetchFilteredBookingOptionsPaginatedAPI({
        company,
        consumer,
        page: page ?? 1,
        page_size,
        mine: true,
        offer_is_workshop: false,
        ordering: 'offer__date_start',
      });
      dispatch(fetchMyBookingOptionAsMemberActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      dispatch(fetchMyBookingOptionAsMemberActions.error(err));
      options?.onError?.(err);
    }
    dispatch(fetchMyBookingOptionAsMemberActions.isLoading(false));
  };
}

export const fetchMyBookingOptionsPositionAsMemberByOfferIdsActions = {
  success: createAction<OfferStatusWaitingListPosition[]>(
    'BOOKING_OPTION_POSITION/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'BOOKING_OPTION_POSITION/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>('BOOKING_OPTION_POSITION/AS_MEMBER/ERROR'),
};

export function fetchMyBookingOptionsPositionAsMemberByOfferIds(
  id__in: number[],
  options?: OptionCallback<OfferStatusWaitingListPosition[]>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(
      fetchMyBookingOptionsPositionAsMemberByOfferIdsActions.isLoading(true),
    );
    dispatch(
      fetchMyBookingOptionsPositionAsMemberByOfferIdsActions.error(null),
    );

    try {
      const response = await fetchOfferWaitingListPositionList(id__in);
      dispatch(
        fetchMyBookingOptionsPositionAsMemberByOfferIdsActions.success(
          response.data.results,
        ),
      );
      options?.onSuccess?.(response.data.results);
    } catch (err) {
      dispatch(
        fetchMyBookingOptionsPositionAsMemberByOfferIdsActions.error(err),
      );
      options?.onError?.(err);
    }
    dispatch(
      fetchMyBookingOptionsPositionAsMemberByOfferIdsActions.isLoading(false),
    );
  };
}

export const fetchMyBookingOptionWorkshopAsMemberActions = {
  success: createAction<PaginatedResponse<WaitingListBookingOption>>(
    'BOOKING_OPTION/WORKSHOP/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'BOOKING_OPTION/WORKSHOP/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>('BOOKING_OPTION/WORKSHOP/AS_MEMBER/ERROR'),
};

export function fetchMyBookingOptionWorkshopAsMember(
  {
    page,
    page_size = CONSUMER_SPACE_API_PAGE_SIZE,
    company,
    consumer,
  }: WaitingListBookingOptionPaginatedQueryParams,
  options?: OptionCallback<PaginatedResponse<WaitingListBookingOption>>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(fetchMyBookingOptionWorkshopAsMemberActions.isLoading(true));
    dispatch(fetchMyBookingOptionWorkshopAsMemberActions.error(null));
    try {
      const response = await fetchFilteredBookingOptionsPaginatedAPI({
        company,
        consumer,
        page: page ?? 1,
        page_size,
        mine: true,
        offer_is_workshop: true,
        ordering: 'offer__date_start',
      });
      dispatch(
        fetchMyBookingOptionWorkshopAsMemberActions.success(response.data),
      );
      options?.onSuccess?.(response.data);
    } catch (err) {
      dispatch(fetchMyBookingOptionWorkshopAsMemberActions.error(err));
      options?.onError?.(err);
    }
    dispatch(fetchMyBookingOptionWorkshopAsMemberActions.isLoading(false));
  };
}

export const cancelBookingOptionAsMemberActions = {
  success: createAction<WaitingListBookingOption>(
    'BOOKING_OPTION/CANCEL/SUCCESS',
  ),
  isLoading: createAction<boolean>('BOOKING_OPTION/CANCEL/IS_LOADING'),
  error: createAction<Error | null>('BOOKING_OPTION/CANCEL/ERROR'),
};

export function cancelBookingOptionAsMember(
  params: DiscardBookingOptionParams,
  options?: OptionCallback<WaitingListBookingOption>,
): ThunkAction {
  const { bookingOptionId, ...restParams } = params;
  return async (dispatch: Dispatch) => {
    dispatch(cancelBookingOptionAsMemberActions.isLoading(true));
    dispatch(cancelBookingOptionAsMemberActions.error(null));

    try {
      const response = await discardBookingOptionAPI(
        bookingOptionId,
        restParams,
      );
      dispatch(cancelBookingOptionAsMemberActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      dispatch(cancelBookingOptionAsMemberActions.error(err));
      options?.onError?.(err);
    }
    dispatch(cancelBookingOptionAsMemberActions.isLoading(false));
  };
}
/** MY PASSES PAGE */

/** MY PASSES PAGE - CONSUMER PAYMENT PACKS */

export const fetchMyActiveConsumerPaymentPacksAsMemberActions = {
  success: createAction<PaginatedResponse<ConsumerPaymentPackREST>>(
    'REWORKED/CONSUMER_PAYMENT_PACK/ACTIVE/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'REWORKED/CONSUMER_PAYMENT_PACK/ACTIVE/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'REWORKED/CONSUMER_PAYMENT_PACK/ACTIVE/AS_MEMBER/ERROR',
  ),
};

export const fetchMyActiveConsumerPaymentPacksAsMember = (
  {
    memberId,
    page,
    page_size = CONSUMER_SPACE_API_PAGE_SIZE,
  }: PaginationFilterParams & { memberId: number },
  options?: OptionCallback<PaginatedResponse<ConsumerPaymentPackREST>>,
): ThunkAction => {
  return async (dispatch) => {
    dispatch(fetchMyActiveConsumerPaymentPacksAsMemberActions.isLoading(true));
    dispatch(fetchMyActiveConsumerPaymentPacksAsMemberActions.error(null));
    try {
      const response = await fetchConsumerPaymentPackListAPI({
        member: memberId,
        page: page ?? 1,
        page_size,
        is_valid_today: true,
        is_universal: false,
        reverted: false,
      });
      dispatch(
        fetchMyActiveConsumerPaymentPacksAsMemberActions.success(response.data),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(fetchMyActiveConsumerPaymentPacksAsMemberActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(fetchMyActiveConsumerPaymentPacksAsMemberActions.isLoading(false));
  };
};

export const fetchMyExpiredConsumerPaymentPacksAsMemberActions = {
  success: createAction<PaginatedResponse<ConsumerPaymentPackREST>>(
    'REWORKED/CONSUMER_PAYMENT_PACK/EXPIRED/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'REWORKED/CONSUMER_PAYMENT_PACK/EXPIRED/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'REWORKED/CONSUMER_PAYMENT_PACK/EXPIRED/AS_MEMBER/ERROR',
  ),
};

export const fetchMyExpiredConsumerPaymentPacksAsMember = (
  {
    memberId,
    page,
    page_size = CONSUMER_SPACE_API_PAGE_SIZE,
  }: PaginationFilterParams & { memberId: number },
  options?: OptionCallback<PaginatedResponse<ConsumerPaymentPackREST>>,
): ThunkAction => {
  return async (dispatch) => {
    dispatch(fetchMyExpiredConsumerPaymentPacksAsMemberActions.isLoading(true));
    dispatch(fetchMyExpiredConsumerPaymentPacksAsMemberActions.error(null));
    try {
      const response = await fetchConsumerPaymentPackListAPI({
        member: memberId,
        page: page ?? 1,
        page_size,
        is_expired: true,
        is_universal: false,
        reverted: false,
      });
      dispatch(
        fetchMyExpiredConsumerPaymentPacksAsMemberActions.success(
          response.data,
        ),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(fetchMyExpiredConsumerPaymentPacksAsMemberActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(
      fetchMyExpiredConsumerPaymentPacksAsMemberActions.isLoading(false),
    );
  };
};

export const fetchMyFutureConsumerPaymentPacksAsMemberActions = {
  success: createAction<PaginatedResponse<ConsumerPaymentPackREST>>(
    'REWORKED/CONSUMER_PAYMENT_PACK/FUTURE/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'REWORKED/CONSUMER_PAYMENT_PACK/FUTURE/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'REWORKED/CONSUMER_PAYMENT_PACK/FUTURE/AS_MEMBER/ERROR',
  ),
};

export const fetchMyFutureConsumerPaymentPacksAsMember = (
  {
    memberId,
    page,
    page_size = CONSUMER_SPACE_API_PAGE_SIZE,
  }: PaginationFilterParams & { memberId: number },
  options?: OptionCallback<PaginatedResponse<ConsumerPaymentPackREST>>,
): ThunkAction => {
  return async (dispatch) => {
    dispatch(fetchMyFutureConsumerPaymentPacksAsMemberActions.isLoading(true));
    dispatch(fetchMyFutureConsumerPaymentPacksAsMemberActions.error(null));
    try {
      const response = await fetchConsumerPaymentPackListAPI({
        member: memberId,
        page: page ?? 1,
        page_size,
        is_expired: false,
        is_valid_today: false,
        is_universal: false,
        reverted: false,
      });
      dispatch(
        fetchMyFutureConsumerPaymentPacksAsMemberActions.success(response.data),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(fetchMyFutureConsumerPaymentPacksAsMemberActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(fetchMyFutureConsumerPaymentPacksAsMemberActions.isLoading(false));
  };
};

/** MY PASSES PAGE - PRIVATE CONSUMER PASS */

export const fetchMyActivePrivateConsumerPassesAsMemberActions = {
  success: createAction<PaginatedResponse<PrivateConsumerPassREST>>(
    'REWORKED/PRIVATE_CONSUMER_PASS/ACTIVE/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'REWORKED/PRIVATE_CONSUMER_PASS/ACTIVE/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'REWORKED/PRIVATE_CONSUMER_PASS/ACTIVE/AS_MEMBER/ERROR',
  ),
};

export const fetchMyActivePrivateConsumerPassesAsMember = (
  {
    memberId,
    page,
    page_size = CONSUMER_SPACE_API_PAGE_SIZE,
  }: PaginationFilterParams & { memberId: number },
  options?: OptionCallback<PaginatedResponse<PrivateConsumerPassREST>>,
): ThunkAction => {
  return async (dispatch) => {
    dispatch(fetchMyActivePrivateConsumerPassesAsMemberActions.isLoading(true));
    dispatch(fetchMyActivePrivateConsumerPassesAsMemberActions.error(null));
    try {
      const response = await fetchPrivateConsumerPassListAPI({
        member: memberId,
        page: page ?? 1,
        page_size,
        is_valid_today: true,
        is_universal: false,
        reverted: false,
      });
      dispatch(
        fetchMyActivePrivateConsumerPassesAsMemberActions.success(
          response.data,
        ),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(fetchMyActivePrivateConsumerPassesAsMemberActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(
      fetchMyActivePrivateConsumerPassesAsMemberActions.isLoading(false),
    );
  };
};

export const fetchMyExpiredPrivateConsumerPassesAsMemberActions = {
  success: createAction<PaginatedResponse<PrivateConsumerPassREST>>(
    'REWORKED/PRIVATE_CONSUMER_PASS/EXPIRED/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'REWORKED/PRIVATE_CONSUMER_PASS/EXPIRED/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'REWORKED/PRIVATE_CONSUMER_PASS/EXPIRED/AS_MEMBER/ERROR',
  ),
};

export const fetchMyExpiredPrivateConsumerPassesAsMember = (
  {
    memberId,
    page,
    page_size = CONSUMER_SPACE_API_PAGE_SIZE,
  }: PaginationFilterParams & { memberId: number },
  options?: OptionCallback<PaginatedResponse<PrivateConsumerPassREST>>,
): ThunkAction => {
  return async (dispatch) => {
    dispatch(
      fetchMyExpiredPrivateConsumerPassesAsMemberActions.isLoading(true),
    );
    dispatch(fetchMyExpiredPrivateConsumerPassesAsMemberActions.error(null));
    try {
      const response = await fetchPrivateConsumerPassListAPI({
        member: memberId,
        page: page ?? 1,
        page_size,
        is_expired: true,
        is_universal: false,
        reverted: false,
      });
      dispatch(
        fetchMyExpiredPrivateConsumerPassesAsMemberActions.success(
          response.data,
        ),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(fetchMyExpiredPrivateConsumerPassesAsMemberActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(
      fetchMyExpiredPrivateConsumerPassesAsMemberActions.isLoading(false),
    );
  };
};

export const fetchMyFuturePrivateConsumerPassesAsMemberActions = {
  success: createAction<PaginatedResponse<PrivateConsumerPassREST>>(
    'REWORKED/PRIVATE_CONSUMER_PASS/FUTURE/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'REWORKED/PRIVATE_CONSUMER_PASS/FUTURE/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'REWORKED/PRIVATE_CONSUMER_PASS/FUTURE/AS_MEMBER/ERROR',
  ),
};

export const fetchMyFuturePrivateConsumerPassesAsMember = (
  {
    memberId,
    page,
    page_size = CONSUMER_SPACE_API_PAGE_SIZE,
  }: PaginationFilterParams & { memberId: number },
  options?: OptionCallback<PaginatedResponse<PrivateConsumerPassREST>>,
): ThunkAction => {
  return async (dispatch) => {
    dispatch(fetchMyFuturePrivateConsumerPassesAsMemberActions.isLoading(true));
    dispatch(fetchMyFuturePrivateConsumerPassesAsMemberActions.error(null));
    try {
      const response = await fetchPrivateConsumerPassListAPI({
        member: memberId,
        page: page ?? 1,
        page_size,
        is_expired: false,
        is_valid_today: false,
        is_universal: false,
        reverted: false,
      });
      dispatch(
        fetchMyFuturePrivateConsumerPassesAsMemberActions.success(
          response.data,
        ),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(fetchMyFuturePrivateConsumerPassesAsMemberActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(
      fetchMyFuturePrivateConsumerPassesAsMemberActions.isLoading(false),
    );
  };
};

export const fetchMyActiveUniversalPassesAsMemberActions = {
  success: createAction<PaginatedResponse<UniversalPassREST>>(
    'REWORKED/UNIVERSAL_PASS/ACTIVE/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'REWORKED/UNIVERSAL_PASS/ACTIVE/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'REWORKED/UNIVERSAL_PASS/ACTIVE/AS_MEMBER/ERROR',
  ),
};

export const fetchMyActiveUniversalPassesAsMember = (
  {
    memberId,
    page,
    page_size = CONSUMER_SPACE_API_PAGE_SIZE,
  }: PaginationFilterParams & { memberId: number },
  options?: OptionCallback<PaginatedResponse<UniversalPassREST>>,
): ThunkAction => {
  return async (dispatch) => {
    dispatch(fetchMyActiveUniversalPassesAsMemberActions.isLoading(true));
    dispatch(fetchMyActiveUniversalPassesAsMemberActions.error(null));
    try {
      const response = await fetchUniversalPassesAPI({
        member: memberId,
        page: page ?? 1,
        page_size,
        is_expired: false,
        is_valid_today: true,
      });
      dispatch(
        fetchMyActiveUniversalPassesAsMemberActions.success(response.data),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(fetchMyActiveUniversalPassesAsMemberActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(fetchMyActiveUniversalPassesAsMemberActions.isLoading(false));
  };
};

export const fetchMyExpiredUniversalPassesAsMemberActions = {
  success: createAction<PaginatedResponse<UniversalPassREST>>(
    'REWORKED/UNIVERSAL_PASS/EXPIRED/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'REWORKED/UNIVERSAL_PASS/EXPIRED/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'REWORKED/UNIVERSAL_PASS/EXPIRED/AS_MEMBER/ERROR',
  ),
};

export const fetchMyExpiredUniversalPassesAsMember = (
  {
    memberId,
    page,
    page_size = CONSUMER_SPACE_API_PAGE_SIZE,
  }: PaginationFilterParams & { memberId: number },
  options?: OptionCallback<PaginatedResponse<UniversalPassREST>>,
): ThunkAction => {
  return async (dispatch) => {
    dispatch(fetchMyExpiredUniversalPassesAsMemberActions.isLoading(true));
    dispatch(fetchMyExpiredUniversalPassesAsMemberActions.error(null));
    try {
      const response = await fetchUniversalPassesAPI({
        member: memberId,
        page: page ?? 1,
        page_size,
        is_expired: true,
        is_valid_today: false,
      });
      dispatch(
        fetchMyExpiredUniversalPassesAsMemberActions.success(response.data),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(fetchMyExpiredUniversalPassesAsMemberActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(fetchMyExpiredUniversalPassesAsMemberActions.isLoading(false));
  };
};

export const fetchMyFutureUniversalPassesAsMemberActions = {
  success: createAction<PaginatedResponse<UniversalPassREST>>(
    'REWORKED/UNIVERSAL_PASS/FUTURE/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'REWORKED/UNIVERSAL_PASS/FUTURE/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'REWORKED/UNIVERSAL_PASS/FUTURE/AS_MEMBER/ERROR',
  ),
};

export const fetchMyFutureUniversalPassesAsMember = (
  {
    memberId,
    page,
    page_size = CONSUMER_SPACE_API_PAGE_SIZE,
  }: PaginationFilterParams & { memberId: number },
  options?: OptionCallback<PaginatedResponse<UniversalPassREST>>,
): ThunkAction => {
  return async (dispatch) => {
    dispatch(fetchMyFutureUniversalPassesAsMemberActions.isLoading(true));
    dispatch(fetchMyFutureUniversalPassesAsMemberActions.error(null));
    try {
      const response = await fetchUniversalPassesAPI({
        member: memberId,
        page: page ?? 1,
        page_size,
        is_expired: false,
        is_valid_today: false,
      });
      dispatch(
        fetchMyFutureUniversalPassesAsMemberActions.success(response.data),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(fetchMyFutureUniversalPassesAsMemberActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(fetchMyFutureUniversalPassesAsMemberActions.isLoading(false));
  };
};

export const fetchConsumerPassesTabDisplayActions = {
  success: createAction<ConsumerPassesTabDisplay>(
    'REWORKED/MY_PASSES_TABS/SUCCESS',
  ),
  isLoading: createAction<boolean>('REWORKED/MY_PASSES_TABS/IS_LOADING'),
  error: createAction<Error | null>('REWORKED/MY_PASSES_TABS/ERROR'),
};

export const fetchConsumerPassesTabDisplay =
  (
    memberId: number,
    options?: OptionCallback<ConsumerPassesTabDisplay>,
  ): ThunkAction =>
  async (dispatch) => {
    dispatch(fetchConsumerPassesTabDisplayActions.isLoading(true));
    dispatch(fetchConsumerPassesTabDisplayActions.error(null));
    try {
      const response = await fetchMyPassesTabsAPI(memberId);
      dispatch(fetchConsumerPassesTabDisplayActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(fetchConsumerPassesTabDisplayActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(fetchConsumerPassesTabDisplayActions.isLoading(false));
  };

// MY INVOICES

export const fetchConsumerUnpaidInvoicesActions = {
  isLoading: createAction<boolean>('CONSUMER_INVOICE/UNPAID/LIST/LOADING'),
  error: createAction<Error | null>('CONSUMER_INVOICE/UNPAID/LIST/ERROR'),
  success: createAction<PaginatedResponse<ConsumerInvoiceREST>>(
    'CONSUMER_INVOICE/UNPAID/LIST/SUCCESS',
  ),
};

export function fetchConsumerUnpaidInvoices(
  {
    page,
    page_size = CONSUMER_SPACE_API_PAGE_SIZE,
    company_id,
  }: ConsumerInvoiceParams,
  options?: OptionCallback<PaginatedResponse<ConsumerInvoiceREST>>,
) {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(fetchConsumerUnpaidInvoicesActions.isLoading(true));
      dispatch(fetchConsumerUnpaidInvoicesActions.error(null));

      const response = await fetchConsumerInvoicesAPI({
        unpaid: true,
        page: page ?? 1,
        page_size,
        company_id,
      });
      dispatch(fetchConsumerUnpaidInvoicesActions.success(response.data));

      options?.onSuccess?.(response.data);
    } catch (error) {
      options?.onError?.(error);
      dispatch(fetchConsumerUnpaidInvoicesActions.error(error));
    } finally {
      dispatch(fetchConsumerUnpaidInvoicesActions.isLoading(false));
    }
  };
}

export const fetchConsumerPaidInvoicesActions = {
  isLoading: createAction<boolean>('CONSUMER_INVOICE/PAID/LIST/LOADING'),
  error: createAction<Error | null>('CONSUMER_INVOICE/PAID/LIST/ERROR'),
  success: createAction<PaginatedResponse<ConsumerInvoiceREST>>(
    'CONSUMER_INVOICE/PAID/LIST/SUCCESS',
  ),
};
export function fetchConsumerPaidInvoices(
  {
    page,
    page_size = CONSUMER_SPACE_API_PAGE_SIZE,
    company_id,
  }: ConsumerInvoiceParams,
  options?: OptionCallback<PaginatedResponse<ConsumerInvoiceREST>>,
) {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(fetchConsumerPaidInvoicesActions.isLoading(true));
      dispatch(fetchConsumerPaidInvoicesActions.error(null));

      const response = await fetchConsumerInvoicesAPI({
        paid: true,
        page: page ?? 1,
        page_size,
        company_id,
      });
      dispatch(fetchConsumerPaidInvoicesActions.success(response.data));

      options?.onSuccess?.(response.data);
    } catch (error) {
      options?.onError?.(error);
      dispatch(fetchConsumerPaidInvoicesActions.error(error));
    } finally {
      dispatch(fetchConsumerPaidInvoicesActions.isLoading(false));
    }
  };
}

export const fetchConsumerRefundedInvoicesActions = {
  isLoading: createAction<boolean>('CONSUMER_INVOICE/REFUNDED/LIST/LOADING'),
  error: createAction<Error | null>('CONSUMER_INVOICE/REFUNDED/LIST/ERROR'),
  success: createAction<PaginatedResponse<ConsumerInvoiceREST>>(
    'CONSUMER_INVOICE/REFUNDED/LIST/SUCCESS',
  ),
};
export function fetchConsumerRefundedInvoices(
  {
    page,
    page_size = CONSUMER_SPACE_API_PAGE_SIZE,
    company_id,
  }: ConsumerInvoiceParams,
  options?: OptionCallback<PaginatedResponse<ConsumerInvoiceREST>>,
) {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(fetchConsumerRefundedInvoicesActions.isLoading(true));
      dispatch(fetchConsumerRefundedInvoicesActions.error(null));

      const response = await fetchConsumerInvoicesAPI({
        refunded: true,
        page: page ?? 1,
        page_size,
        company_id,
      });
      dispatch(fetchConsumerRefundedInvoicesActions.success(response.data));

      options?.onSuccess?.(response.data);
    } catch (error) {
      options?.onError?.(error);
      dispatch(fetchConsumerRefundedInvoicesActions.error(error));
    } finally {
      dispatch(fetchConsumerRefundedInvoicesActions.isLoading(false));
    }
  };
}

export const fetchConsumerInvoicesComplementaryActions = {
  isLoading: createAction<boolean>(
    'CONSUMER_INVOICE/COMPLEMENTARY_LIST/LOADING',
  ),
  error: createAction<Error | null>(
    'CONSUMER_INVOICE/COMPLEMENTARY_LIST/ERROR',
  ),
  success: createAction<ConsumerInvoiceComplementary[]>(
    'CONSUMER_INVOICE/COMPLEMENTARY_LIST/SUCCESS',
  ),
};
export function fetchConsumerInvoicesComplementary(
  filterParams: { uuid__in?: string[] },
  options?: OptionCallback<ConsumerInvoiceComplementary[]>,
) {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(fetchConsumerInvoicesComplementaryActions.isLoading(true));
      dispatch(fetchConsumerInvoicesComplementaryActions.error(null));

      const response = await fetchConsumerInvoicesComplementaryAPI(
        filterParams,
      );
      dispatch(
        fetchConsumerInvoicesComplementaryActions.success(response.data),
      );

      options?.onSuccess?.(response.data);
    } catch (error) {
      options?.onError?.(error);
      dispatch(fetchConsumerInvoicesComplementaryActions.error(error));
    } finally {
      dispatch(fetchConsumerInvoicesComplementaryActions.isLoading(false));
    }
  };
}

export const fetchConsumerGuestNumberEligibleByOfferBulk = {
  isLoading: createAction<boolean>(
    'CONSUMER_BOOKING/GUEST_NUMBER_ELIGIBLE_LEFT/LOADING',
  ),
  error: createAction<Error | null>(
    'CONSUMER_BOOKING/GUEST_NUMBER_ELIGIBLE_LEFT/ERROR',
  ),
  success: createAction<Record<number, number>>(
    'CONSUMER_BOOKING/GUEST_NUMBER_ELIGIBLE_LEFT/SUCCESS',
  ),
};

export function fetchConsumerGuestNumberEligibleLeftByOfferBulk(
  id__in: number[],
  options?: OptionCallback<Record<number, number>>,
) {
  return async (dispatch: Dispatch) => {
    const uniq_ids = uniq((id__in ?? []).filter((id) => !!id));
    if (uniq_ids.length === 0 || uniq_ids.length > 10) {
      return;
    }

    try {
      dispatch(fetchConsumerGuestNumberEligibleByOfferBulk.isLoading(true));
      dispatch(fetchConsumerGuestNumberEligibleByOfferBulk.error(null));

      const response = await fetchBookingGuestNumberEligibleLeftByOfferBulk(
        id__in,
      );
      dispatch(
        fetchConsumerGuestNumberEligibleByOfferBulk.success(response.data),
      );

      options?.onSuccess?.(response.data);
    } catch (error) {
      options?.onError?.(error);
      dispatch(fetchConsumerGuestNumberEligibleByOfferBulk.error(error));
    } finally {
      dispatch(fetchConsumerGuestNumberEligibleByOfferBulk.isLoading(false));
    }
  };
}
