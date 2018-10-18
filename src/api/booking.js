import { API_URI, getAuth } from '../http';

// FETCHER

export async function fetchBookingsByOffer(offerId) {
  return getAuth(`${API_URI}/saas/offer/${offerId}/bookings`);
}

export async function fetchMemberBookings(memberId) {
  return getAuth(`${API_URI}/saas/members/${memberId}/bookings`);
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

export async function discardBooking(bookingId) {
  return getAuth(`${API_URI}/saas/booking/${bookingId}/discard`);
}

// BOOKING OPTION ACTION
export async function discardBookingOption(optionId) {
  return getAuth(`${API_URI}/saas/booking-option/${optionId}/discard`);
}

export default {
  fetchBookingsByOffer,
  fetchMemberBookings,
  discard: discardBooking,
  validate: validateBooking,
  discardAttendance: discardAttendanceBooking,
  confirmAttendance: confirmAttendanceBooking,
  discardBookingOption,
};
