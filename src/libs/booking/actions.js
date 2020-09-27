// @flow
import { createAction } from 'redux-actions';
import moment from 'moment-timezone';

import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';

import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';

import {
  fetchBookingList as fetchBookingListAPI,
  retrieveBooking as retrieveBookingAPI,
  confirmAttendance as confirmAttendanceAPI,
  discardAttendance as discardAttendanceAPI,
  cancelBooking as cancelBookingAPI,
  registerBooking as registerBookingAPI,
  fetchBookingBroadcastRoom as fetchBookingBroadcastRoomAPI,
  fetchFirstTimeNotifications as fetchFirstTimeNotificationsAPI,
  createFirstTimeNotifications as createFirstTimeNotificationsAPI,
  deleteFirstTimeNotifications as deleteFirstTimeNotificationsAPI,
  updateFirstTimeNotifications as updateFirstTimeNotificationsAPI,
  fetchRecurrenceRuleBookingList as fetchRecurrenceRuleBookingListAPI,
  createRecurrenceRuleBooking as createRecurrenceRuleBookingAPI,
  deleteRecurrenceRuleBooking as deleteRecurrenceRuleBookingAPI,
  updateRecurrenceRuleBooking as updateRecurrenceRuleBookingAPI,
} from './api';
import { createDictionnaryById, createIdList } from '../../actions/utils';

import type { Dispatch } from '../../state/types';

export const retrieveActions = {
  success: createAction('BOOKING/RETRIEVE/SUCCESS'),
  isLoading: createAction('BOOKING/RETRIEVE/IS_LOADING'),
  error: createAction('BOOKING/RETRIEVE/ERROR'),
};

export function retrieveBooking(id: number, options: OptionCallback) {
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
  isLoading: createAction('BOOKING/UPDATE/IS_LOADING'),
  error: createAction('BOOKING/UDPATE/ERROR'),
};

function updateBooking(
  id: number,
  data: any,
  options: OptionCallback,
  apiCall: any,
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

export const discardAttendance = (id, options) =>
  updateBooking(id, {}, options, discardAttendanceAPI);
export const confirmAttendance = (id, options) =>
  updateBooking(id, {}, options, confirmAttendanceAPI);
export const cancelBooking = (id, data, options) =>
  updateBooking(id, data, options, cancelBookingAPI);

export const asConsumerActions = {
  success: createAction('BOOKING/AS_CONSUMER/SUCCESS'),
  isLoading: createAction('BOOKING/AS_CONSUMER/IS_LOADING'),
  error: createAction('BOOKING/AS_CONSUMER/ERROR'),
};

export function fetchBookingsAsConsumer(
  member: number,
  page: number,
  page_size: number,
  options: OptionCallback,
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
  page: ?number,
  page_size: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch, getState: () => void) => {
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
        min_date: moment().format('YYYY-MM-DD'),
        booking_status_code: BOOKING_STATUS_OK.id,
        ordering: 'offer__date_start',
      });
      dispatch(consumerDashboardActions.success({ ...response.data, page }));
      if (options && options.onSuccess) {
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

export function fetchBookingsByMember(
  member: number,
  page: number,
  page_size: number,
  filters,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(byMemberActions.isLoading(true));
    dispatch(byMemberActions.error(null));

    try {
      const response = await fetchBookingListAPI({
        member,
        page,
        page_size,
        ...filters,
      });
      dispatch(byMemberActions.success({ ...response.data, page }));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      dispatch(byMemberActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(byMemberActions.isLoading(false));
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
        consumer_payment_pack,
        page,
        page_size,
      });
      dispatch(byConsumerPackActions.success({ ...response.data, page }));
      if (options && options.onSuccess) {
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
  offer,
  options,
  ordering_field = null,
  params: any = {},
) {
  return async (dispatch: Dispatch) => {
    dispatch(byOfferActions.isLoading(true));
    dispatch(refreshBookingsByOffer(offer, options, ordering_field, params));
  };
}

export function refreshBookingsByOffer(
  offer,
  options,
  ordering_field = null,
  params: any = {},
) {
  return async (dispatch: Dispatch) => {
    dispatch(byOfferActions.error(null));

    try {
      const order_filter = {};
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

export const registerActions = {
  success: createAction('BOOKING/REGISTER/SUCCESS'),
  isLoading: createAction('BOOKING/REGISTER/IS_LOADING'),
  error: createAction('BOOKING/REGISTER/ERROR'),
};

export function registerBooking(
  consumer_payment_pack: number,
  data: {
    offer: number | Array<number>,
    keep_credits: boolean,
    notify_member: boolean,
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
        options.onSuccess(booking);
      }
    } catch (err) {
      console.error(err);
      dispatch(registerActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
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
      const response = await fetchBookingListAPI({
        ids_in: ids,
        page_size: ids.length,
      });
      dispatch(bulkActions.success(response.data.results));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      dispatch(bulkActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(bulkActions.isLoading(false));
  };
}

export const notificationListActions = {
  isLoading: createAction('NOTIFICATION/LIST/IS_LOADING'),
  error: createAction('NOTIFICATION/LIST/ERROR'),
  success: createAction('NOTIFICATION/LIST/SUCCESS'),
};

export function fetchFirstTimeNotifications(params: Object, options?: any) {
  return async (dispatch: Dispatch) => {
    dispatch(notificationListActions.isLoading(true));
    dispatch(notificationListActions.error(null));
    try {
      const response = await fetchFirstTimeNotificationsAPI(params);
      dispatch(
        notificationListActions.success({
          notifDict: createDictionnaryById(response.data),
          notifIdList: createIdList(response.data),
        }),
      );
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(notificationListActions.error(error));
    }
    dispatch(notificationListActions.isLoading(false));
  };
}

export const notificationCreateActions = {
  isLoading: createAction('NOTIFICATION/CREATE/IS_LOADING'),
  error: createAction('NOTIFICATION/CREATE/ERROR'),
  success: createAction('NOTIFICATION/CREATE/SUCCESS'),
};

export function createFirstTimeNotification(
  data: any,
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
) {
  return async (dispatch: Dispatch) => {
    dispatch(notificationCreateActions.isLoading(true));
    dispatch(notificationCreateActions.error(null));
    try {
      const response = await createFirstTimeNotificationsAPI(data);
      dispatch(notificationCreateActions.success(response.data));
      dispatch(snackbarSuccess('bookingNotification.createOrUpdate.success'));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(notificationCreateActions.error(error));
      dispatch(snackbarError('bookingNotification.createOrUpdate.error'));
      if (options && options.onError) options.onError();
    }
    dispatch(notificationCreateActions.isLoading(false));
  };
}

export const notificationDeleteActions = {
  isLoading: createAction('NOTIFICATION/DELETE/IS_LOADING'),
  error: createAction('NOTIFICATION/DELETE/ERROR'),
  success: createAction('NOTIFICATION/DELETE/SUCCESS'),
};

export function deleteFirstTimeNotification(
  notificationId: any,
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
) {
  return async (dispatch: Dispatch) => {
    dispatch(notificationDeleteActions.isLoading(true));
    dispatch(notificationDeleteActions.error(null));
    try {
      await deleteFirstTimeNotificationsAPI(notificationId);
      dispatch(notificationDeleteActions.success(notificationId));
      dispatch(snackbarSuccess('bookingNotification.delete.success'));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(notificationDeleteActions.error(error));
      dispatch(snackbarError('bookingNotification.delete.error'));
      if (options && options.onError) options.onError();
    }
    dispatch(notificationDeleteActions.isLoading(false));
  };
}

export const notificationUpdateActions = {
  isLoading: createAction('NOTIFICATION/PATCH/IS_LOADING'),
  error: createAction('NOTIFICATION/PATCH/ERROR'),
  success: createAction('NOTIFICATION/PATCH/SUCCESS'),
};

export function updateFirstTimeNotification(
  data: any,
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
) {
  return async (dispatch: Dispatch) => {
    dispatch(notificationUpdateActions.isLoading(data.id));
    dispatch(notificationUpdateActions.error(null));
    try {
      const response = await updateFirstTimeNotificationsAPI(data);
      dispatch(notificationUpdateActions.success(response.data));
      dispatch(snackbarSuccess('bookingNotification.createOrUpdate.success'));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(notificationUpdateActions.error(error));
      dispatch(snackbarError('bookingNotification.createOrUpdate.error'));
      if (options && options.onError) options.onError();
    }
    dispatch(notificationUpdateActions.isLoading(null));
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
      const response = await fetchRecurrenceRuleBookingListAPI(params);
      dispatch(listRecurrenceRuleBookingActions.success(response.data));

      if (options && options.onSuccess) {
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

export function createRecurrenceRuleBooking(data: *, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(createRecurrenceRuleBookingActions.isLoading(true));
    dispatch(createRecurrenceRuleBookingActions.error(null));
    try {
      const response = await createRecurrenceRuleBookingAPI(data);
      dispatch(createRecurrenceRuleBookingActions.success(response.data));

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(createRecurrenceRuleBookingActions.error(error));

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
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteRecurrenceRuleBookingActions.isLoading(true));
    dispatch(deleteRecurrenceRuleBookingActions.error(null));
    try {
      const response = await deleteRecurrenceRuleBookingAPI(id);
      dispatch(deleteRecurrenceRuleBookingActions.success(response.data));

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
  isLoading: createAction('RECURENCE_RULE_BOOKING/DELETE/IS_LOADING'),
  error: createAction('RECURENCE_RULE_BOOKING/DELETE/ERROR'),
  success: createAction('RECURENCE_RULE_BOOKING/DELETE/SUCCESS'),
};

export function updateRecurrenceRuleBooking(data: *, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(updateRecurrenceRuleBookingActions.isLoading(true));
    dispatch(updateRecurrenceRuleBookingActions.error(null));
    try {
      const response = await updateRecurrenceRuleBookingAPI(data);
      dispatch(updateRecurrenceRuleBookingActions.success(response.data));

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(updateRecurrenceRuleBookingActions.error(error));

      if (options && options.onError) options.onError(error);
    }
    dispatch(updateRecurrenceRuleBookingActions.isLoading(false));
  };
}
