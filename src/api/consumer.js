import { API_URI, getAuth, deleteAuth } from '../http';

export async function fetchConsumerOptions() {
  return getAuth(`${API_URI}/booking/options/`);
}

export async function fetchConsumerPastBookings() {
  return getAuth(`${API_URI}/booking/past/`);
}

export async function fetchConsumerFutureBookings() {
  return getAuth(`${API_URI}/booking/future/`);
}

export async function fetchConsumerPaymentPacks() {
  return getAuth(`${API_URI}/consumer/payment-pack/`);
}

export async function consumerFetchProfile() {
  return getAuth(`${API_URI}/user/self/info/`);
}

export async function discardBookingOption(optionId) {
  return getAuth(`${API_URI}/saas/booking-option/${optionId}/discard`);
}

export async function discardBooking(bookingId) {
  return deleteAuth(`${API_URI}/booking/${bookingId}/discard`);
}

export default {
  fetchFutureBookings: fetchConsumerFutureBookings,
  fetchPastBookings: fetchConsumerPastBookings,
  fetchOptions: fetchConsumerOptions,
  fetchConsumerPaymentPacks,
  discardBookingOption,
  fetchProfile: consumerFetchProfile,
  discardBooking,
};
