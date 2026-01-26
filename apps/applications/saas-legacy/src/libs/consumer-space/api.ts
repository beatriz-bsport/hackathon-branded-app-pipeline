import type { PaginatedResponse } from '#src/state/types';
import type { BookingREST } from '#src/libs/booking/types';
import type { UniversalPassREST } from '#src/libs/universal-pass/types';
import type {
  ConsumerInvoiceComplementary,
  ConsumerInvoiceREST,
} from '#src/libs/invoice/types';
import type {
  ConsumerInvoiceQueryParams,
  ConsumerPassesTabDisplay,
} from '#src/libs/consumer-space/types';
import { getAuth, postAuth, deleteAuth, buildUrlParams } from '../../http';

import Config from '../../config';

const API_URI_BOOK = Config.REACT_APP_BASE_URI_BOOK_V0;
const API_V1_URI_BOOK = Config.REACT_APP_BASE_URI_BOOK_V1;
const API_V1_URI_FS = Config.REACT_APP_BASE_URI_FINANCIAL_SERVICES_V1;
const API_URI_PLATFORM = Config.REACT_APP_BASE_URI_PLATFORM_V0;
const API_URI_BUYABLE = Config.REACT_APP_BASE_URI_BUYABLE_V0;
const API_V1_URI_BUYABLE = Config.REACT_APP_BASE_URI_BUYABLE_V1;
const API_V1_URI_CORE = Config.REACT_APP_BASE_URI_CORE_V1;

export async function fetchConsumerOptions() {
  return getAuth(
    `${API_URI_BOOK}/waiting-list/booking-option/?with_offer=true`,
  );
}

export async function fetchConsumerPastBookings() {
  return getAuth(`${API_URI_BOOK}/booking/past/`);
}

export async function fetchConsumerFutureBookings() {
  return getAuth(`${API_URI_BOOK}/booking/future/`);
}

export async function fetchConsumerPaymentPacks() {
  return getAuth(`${API_URI_BUYABLE}/consumer/payment-pack/`);
}

export async function consumerFetchProfile() {
  return getAuth(`${API_URI_PLATFORM}/user/self/info/`);
}

/** @deprecated Not type safe */
export async function discardBookingOption(optionId: number) {
  return postAuth(
    `${API_V1_URI_BOOK}/waiting-list/booking-option/${optionId}/discard/`,
  );
}

export async function hasBookingOptionInOffer(offerId: number) {
  return getAuth(
    `${API_V1_URI_BOOK}/waiting-list/booking-option/exists/?offer=${offerId}`,
  );
}

export async function discardBooking(bookingId: number) {
  return deleteAuth(`${API_URI_BOOK}/booking/${bookingId}/discard`);
}

export const cancelConsumerBooking = async (
  id: number,
  data: { bookings_in_same_group?: BookingREST[] } = {},
) => {
  return postAuth<BookingREST>(
    `${API_V1_URI_BOOK}/booking/${id}/cancel/`,
    data,
  );
};

export const fetchUniversalPasses = (params: {
  member: number;
  page: number;
  page_size: number;
  is_expired: boolean;
  is_valid_today: boolean;
}) => {
  return getAuth<PaginatedResponse<UniversalPassREST>>(
    `${API_V1_URI_BUYABLE}/universal_pass/${buildUrlParams(params)}`,
  );
};

export const fetchMyPassesTabs = (memberId: number) =>
  getAuth<ConsumerPassesTabDisplay>(
    `${API_V1_URI_CORE}/member/${memberId}/get_my_passes_tabs/${buildUrlParams({
      me: true,
    })}`,
  );

export const fetchConsumerInvoices = (params: ConsumerInvoiceQueryParams) => {
  return getAuth<PaginatedResponse<ConsumerInvoiceREST>>(
    `${API_V1_URI_FS}/payment/consumer_invoices/${buildUrlParams(params)}`,
  );
};

export const fetchConsumerInvoicesComplementary = (params: {
  uuid__in?: string[];
}) => {
  return getAuth<ConsumerInvoiceComplementary[]>(
    `${API_V1_URI_FS}/payment/consumer_invoices/get_complementary_fields/${buildUrlParams(
      params,
    )}`,
  );
};

export const fetchConsumerInvoiceByUuid = (uuid: string) => {
  return getAuth<ConsumerInvoiceREST>(
    `${API_V1_URI_FS}/payment/consumer_invoices/${uuid}/`,
  );
};

export default {
  fetchFutureBookings: fetchConsumerFutureBookings,
  fetchPastBookings: fetchConsumerPastBookings,
  fetchOptions: fetchConsumerOptions,
  discardBookingOption,
  hasBookingOptionInOffer,
  fetchProfile: consumerFetchProfile,
  discardBooking,
};
