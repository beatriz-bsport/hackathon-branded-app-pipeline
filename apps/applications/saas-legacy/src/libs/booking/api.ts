import type { Offer } from '#src/libs/offer/types';
import { PaginatedResponse } from '../../state/types';
import { cleanParams } from '../../utils/createUrlHandlers';
import {
  buildUrlParams,
  getAuth,
  postAuth,
  deleteAuth,
  patchAuth,
} from '../../http';
import {
  Booking,
  BookingREST,
  BookingFilterParams,
  CancelBookingParams,
} from './types';

import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_BOOK_V1;
const API_V1_URI_BUYABLE = Config.REACT_APP_BASE_URI_BUYABLE_V1;

export const fetchFilteredBookingOptions = (params: any) => {
  return getAuth(
    `${API_V1_URI}/waiting-list/booking-option/${buildUrlParams(params)}`,
  );
};
/**
 * @deprecated This version is not type safe.
 */
export const fetchBookingList = (params: any) => {
  const cleanedParams = cleanParams(params);
  return getAuth<PaginatedResponse<Booking>>(
    `${API_V1_URI}/booking/${buildUrlParams(cleanedParams)}`,
  );
};

export const fetchBookingListV2 = (params: BookingFilterParams) => {
  const cleanedParams = cleanParams(params);
  return getAuth<PaginatedResponse<BookingREST>>(
    `${API_V1_URI}/booking/${buildUrlParams(cleanedParams)}`,
  );
};

export const fetchOfferGroupRelatedBookings = (bookingId: number) => {
  return getAuth(
    `${API_V1_URI}/booking/${bookingId}/get_offer_group_related_bookings/`,
  );
};
export const retrieveBooking = (id: number) => {
  return getAuth<BookingREST>(`${API_V1_URI}/booking/${id}/`);
};

export const fetchBookingBroadcastRoom = (id: number) => {
  return getAuth(`${API_V1_URI}/booking/${id}/broadcast_room/`);
};

export const discardAttendance = (id: number) => {
  return postAuth(`${API_V1_URI}/booking/${id}/attendance/`, {
    attendance: false,
  });
};

export const confirmAttendance = (id: number) => {
  return postAuth(`${API_V1_URI}/booking/${id}/attendance/`, {
    attendance: true,
  });
};

export const cancelBooking = (id: number, data: any = {}) => {
  return postAuth(`${API_V1_URI}/booking/${id}/cancel/`, data);
};

export const cancelBookingV2 = (
  id: number,
  params: Omit<CancelBookingParams, 'bookingId'>,
) => {
  return postAuth<BookingREST>(`${API_V1_URI}/booking/${id}/cancel/`, params);
};

export const cancelMultipleBooking = (data: any = {}) => {
  return postAuth(`${API_V1_URI}/booking/cancel_multiple_offers/`, data);
};

export const setSpotForMember = (id: number, data: any = {}) => {
  return postAuth(`${API_V1_URI}/booking/${id}/set_spot_for_member/`, data);
};

export const registerBooking = (
  consumer_payment_pack: number,
  data: {
    offer: number | Array<number>;
    keep_credits: boolean;
    notify_member: boolean;
    spot_id?: number;
    auto_assign_spot?: boolean;
  },
) => {
  return postAuth(
    `${API_V1_URI_BUYABLE}/payment-pack/consumer-payment-pack/${consumer_payment_pack}/register_booking/`,
    data,
  );
};

export const registerTabletBooking = (data: {
  consumer_payment_pack: number;
  offer: number;
}) => {
  return postAuth<{
    success: boolean;
    booked_offers: number[];
    error?: string;
    offer_id?: number;
  }>(`${API_V1_URI}/tablet-booking/book/`, data);
};

export function fetchRecurrenceRuleBookingList(params: any = {}) {
  return getAuth(
    `${API_V1_URI}/booking/recurrence_rule_booking/${buildUrlParams(params)}`,
  );
}

export function createRecurrenceRuleBooking(data: any) {
  return postAuth(`${API_V1_URI}/booking/recurrence_rule_booking/`, data);
}

export function deleteRecurrenceRuleBooking(id: number, data: any) {
  return deleteAuth(
    `${API_V1_URI}/booking/recurrence_rule_booking/${id}/`,
    data,
  );
}

export function updateRecurrenceRuleBooking(data: any, id: number) {
  return patchAuth(
    `${API_V1_URI}/booking/recurrence_rule_booking/${id}/`,
    data,
  );
}

export function retrieveOfferWithCancelledBookings(id: number) {
  return getAuth<Offer[]>(
    `${API_V1_URI}/booking/recurrence_rule_booking/${id}/get_offers_to_rebook/`,
  );
}

export function updateOfferWithCancelledBookingsToRetry(
  id: number,
  offer_ids: number[],
) {
  return postAuth<number>(
    `${API_V1_URI}/booking/recurrence_rule_booking/${id}/update_recurrence_booking_offers_to_retry/`,
    { offer_ids },
  );
}

/**
 * Refund endpoint for a specific booking. Note that this is a **manager only** action.
 * @param id The ID of the booking to refund
 * @see {@link refundBookingAsManager}
 */
export const refundBooking = (id: number) => {
  return patchAuth<BookingREST>(`${API_V1_URI}/booking/${id}/refund/`, {});
};

export const swapBookingPass = (
  id: number,
  data: { consumer_payment_pack_id: number },
) => {
  return postAuth<BookingREST>(`${API_V1_URI}/booking/${id}/swap_pass/`, {
    consumer_payment_pack_id: data.consumer_payment_pack_id,
  });
};
