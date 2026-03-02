import { createAction } from 'redux-actions';
import { DateTime } from 'luxon';

import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code.js';

import {
  ALL_ERROR_CODES,
  SPOT_NOT_AVAILABLE,
} from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought.js';
import {
  LOCK_ACQUISITION_FAILURE_GENERIC,
  LOCK_ACQUISITION_FAILURE_SPOT_SCHEDULING,
} from '@bsport/common/lib/master-data/error-codes/lock.js';

import { EXCEPTION_STAFF_ROLE_OVERBOOKING_NOT_ALLOWED } from '#src/libs/role/constants';
import { isErrorWithCustomCode } from '#src/libs/utils';
import type { Offer } from '#src/libs/offer/types';
import { snackbarSuccess, snackbarError } from '../snackbar/actions';

import {
  fetchBookingListV2 as fetchBookingListAPI,
  fetchOfferGroupRelatedBookings as fetchOfferGroupRelatedBookingsAPI,
  retrieveBooking as retrieveBookingAPI,
  confirmAttendance as confirmAttendanceAPI,
  discardAttendance as discardAttendanceAPI,
  cancelBooking as cancelBookingAPI,
  cancelMultipleBooking as cancelMultipleBookingAPI,
  registerBooking as registerBookingAPI,
  registerTabletBooking as registerTabletBookingAPI,
  fetchBookingBroadcastRoom as fetchBookingBroadcastRoomAPI,
  fetchRecurrenceRuleBookingList as fetchRecurrenceRuleBookingListAPI,
  createRecurrenceRuleBooking as createRecurrenceRuleBookingAPI,
  deleteRecurrenceRuleBooking as deleteRecurrenceRuleBookingAPI,
  updateRecurrenceRuleBooking as updateRecurrenceRuleBookingAPI,
  retrieveOfferWithCancelledBookings as retrieveOfferWithCancelledBookingsAPI,
  updateOfferWithCancelledBookingsToRetry as updateOfferWithCancelledBookingsToRetryAPI,
  setSpotForMember,
  refundBooking as refundBookingAPI,
  swapBookingPass as swapBookingPassAPI,
} from './api';

import type { Dispatch, OptionCallback, ThunkAction } from '../../state/types';
import type { Booking, BookingREST } from './types';

export const retrieveActions = {
  success: createAction('BOOKING/RETRIEVE/SUCCESS'),
  isLoading: createAction('BOOKING/RETRIEVE/IS_LOADING'),
  error: createAction('BOOKING/RETRIEVE/ERROR'),
};

export function retrieveBooking(
  id: number,
  options?: OptionCallback<BookingREST>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveActions.isLoading(true));
    dispatch(retrieveActions.error(null));

    try {
      const response = await retrieveBookingAPI(id);
      dispatch(retrieveActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(retrieveActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(retrieveActions.isLoading(false));
  };
}

export const updateActions = {
  success: createAction('BOOKING/UPDATE/SUCCESS'),
  successMultiple: createAction('BOOKING/UPDATE/SUCCESS_MULTIPLE'),
  isLoading: createAction('BOOKING/UPDATE/IS_LOADING'),
  error: createAction('BOOKING/UDPATE/ERROR'),
};

export const updateRollCallOfferRetrieveActions = {
  successNeedsValidation: createAction(
    'OFFER/UPDATE/ROLLCALL/NEEDSVALIDATION/RETRIEVE/SUCCESS',
  ),
  successDate: createAction('OFFER/UPDATE/ROLLCALL/DATE/SUCCESS'),
};

export const updateRollCallOfferByIdActions = {
  successNeedsValidation: createAction(
    'OFFER/UPDATE/ROLLCALL/NEEDSVALIDATION/BYID/SUCCESS',
  ),
  successDate: createAction('OFFER/UPDATE/ROLLCALL/DATE/SUCCESS'),
};

export function updateBooking(
  id: number,
  data: any,
  options?: OptionCallback,
  apiCall?: any,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateActions.isLoading(true));
    dispatch(updateActions.error(null));

    try {
      const response = await apiCall(id, data);
      dispatch(updateActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(updateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(updateActions.isLoading(false));
  };
}

export function updateBookingAndRollCallRetrieve(
  id: number,
  data: any,
  options?: OptionCallback,
  apiCall?: any,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateActions.isLoading(true));
    dispatch(updateActions.error(null));

    try {
      const response = await apiCall(id, data);
      dispatch(updateActions.success(response.data));
      if (response.data?.roll_call_needs_validation !== null) {
        dispatch(
          updateRollCallOfferRetrieveActions.successNeedsValidation(
            response.data.roll_call_needs_validation,
          ),
        );
      }
      if (response.data?.date_roll_call_last_modified !== null) {
        dispatch(
          updateRollCallOfferRetrieveActions.successDate(
            response.data.date_roll_call_last_modified,
          ),
        );
      }
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(updateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(updateActions.isLoading(false));
  };
}

export function updateBookingAndRollCallById(
  id: number,
  data: any,
  options?: OptionCallback,
  apiCall?: any,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateActions.isLoading(true));
    dispatch(updateActions.error(null));

    try {
      const response = await apiCall(id, data);
      dispatch(updateActions.success(response.data));
      if (response.data?.roll_call_needs_validation !== null) {
        dispatch(
          updateRollCallOfferByIdActions.successNeedsValidation({
            id: response.data.offer,
            roll_call_needs_validation:
              response.data.roll_call_needs_validation,
          }),
        );
      }
      if (response.data?.date_roll_call_last_modified !== null) {
        dispatch(
          updateRollCallOfferByIdActions.successDate({
            id: response.data.offer,
            date_roll_call_last_modified:
              response.data.date_roll_call_last_modified,
          }),
        );
      }
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(updateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(updateActions.isLoading(false));
  };
}

export const setSpotForBooking = (
  id: number,
  spot_id: number,
  options?: OptionCallback,
) => {
  return updateBooking(id, { spot_id }, options, setSpotForMember);
};

export const swapBookingPass = (
  id: number,
  consumer_payment_pack_id: number,
  options?: OptionCallback,
) => {
  return updateBooking(
    id,
    { consumer_payment_pack_id },
    options,
    swapBookingPassAPI,
  );
};

export const discardAttendance = (id: number, options?: OptionCallback) =>
  updateBooking(id, {}, options, discardAttendanceAPI);
export const confirmAttendance = (id: number, options?: OptionCallback) =>
  updateBooking(id, {}, options, confirmAttendanceAPI);

export const confirmAttendanceAndRollCallRetrieve = (
  id: number,
  options?: OptionCallback,
) => updateBookingAndRollCallRetrieve(id, {}, options, confirmAttendanceAPI);

export const discardAttendanceAndRollCallRetrieve = (
  id: number,
  options?: OptionCallback,
) => updateBookingAndRollCallRetrieve(id, {}, options, discardAttendanceAPI);

export const confirmAttendanceAndRollCallById = (
  id: number,
  options?: OptionCallback,
) => updateBookingAndRollCallById(id, {}, options, confirmAttendanceAPI);

export const discardAttendanceAndRollCallById = (
  id: number,
  options?: OptionCallback,
) => updateBookingAndRollCallById(id, {}, options, discardAttendanceAPI);

export function cancelBooking(id: number, data: any, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(updateActions.isLoading(true));
    dispatch(updateActions.error(null));

    try {
      let response;

      if (data?.bookings_in_same_group?.length > 0) {
        response = cancelMultipleBookingAPI({
          ...data,
          bookings_in_same_group: [...data.bookings_in_same_group, id],
        });
        // @ts-expect-error
        dispatch(updateActions.successMultiple(response.data));
      } else {
        response = await cancelBookingAPI(id, data);
        dispatch(updateActions.success(response.data));
      }

      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (err) {
      if (err.response?.status === 403)
        dispatch(snackbarError('booking.delete.error'));
      dispatch(updateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(updateActions.isLoading(false));
  };
}

export const refundBookingActions = {
  isLoading: createAction<boolean>('BOOKING/REFUND/IS_LOADING'),
  error: createAction<Error | null>('BOOKING/REFUND/ERROR'),
};

/**
 * Manually trigger a booking refund as a manager.
 * The refund will always occur even if the booking is late cancelled.
 * If the booking has been made with an unlimited pass, the strike count for penalty
 * is removed.
 *
 * Note that this is a **manager only** action.
 * @param id The ID of the booking to refund
 */
export const refundBookingAsManager = (
  id: number,
  options: OptionCallback<BookingREST>,
) => {
  return async (dispatch: Dispatch) => {
    dispatch(refundBookingActions.isLoading(true));
    dispatch(refundBookingActions.error(null));

    try {
      const response = await refundBookingAPI(id);
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(refundBookingActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(refundBookingActions.isLoading(false));
    }
  };
};

export const asConsumerActions = {
  success: createAction('BOOKING/AS_CONSUMER/SUCCESS'),
  isLoading: createAction('BOOKING/AS_CONSUMER/IS_LOADING'),
  error: createAction('BOOKING/AS_CONSUMER/ERROR'),
};

export function fetchBookingsAsConsumer(
  member: number,
  page: number,
  page_size: number,
  options: OptionCallback<BookingREST[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(asConsumerActions.isLoading(true));
    dispatch(asConsumerActions.error(null));

    try {
      const response = await fetchBookingListAPI({
        member,
        page,
        page_size,
        mine: true,
      });
      dispatch(asConsumerActions.success({ ...response.data, page }));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      dispatch(asConsumerActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(asConsumerActions.isLoading(false));
  };
}

export const consumerDashboardActions = {
  success: createAction('BOOKING/CONSUMER_DASHBOARD/SUCCESS'),
  isLoading: createAction('BOOKING/CONSUMER_DASHBOARD/IS_LOADING'),
  error: createAction('BOOKING/CONSUMER_DASHBOARD/ERROR'),
};

export function fetchConsumerDashboardBookingList(
  member: number,
  page?: number,
  page_size?: number,
  options?: OptionCallback<Booking[]>,
): ThunkAction {
  // DADA
  return async (dispatch, getState) => {
    dispatch(consumerDashboardActions.isLoading(true));
    dispatch(consumerDashboardActions.error(null));
    let pageToFetch = page;
    if (!pageToFetch) {
      pageToFetch = getState().booking.consumerDashboard.next_page;
    }

    try {
      const response = await fetchBookingListAPI({
        member,
        page: pageToFetch,
        page_size: 5,
        mine: true,
        // @ts-expect-error
        min_date: DateTime.now().toISODate(),
        booking_status_code: BOOKING_STATUS_OK.id,
        ordering: 'offer__date_start',
      });

      dispatch(consumerDashboardActions.success({ ...response.data, page }));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      dispatch(consumerDashboardActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(consumerDashboardActions.isLoading(false));
  };
}

export const retrieveBookingBroadcastRoom = {
  success: createAction('BOOKING/BROADCAST/SUCCESS'),
  error: createAction('BOOKING/BROADCAST/ERROR'),
  isLoading: createAction('BOOKING/BROADCAST/IS_LOADING'),
};

export function fetchBookingBroadcastRoom(id: number, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveBookingBroadcastRoom.isLoading(true));
    dispatch(retrieveBookingBroadcastRoom.error(null));

    try {
      const response = await fetchBookingBroadcastRoomAPI(id);
      dispatch(retrieveBookingBroadcastRoom.success(response.data));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(retrieveBookingBroadcastRoom.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(retrieveBookingBroadcastRoom.isLoading(false));
  };
}

export const byMemberActions = {
  success: createAction('BOOKING/BY_MEMBER/SUCCESS'),
  isLoading: createAction('BOOKING/BY_MEMBER/IS_LOADING'),
  error: createAction('BOOKING/BY_MEMBER/ERROR'),
};

type FetchBookingsByMemberProps = {
  member: number;
  page?: number;
  page_size: number;
  filters: any;
  options: OptionCallback;
  current_booking_id?: number;
};

export function fetchBookingsByMember({
  member,
  page,
  page_size,
  filters,
  options,
  current_booking_id,
}: FetchBookingsByMemberProps) {
  return async (dispatch: Dispatch) => {
    dispatch(byMemberActions.isLoading(true));
    dispatch(byMemberActions.error(null));

    try {
      const response = await fetchBookingListAPI({
        member,
        page,
        page_size,
        ...filters,
        current_item_id: current_booking_id,
      });
      const current_page = response.data?.page ?? page;
      dispatch(
        byMemberActions.success({ ...response.data, page: current_page }),
      );
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      dispatch(byMemberActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(byMemberActions.isLoading(false));
  };
}

export const fetchFutureBookingsByMemberActions = {
  success: createAction<{ memberId: number; bookings: Booking[] }>(
    'FUTURE_BOOKINGS/BY_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>('FUTURE_BOOKINGS/BY_MEMBER/IS_LOADING'),
  error: createAction<Error | null>('FUTURE_BOOKINGS/BY_MEMBER/ERROR'),
};

export function fetchFutureBookingsByMember(
  member: number,
  options: OptionCallback<Booking[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchFutureBookingsByMemberActions.isLoading(true));
    dispatch(fetchFutureBookingsByMemberActions.error(null));
    try {
      const response = await fetchBookingListAPI({
        member,
        page_size: 30,
        // @ts-expect-error
        booking_status_code: 0,
        future_booking: true,
      });
      dispatch(
        fetchFutureBookingsByMemberActions.success({
          memberId: member,
          // @ts-expect-error
          bookings: response.data.results,
        }),
      );
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      dispatch(fetchFutureBookingsByMemberActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(fetchFutureBookingsByMemberActions.isLoading(false));
  };
}

export const byConsumerPackActions = {
  success: createAction('BOOKING/BY_CONSUMER_PACK/SUCCESS'),
  isLoading: createAction('BOOKING/BY_CONSUMER_PACK/IS_LOADING'),
  error: createAction('BOOKING/BY_CONSUMER_PACK/ERROR'),
};

export function fetchBookingsByConsumerPack(
  consumer_payment_pack: number,
  page: number,
  page_size: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(byConsumerPackActions.isLoading(true));
    dispatch(byConsumerPackActions.error(null));

    try {
      const response = await fetchBookingListAPI({
        // @ts-expect-error
        consumer_payment_pack,
        page,
        page_size,
      });
      dispatch(byConsumerPackActions.success({ ...response.data, page }));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      dispatch(byConsumerPackActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(byConsumerPackActions.isLoading(false));
  };
}

export const byOfferActions = {
  success: createAction('BOOKING/BY_OFFER/SUCCESS'),
  isLoading: createAction('BOOKING/BY_OFFER/IS_LOADING'),
  error: createAction('BOOKING/BY_OFFER/ERROR'),
};

export function fetchBookingsByOffer(
  offer: number,
  options?: OptionCallback<BookingREST[]>,
  ordering_field: any = null,
  params: any = {},
) {
  return async (dispatch: Dispatch) => {
    dispatch(byOfferActions.isLoading(true));
    dispatch(refreshBookingsByOffer(offer, options, ordering_field, params));
  };
}

export function refreshBookingsByOffer(
  offer: number,
  options: OptionCallback<BookingREST[]>,
  ordering_field: any = null,
  params: any = {},
) {
  return async (dispatch: Dispatch) => {
    dispatch(byOfferActions.error(null));

    try {
      const order_filter: any = {};
      if (ordering_field) {
        order_filter.ordering = ordering_field;
      }
      const response = await fetchBookingListAPI({
        ...order_filter,
        in_offer: offer,
        page_size: 300,
        ...(params || {}),
      });
      dispatch(byOfferActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      dispatch(byOfferActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(byOfferActions.isLoading(false));
  };
}

const registerActions = {
  success: createAction('BOOKING/REGISTER/SUCCESS'),
  isLoading: createAction('BOOKING/REGISTER/IS_LOADING'),
  error: createAction('BOOKING/REGISTER/ERROR'),
};

export function registerBooking(
  consumer_payment_pack: number,
  data: {
    offer: number | Array<number>;
    keep_credits: boolean;
    notify_member: boolean;
    spot_id?: number;
    auto_assign_spot?: boolean;
  },
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(registerActions.isLoading(true));
    dispatch(registerActions.error(null));

    try {
      const response = await registerBookingAPI(consumer_payment_pack, data);
      const booking = response.data;
      dispatch(registerActions.success(booking));

      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(booking);
      }
    } catch (err) {
      console.error(err);
      dispatch(registerActions.error(err));
      if (isErrorWithCustomCode(err) && err.response.data?.error_code) {
        let translationKey = '';
        switch (err.response.data.error_code) {
          case EXCEPTION_STAFF_ROLE_OVERBOOKING_NOT_ALLOWED:
            translationKey = 'role.noMasterControl.overbookingNotAllowed';
            break;
          case LOCK_ACQUISITION_FAILURE_SPOT_SCHEDULING:
            translationKey = `canNotBuyErrorCode.${LOCK_ACQUISITION_FAILURE_SPOT_SCHEDULING}`;
            break;
          case LOCK_ACQUISITION_FAILURE_GENERIC:
            translationKey = `canNotBuyErrorCode.${LOCK_ACQUISITION_FAILURE_GENERIC}`;
            break;
          case SPOT_NOT_AVAILABLE:
            translationKey = `canNotBuyErrorCode.${SPOT_NOT_AVAILABLE}`;
            break;
          default:
            translationKey = 'canNotBuyErrorCode.generic';
            break;
        }
        dispatch(snackbarError(translationKey));
      }
      if (options && options.onError) {
        options.onError(err);
      }
    }
  };
}

const registerTabletActions = {
  success: createAction('BOOKING/TABLET_CHECK_IN/SUCCESS'),
  isLoading: createAction('BOOKING/TABLET_CHECK_IN/IS_LOADING'),
  error: createAction('BOOKING/TABLET_CHECK_IN/ERROR'),
};

export function registerTabletBooking(
  consumer_payment_pack: number,
  offer: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(registerTabletActions.isLoading(true));
    dispatch(registerTabletActions.error(null));

    try {
      const response = await registerTabletBookingAPI({
        consumer_payment_pack,
        offer,
      });

      dispatch(registerTabletActions.success(response.data));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(registerTabletActions.error(err));
      const bookingError = err.response?.data?.error;
      if (ALL_ERROR_CODES.includes(bookingError)) {
        dispatch(snackbarError(`canNotBuyErrorCode.${bookingError}`));
      } else {
        dispatch(snackbarError(`canNotBuyErrorCode.generic`));
      }
      if (options && options.onError) {
        options.onError(err);
      }
    } finally {
      dispatch(registerTabletActions.isLoading(false));
    }
  };
}

export const bulkActions = {
  success: createAction('BOOKING/BULK/SUCCESS'),
  isLoading: createAction('BOOKING/BULK/IS_LOADING'),
  error: createAction('BOOKING/BULK/ERROR'),
};

export function fetchBookingBulk(ids: Array<number>, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(bulkActions.isLoading(true));
    dispatch(bulkActions.error(null));

    try {
      // @ts-expect-error
      const response = await fetchBookingListAPI({
        ids_in: ids,
        page_size: ids.length,
      });
      dispatch(bulkActions.success(response.data.results));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      dispatch(bulkActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(bulkActions.isLoading(false));
  };
}

export const listRecurrenceRuleBookingActions = {
  isLoading: createAction('RECURENCE_RULE_BOOKING/LIST/IS_LOADING'),
  error: createAction('RECURENCE_RULE_BOOKING/LIST/ERROR'),
  success: createAction('RECURENCE_RULE_BOOKING/LIST/SUCCESS'),
};

export function fetchRecurrenceRuleBooking(
  params: any = {},
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listRecurrenceRuleBookingActions.isLoading(true));
    dispatch(listRecurrenceRuleBookingActions.error(null));
    try {
      const response = await fetchRecurrenceRuleBookingListAPI({
        ...params,
      });
      dispatch(
        listRecurrenceRuleBookingActions.success({
          // @ts-expect-error
          ...response.data,
          page: params.page,
        }),
      );

      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data.results);
      }
    } catch (error) {
      console.error(error);
      dispatch(listRecurrenceRuleBookingActions.error(error));

      if (options && options.onError) options.onError(error);
    }
    dispatch(listRecurrenceRuleBookingActions.isLoading(false));
  };
}

export const createRecurrenceRuleBookingActions = {
  isLoading: createAction('RECURENCE_RULE_BOOKING/CREATE/IS_LOADING'),
  error: createAction('RECURENCE_RULE_BOOKING/CREATE/ERROR'),
  success: createAction('RECURENCE_RULE_BOOKING/CREATE/SUCCESS'),
};

export function createRecurrenceRuleBooking(
  data: any,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createRecurrenceRuleBookingActions.isLoading(true));
    dispatch(createRecurrenceRuleBookingActions.error(null));
    try {
      const response = await createRecurrenceRuleBookingAPI(data);

      dispatch(createRecurrenceRuleBookingActions.success(response.data));
      dispatch(snackbarSuccess('booking:recurrenceRule.createModal.success'));

      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(createRecurrenceRuleBookingActions.error(error));
      if (error.response && error.response.status === 423) {
        dispatch(snackbarError('booking:recurrenceRule.createModal.info'));
      }
      if (options && options.onError) options.onError(error);
    }

    dispatch(createRecurrenceRuleBookingActions.isLoading(false));
  };
}

export const deleteRecurrenceRuleBookingActions = {
  isLoading: createAction('RECURENCE_RULE_BOOKING/DELETE/IS_LOADING'),
  error: createAction('RECURENCE_RULE_BOOKING/DELETE/ERROR'),
  success: createAction('RECURENCE_RULE_BOOKING/DELETE/SUCCESS'),
};

export function deleteRecurrenceRuleBooking(
  id: number,
  data: any,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteRecurrenceRuleBookingActions.isLoading(true));
    dispatch(deleteRecurrenceRuleBookingActions.error(null));
    try {
      const response = await deleteRecurrenceRuleBookingAPI(id, data);
      dispatch(deleteRecurrenceRuleBookingActions.success(response.data));
      dispatch(snackbarSuccess('booking:recurrenceRule.deleteModal.success'));

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(deleteRecurrenceRuleBookingActions.error(error));

      if (options && options.onError) options.onError(error);
    }
    dispatch(deleteRecurrenceRuleBookingActions.isLoading(false));
  };
}

export const updateRecurrenceRuleBookingActions = {
  isLoading: createAction('RECURENCE_RULE_BOOKING/EDIT/IS_LOADING'),
  error: createAction('RECURENCE_RULE_BOOKING/EDIT/ERROR'),
  success: createAction('RECURENCE_RULE_BOOKING/EDIT/SUCCESS'),
};

export function updateRecurrenceRuleBooking(
  data: any,
  id: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateRecurrenceRuleBookingActions.isLoading(true));
    dispatch(updateRecurrenceRuleBookingActions.error(null));
    try {
      const response = await updateRecurrenceRuleBookingAPI(data, id);
      dispatch(updateRecurrenceRuleBookingActions.success(response.data));
      dispatch(snackbarSuccess('booking:recurrenceRule.editModal.success'));

      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 423) {
        dispatch(snackbarError('booking:recurrenceRule.createModal.info'));
      }
      dispatch(updateRecurrenceRuleBookingActions.error(error));

      if (options && options.onError) options.onError(error);
    }
    dispatch(updateRecurrenceRuleBookingActions.isLoading(false));
  };
}

export const fetchSimilarFuturBookingInGroupActions = {
  isLoading: createAction('BOOKING/SIMILAR_IN_GROUP/IS_LOADING'),
  error: createAction('BOOKING/SIMILAR_IN_GROUP/ERROR'),
  success: createAction('BOOKING/SIMILAR_IN_GROUP/SUCCESS'),
};

export function fetchSimilarFuturBookingInGroup(
  bookingId: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchSimilarFuturBookingInGroupActions.isLoading(true));
    dispatch(fetchSimilarFuturBookingInGroupActions.error(null));
    try {
      const response = await fetchOfferGroupRelatedBookingsAPI(bookingId);

      dispatch(fetchSimilarFuturBookingInGroupActions.success(response.data));

      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(fetchSimilarFuturBookingInGroupActions.error(error));

      if (options && options.onError) options.onError(error);
    }
    dispatch(fetchSimilarFuturBookingInGroupActions.isLoading(false));
  };
}

export const retrieveOfferWithCancelledBookingsActions = {
  isLoading: createAction<boolean>(
    'RECURENCE_RULE_BOOKING/RETRIEVE_OFFER_WITH_CANCELLED_BOOKING/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'RECURENCE_RULE_BOOKING/RETRIEVE_OFFER_WITH_CANCELLED_BOOKING/ERROR',
  ),
  success: createAction<Offer[]>(
    'RECURENCE_RULE_BOOKING/RETRIEVE_OFFER_WITH_CANCELLED_BOOKING/SUCCESS',
  ),
};

export function retrieveOfferWithCancelledBookings(
  recurrenceRuleBookingId: number,
  options?: OptionCallback<Offer[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveOfferWithCancelledBookingsActions.isLoading(true));
    dispatch(retrieveOfferWithCancelledBookingsActions.error(null));
    try {
      const response = await retrieveOfferWithCancelledBookingsAPI(
        recurrenceRuleBookingId,
      );

      dispatch(
        retrieveOfferWithCancelledBookingsActions.success(response.data),
      );

      options?.onSuccess?.(response.data);
    } catch (error) {
      console.error(error);
      dispatch(retrieveOfferWithCancelledBookingsActions.error(error));

      options?.onError?.(error);
    }
    dispatch(retrieveOfferWithCancelledBookingsActions.isLoading(false));
  };
}

export const updateOfferWithCancelledBookingsToRetryActions = {
  isLoading: createAction<boolean>(
    'RECURENCE_RULE_BOOKING/UPDATE_OFFER_WITH_CANCELLED_BOOKING_TO_RETRY/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'RECURENCE_RULE_BOOKING/UPDATE_OFFER_WITH_CANCELLED_BOOKING_TO_RETRY/ERROR',
  ),
  success: createAction<number>(
    'RECURENCE_RULE_BOOKING/UPDATE_OFFER_WITH_CANCELLED_BOOKING_TO_RETRY/SUCCESS',
  ),
};

export function updateOfferWithCancelledBookingsToRetry(
  recurrenceRuleBookingId: number,
  offer_ids: number[],
  options?: OptionCallback<number>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateOfferWithCancelledBookingsToRetryActions.isLoading(true));
    dispatch(updateOfferWithCancelledBookingsToRetryActions.error(null));
    try {
      const response = await updateOfferWithCancelledBookingsToRetryAPI(
        recurrenceRuleBookingId,
        offer_ids,
      );

      dispatch(
        updateOfferWithCancelledBookingsToRetryActions.success(response.data),
      );

      options?.onSuccess?.(response.data);
    } catch (error) {
      console.error(error);
      dispatch(updateOfferWithCancelledBookingsToRetryActions.error(error));

      options?.onError?.(error);
    }
    dispatch(updateOfferWithCancelledBookingsToRetryActions.isLoading(false));
  };
}
