import { API_URI, API_V1_URI, getAuth, postAuth, deleteAuth } from '../http';

export async function fetchConsumerOptions() {
  return getAuth(`${API_URI}/waiting-list/booking-option/?with_offer=true`);
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
  return postAuth(
    `${API_V1_URI}/waiting-list/booking-option/${optionId}/discard/`,
  );
}

export async function hasBookingOptionInOffer(offerId) {
  return postAuth(
    `${API_V1_URI}/waiting-list/booking-option/exists/?offer=${offerId}`,
  );
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
  hasBookingOptionInOffer,
  fetchProfile: consumerFetchProfile,
  discardBooking,
};
