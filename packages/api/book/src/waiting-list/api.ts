import { queryOptions } from "@tanstack/react-query";

import { Fetch, PaginatedResponse, buildUrlParams } from "@bsport/store-base";

import { BOOKING_QUERY_KEY } from "#src/constants";

import {
  BookingOption,
  BookingOptionDetail,
  BookingOptionListParams,
  BookingOptionPosition,
  WaitingListConfiguration,
} from "./types";

const API_URL = "book/v1";
const API_URL_WAITING_LIST = `${API_URL}/waiting-list`;
const API_URL_BOOKING_OPTION = `${API_URL_WAITING_LIST}/booking-option`;

export const waitingListKeys = {
  all: [BOOKING_QUERY_KEY, "waiting-list"] as const,
  lists: () => [...waitingListKeys.all, "lists"] as const,
  list: (params: BookingOptionListParams = {}) =>
    [...waitingListKeys.all, "list", params] as const,
  detail: (id: number) => [...waitingListKeys.all, "detail", id] as const,
  positions: (sessionId: number) =>
    [...waitingListKeys.all, "positions", sessionId] as const,
  configuration: (companyId: number) =>
    [...waitingListKeys.all, "configuration", companyId] as const,
} as const;

export const fetchPaginatedBookingOptionsAPI = async (
  fetch: Fetch<PaginatedResponse<BookingOption>>,
  params: BookingOptionListParams,
) => {
  const { data } = await fetch(
    `${API_URL_BOOKING_OPTION}/${buildUrlParams(params)}`,
  );
  return data;
};

export const fetchPaginatedBookingOptionsQueryOption = (
  fetch: Fetch<PaginatedResponse<BookingOption>>,
  params: BookingOptionListParams,
) => {
  const queryFn = fetchPaginatedBookingOptionsAPI.bind(null, fetch, params);

  return queryOptions({
    queryKey: waitingListKeys.list(params),
    queryFn,
  });
};

export const fetchBookingOptionsAPI = async (
  fetch: Fetch<BookingOption[]>,
  params: Omit<BookingOptionListParams, "page" | "page_size">,
) => {
  const { data } = await fetch(
    `${API_URL_BOOKING_OPTION}/${buildUrlParams(params)}`,
  );
  return data;
};

export const fetchBookingOptionsQueryOption = (
  fetch: Fetch<BookingOption[]>,
  params: Omit<BookingOptionListParams, "page" | "page_size">,
) => {
  const queryFn = fetchBookingOptionsAPI.bind(null, fetch, params);

  return queryOptions({
    queryKey: waitingListKeys.list(params),
    queryFn,
  });
};

export const retrieveBookingOptionAPI = async (
  fetch: Fetch<BookingOptionDetail>,
  bookingOptionId: number,
) => {
  // Note: the `show_cancelled` param is required to retrieve cancelled booking options,
  // as they are excluded from the default endpoint response.
  // This is necessary to support viewing details of cancelled bookings from the cancelled bookings list.
  const { data } = await fetch(
    `${API_URL_BOOKING_OPTION}/${bookingOptionId}/${buildUrlParams({ show_cancelled: true })}`,
  );
  return data;
};

export const retrieveBookingOptionQueryOptions = (
  fetch: Fetch<BookingOptionDetail>,
  bookingOptionId: number,
) => {
  const queryFn = retrieveBookingOptionAPI.bind(null, fetch, bookingOptionId);

  return queryOptions({
    queryKey: waitingListKeys.detail(bookingOptionId),
    queryFn,
  });
};

export const fetchWaitingListPositionsAPI = async (
  fetch: Fetch<BookingOptionPosition[]>,
  sessionId: number,
) => {
  const { data } = await fetch(
    `${API_URL}/offer/${sessionId}/waiting_list_all_positions/`,
  );
  return data;
};

export const fetchWaitingListPositionsQueryOption = (
  fetch: Fetch<BookingOptionPosition[]>,
  sessionId: number,
) => {
  const queryFn = fetchWaitingListPositionsAPI.bind(null, fetch, sessionId);

  return queryOptions({
    queryKey: waitingListKeys.positions(sessionId),
    queryFn,
  });
};

export const fetchWaitingListConfigurationAPI = async (
  fetch: Fetch<WaitingListConfiguration>,
  companyId: number,
) => {
  const { data } = await fetch(
    `${API_URL_WAITING_LIST}/configuration/${companyId}/`,
  );
  return data;
};

export const fetchWaitingListConfigurationQueryOption = (
  fetch: Fetch<WaitingListConfiguration>,
  companyId: number,
) => {
  const queryFn = fetchWaitingListConfigurationAPI.bind(null, fetch, companyId);

  return queryOptions({
    queryKey: waitingListKeys.configuration(companyId),
    queryFn,
  });
};
