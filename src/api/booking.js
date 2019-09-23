// @flow
import { API_URI, API_V1_URI, postAuth, getAuth, deleteAuth } from '../http';

// FETCHER

export async function fetchBookingsByOffer(offerId: number) {
  return getAuth(`${API_URI}/saas/offer/${offerId}/bookings`);
}

export async function fetchBookingsByMember(memberId: number) {
  return getAuth(`${API_URI}/saas/members/${memberId}/bookings`);
}

export async function fetchOptionsByMember(memberId: number) {
  return getAuth(`${API_URI}/saas/members/${memberId}/options`);
}

// BOOKING ACTION
export async function confirmAttendanceBooking(bookingId: number) {
  return getAuth(`${API_URI}/saas/booking/${bookingId}/attendance/confirm`);
}

export async function discardAttendanceBooking(bookingId: number) {
  return getAuth(`${API_URI}/saas/booking/${bookingId}/attendance/discard`);
}

export async function validateBooking(bookingId: number) {
  return getAuth(`${API_URI}/saas/booking/${bookingId}/confirm`);
}

export async function discardBooking(bookingId: number) {
  return deleteAuth(`${API_URI}/saas/booking/${bookingId}/discard`);
}

export async function checkOptionExistence(offerId: number) {
  return getAuth(
    `${API_V1_URI}/waiting-list/booking-option/exists/?offer=${offerId}`,
  );
}

export async function registerToWaitingList(offer: number, member: number) {
  return postAuth(`${API_V1_URI}/waiting-list/booking-option/register/`, {
    offer,
    member,
  });
}

// BOOKING OPTION ACTION
export async function discardBookingOption(optionId: number) {
  return postAuth(
    `${API_V1_URI}/waiting-list/booking-option/${optionId}/discard/`,
  );
}

export async function addToOffer({
  consumerPaymentPackId,
  offerId,
}: {
  consumerPaymentPackId: number,
  offerId: number,
}) {
  return postAuth(`${API_URI}/payment/register/booking/${offerId}`, {
    consumer_payment_pack: consumerPaymentPackId,
  });
}

export default {
  fetchBookingsByOffer,
  fetchBookingsByMember,
  fetchOptionsByMember,
  discard: discardBooking,
  validate: validateBooking,
  discardAttendance: discardAttendanceBooking,
  confirmAttendance: confirmAttendanceBooking,
  discardBookingOption,
  checkOptionExistence,
  addToOffer,
  registerToWaitingList,
};
