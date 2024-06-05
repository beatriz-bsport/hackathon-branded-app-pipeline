
import type { PaginatedResponse } from '#state/types';
import type { BookingREST } from '#libs/booking/types';
import type { UniversalPassREST } from '#libs/universal-pass/types';
import type {
  ConsumerInvoiceComplementary,
  ConsumerInvoiceREST,
} from '#libs/invoice/types';
import type {
  ConsumerInvoiceQueryParams,
  ConsumerPassesTabDisplay,
} from '#libs/consumer-space/types';
import {
  API_URI,
  API_V1_URI,
  getAuth,
  postAuth,
  deleteAuth,
  buildUrlParams,
} from '../../http';

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

/** @deprecated Not type safe */
export async function discardBookingOption(optionId: number) {
  return postAuth(
    `${API_V1_URI}/waiting-list/booking-option/${optionId}/discard/`,
  );
}

export async function hasBookingOptionInOffer(offerId: number) {
  return getAuth(
    `${API_V1_URI}/waiting-list/booking-option/exists/?offer=${offerId}`,
  );
}

export async function discardBooking(bookingId: number) {
  return deleteAuth(`${API_URI}/booking/${bookingId}/discard`);
}

export const cancelConsumerBooking = async (
  id: number,
  data: { bookings_in_same_group?: BookingREST[] } = {},
) => {
  return postAuth<BookingREST>(`${API_V1_URI}/booking/${id}/cancel/`, data);
};

export const fetchUniversalPasses = (params: {
  member: number;
  page: number;
  page_size: number;
  is_expired: boolean;
  is_valid_today: boolean;
}) => {
  return getAuth<PaginatedResponse<UniversalPassREST>>(
    `${API_V1_URI}/universal_pass/${buildUrlParams(params)}`,
  );
};

export const fetchMyPassesTabs = (memberId: number) =>
  getAuth<ConsumerPassesTabDisplay>(
    `${API_V1_URI}/member/${memberId}/get_my_passes_tabs/`,
  );

export const fetchConsumerInvoices = (params: ConsumerInvoiceQueryParams) => {
  return getAuth<PaginatedResponse<ConsumerInvoiceREST>>(
    `${API_V1_URI}/payment/consumer_invoices/${buildUrlParams(params)}`,
  );
};

export const fetchConsumerInvoicesComplementary = (params: {
  uuid__in?: string[];
}) => {
  return getAuth<ConsumerInvoiceComplementary[]>(
    `${API_V1_URI}/payment/consumer_invoices/get_complementary_fields/${buildUrlParams(
      params,
    )}`,
  );
};

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
