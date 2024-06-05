import type { Offer } from '#libs/offer/types';
import { PaginatedResponse } from '../../state/types';
import { cleanParams } from '../../utils/createUrlHandlers';
import {
  buildUrlParams,
  API_V1_URI,
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

export const fetchFilteredBookingOptions = async (params: any) => {
  return getAuth(
    `${API_V1_URI}/waiting-list/booking-option/${buildUrlParams(params)}`,
  );
};
/**
 * @deprecated This version is not type safe.
 */
export const fetchBookingList = async (params: any) => {
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

export const fetchOfferGroupRelatedBookings = async (bookingId: number) => {
  return getAuth(
    `${API_V1_URI}/booking/${bookingId}/get_offer_group_related_bookings/`,
  );
};
export const retrieveBooking = async (id: number) => {
  return getAuth(`${API_V1_URI}/booking/${id}/`);
};

export const fetchBookingBroadcastRoom = async (id: number) => {
  return getAuth(`${API_V1_URI}/booking/${id}/broadcast_room/`);
};

export const discardAttendance = async (id: number) => {
  return postAuth(`${API_V1_URI}/booking/${id}/attendance/`, {
    attendance: false,
  });
};

export const confirmAttendance = async (id: number) => {
  return postAuth(`${API_V1_URI}/booking/${id}/attendance/`, {
    attendance: true,
  });
};

export const cancelBooking = async (id: number, data: any = {}) => {
  return postAuth(`${API_V1_URI}/booking/${id}/cancel/`, data);
};

export const cancelBookingV2 = (
  id: number,
  params: Omit<CancelBookingParams, 'bookingId'>,
) => {
  return postAuth<BookingREST>(`${API_V1_URI}/booking/${id}/cancel/`, params);
};

export const cancelMultipleBooking = async (data: any = {}) => {
  return postAuth(`${API_V1_URI}/booking/cancel_multiple_offers/`, data);
};

export const setSpotForMember = async (id: number, data: any = {}) => {
  return postAuth(`${API_V1_URI}/booking/${id}/set_spot_for_member/`, data);
};

export const registerBooking = async (
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
    `${API_V1_URI}/payment-pack/consumer-payment-pack/${consumer_payment_pack}/register_booking/`,
    data,
  );
};

export async function fetchRecurrenceRuleBookingList(params: any = {}) {
  return getAuth(
    `${API_V1_URI}/booking/recurrence_rule_booking/${buildUrlParams(params)}`,
  );
}

export async function createRecurrenceRuleBooking(data: any) {
  return postAuth(`${API_V1_URI}/booking/recurrence_rule_booking/`, data);
}

export async function deleteRecurrenceRuleBooking(id: number, data: any) {
  return deleteAuth(
    `${API_V1_URI}/booking/recurrence_rule_booking/${id}/`,
    data,
  );
}

export async function updateRecurrenceRuleBooking(data: any, id: number) {
  return patchAuth(
    `${API_V1_URI}/booking/recurrence_rule_booking/${id}/`,
    data,
  );
}

export async function retrieveOfferWithCancelledBookings(id: number) {
  return getAuth<Offer[]>(
    `${API_V1_URI}/booking/recurrence_rule_booking/${id}/get_offers_to_rebook/`,
  );
}

export async function updateOfferWithCancelledBookingsToRetry(
  id: number,
  offer_ids: number[],
) {
  return postAuth<number>(
    `${API_V1_URI}/booking/recurrence_rule_booking/${id}/update_recurrence_booking_offers_to_retry/`,
    { offer_ids },
  );
}
