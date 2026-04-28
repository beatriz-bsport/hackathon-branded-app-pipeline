import { queryOptions } from "@tanstack/react-query";

import { Fetch, PaginatedResponse, buildUrlParams } from "@bsport/store-base";

import { BOOKING_QUERY_KEY } from "#src/constants";

import {
  BookingOption,
  BookingOptionDetail,
  BookingOptionListParams,
  BookingOptionPosition,
} from "./types";

const API_URL = "book/v1";
const API_URL_WAITING_LIST = `${API_URL}/waiting-list`;

export const waitingListKeys = {
  all: [BOOKING_QUERY_KEY, "waiting-list"] as const,
  lists: () => [...waitingListKeys.all, "lists"] as const,
  list: (params: BookingOptionListParams = {}) =>
    [...waitingListKeys.all, "list", params] as const,
  detail: (id: number) => [...waitingListKeys.all, "detail", id] as const,
  positions: (sessionId: number) =>
    [...waitingListKeys.all, "positions", sessionId] as const,
} as const;

export const fetchPaginatedBookingOptionsAPI = async (
  fetch: Fetch<PaginatedResponse<BookingOption>>,
  params: BookingOptionListParams,
) => {
  const { data } = await fetch(
    `${API_URL_WAITING_LIST}/booking-option/${buildUrlParams(params)}`,
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
    `${API_URL_WAITING_LIST}/booking-option/${buildUrlParams(params)}`,
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
  const { data } = await fetch(
    `${API_URL_WAITING_LIST}/booking-option/${bookingOptionId}/`,
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
