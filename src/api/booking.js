import { API_URI, API_V1_URI, postAuth, getAuth, deleteAuth } from '../http';

// FETCHER

export async function fetchBookingsByOffer(offerId) {
  return getAuth(`${API_URI}/saas/offer/${offerId}/bookings`);
}

export async function fetchOptionsByOffer(offerId) {
  return getAuth(`${API_V1_URI}/waiting-list/booking-option/?offer=${offerId}`);
}

export async function fetchBookingsByMember(memberId) {
  return getAuth(`${API_URI}/saas/members/${memberId}/bookings`);
}

export async function fetchOptionsByMember(memberId) {
  return getAuth(`${API_URI}/saas/members/${memberId}/options`);
}

// BOOKING ACTION
export async function confirmAttendanceBooking(bookingId) {
  return getAuth(`${API_URI}/saas/booking/${bookingId}/attendance/confirm`);
}

export async function discardAttendanceBooking(bookingId) {
  return getAuth(`${API_URI}/saas/booking/${bookingId}/attendance/discard`);
}

export async function validateBooking(bookingId) {
  return getAuth(`${API_URI}/saas/booking/${bookingId}/confirm`);
}

export async function checkOptionExistence(offerId) {
  return getAuth(
    `${API_V1_URI}/waiting-list/booking-option/exists/?offer=${offerId}`,
  );
}

export async function discardBooking(bookingId) {
  return deleteAuth(`${API_URI}/saas/booking/${bookingId}/discard`);
}

// BOOKING OPTION ACTION
export async function discardBookingOption(optionId) {
  return postAuth(
    `${API_V1_URI}/waiting-list/booking-option/${optionId}/discard/`,
  );
}

export async function addToOffer({ consumerPaymentPackId, offerId }) {
  return postAuth(`${API_URI}/payment/register/booking/${offerId}`, {
    consumer_payment_pack: consumerPaymentPackId,
  });
}

export default {
  fetchOptionsByOffer,
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
};
