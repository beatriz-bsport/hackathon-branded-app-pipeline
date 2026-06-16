import { queryOptions } from "@tanstack/react-query";

import {
  type Fetch,
  type PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import { BOOKING_QUERY_KEY, DEFAULT_STALE_TIME } from "#src/constants";
import type { Session } from "#src/session/types";

import type {
  Booking,
  CancelBookingParams,
  CreateRecurrenceRuleBookingParams,
  DeleteRecurrenceRuleBookingParams,
  PaginatedBookingFilterParams,
  RecurrenceRuleBooking,
  RecurrenceRuleBookingFilterParams,
  SetSpotParams,
  SwapBookingPassParams,
  UpdateRecurrenceRuleBookingParams,
  UpdateSessionWithCancelledBookingsToRetryParams,
} from "./types";

const API_URL = "book/v1";
const API_URL_BOOKING = `${API_URL}/booking`;
const API_URL_RECURRENCE_RULE = `${API_URL_BOOKING}/recurrence_rule_booking`;

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

const DEFAULT_PAGINATION_PARAMS = {
  page: DEFAULT_PAGE,
  page_size: DEFAULT_PAGE_SIZE,
} as const;

export const bookingKeys = {
  all: [BOOKING_QUERY_KEY, "booking"] as const,
  listScope: () => [...bookingKeys.all, "list"] as const,
  list: (params: PaginatedBookingFilterParams) =>
    [...bookingKeys.listScope(), params] as const,
  detail: (bookingId: number) => [...bookingKeys.all, bookingId] as const,
  recurrenceRulesScope: () => [...bookingKeys.all, "recurrence-rules"] as const,
  recurrenceRules: (params: RecurrenceRuleBookingFilterParams) =>
    [...bookingKeys.recurrenceRulesScope(), params] as const,
  groupSessionRelated: (bookingId: number) =>
    [...bookingKeys.all, "group-session-related", bookingId] as const,
  sessionWithCancelledBookings: (recurrenceRuleId: number) =>
    [...bookingKeys.all, "cancelled", recurrenceRuleId] as const,
  setSpotMutation: (bookingId: number) =>
    [...bookingKeys.detail(bookingId), "set-spot"] as const,
} as const;

export const fetchBookingsAPI = async (
  fetch: Fetch<PaginatedResponse<Booking>>,
  params: PaginatedBookingFilterParams = {},
): Promise<PaginatedResponse<Booking>> => {
  const { data } = await fetch(
    `${API_URL_BOOKING}/${buildUrlParams({ ...DEFAULT_PAGINATION_PARAMS, ...params })}`,
  );
  return data;
};

export const bookingsQueryOptions = (
  fetch: Fetch<PaginatedResponse<Booking>>,
  params: PaginatedBookingFilterParams = {},
) => {
  const mergedParams = { ...DEFAULT_PAGINATION_PARAMS, ...params };
  return queryOptions({
    queryKey: bookingKeys.list(mergedParams),
    queryFn: () => fetchBookingsAPI(fetch, mergedParams),
    staleTime: DEFAULT_STALE_TIME,
  });
};

export const retrieveBookingAPI = async (
  fetch: Fetch<Booking>,
  bookingId: number,
): Promise<Booking> => {
  const { data } = await fetch(`${API_URL_BOOKING}/${bookingId}/`);
  return data;
};

export const retrieveBookingQueryOptions = (
  fetch: Fetch<Booking>,
  bookingId: number,
) =>
  queryOptions({
    queryKey: bookingKeys.detail(bookingId),
    queryFn: () => retrieveBookingAPI(fetch, bookingId),
    staleTime: DEFAULT_STALE_TIME,
  });

export const fetchGroupSessionRelatedBookingsAPI = async (
  fetch: Fetch<Booking[]>,
  bookingId: number,
): Promise<Booking[]> => {
  const { data } = await fetch(
    `${API_URL_BOOKING}/${bookingId}/get_offer_group_related_bookings/`,
  );
  return data;
};

export const groupSessionRelatedBookingsQueryOptions = (
  fetch: Fetch<Booking[]>,
  bookingId: number,
) =>
  queryOptions({
    queryKey: bookingKeys.groupSessionRelated(bookingId),
    queryFn: () => fetchGroupSessionRelatedBookingsAPI(fetch, bookingId),
    staleTime: DEFAULT_STALE_TIME,
  });

export const fetchRecurrenceRuleBookingsAPI = async (
  fetch: Fetch<PaginatedResponse<RecurrenceRuleBooking>>,
  params: RecurrenceRuleBookingFilterParams = {},
): Promise<PaginatedResponse<RecurrenceRuleBooking>> => {
  const { data } = await fetch(
    `${API_URL_RECURRENCE_RULE}/${buildUrlParams({ ...DEFAULT_PAGINATION_PARAMS, ...params })}`,
  );
  return data;
};

export const recurrenceRuleBookingsQueryOptions = (
  fetch: Fetch<PaginatedResponse<RecurrenceRuleBooking>>,
  params: RecurrenceRuleBookingFilterParams = {},
) => {
  const mergedParams = { ...DEFAULT_PAGINATION_PARAMS, ...params };
  return queryOptions({
    queryKey: bookingKeys.recurrenceRules(mergedParams),
    queryFn: () => fetchRecurrenceRuleBookingsAPI(fetch, mergedParams),
    staleTime: DEFAULT_STALE_TIME,
  });
};

export const retrieveSessionWithCancelledBookingsAPI = async (
  fetch: Fetch<Session[]>,
  recurrenceRuleId: number,
): Promise<Session[]> => {
  const { data } = await fetch(
    `${API_URL_RECURRENCE_RULE}/${recurrenceRuleId}/get_offers_to_rebook/`,
  );
  return data;
};

export const sessionWithCancelledBookingsQueryOptions = (
  fetch: Fetch<Session[]>,
  recurrenceRuleId: number,
) =>
  queryOptions({
    queryKey: bookingKeys.sessionWithCancelledBookings(recurrenceRuleId),
    queryFn: () =>
      retrieveSessionWithCancelledBookingsAPI(fetch, recurrenceRuleId),
    staleTime: DEFAULT_STALE_TIME,
  });

export const cancelBookingAPI = async (
  fetch: Fetch<Booking>,
  bookingId: number,
  params: CancelBookingParams = {},
): Promise<Booking> => {
  const { data } = await fetch(`${API_URL_BOOKING}/${bookingId}/cancel/`, {
    method: "POST",
    body: JSON.stringify(params),
  });
  return data;
};

export const swapBookingPassAPI = async (
  fetch: Fetch<Booking>,
  bookingId: number,
  params: SwapBookingPassParams,
): Promise<Booking> => {
  const { data } = await fetch(`${API_URL_BOOKING}/${bookingId}/swap_pass/`, {
    method: "POST",
    body: JSON.stringify(params),
  });
  return data;
};

export const setSpotForBookingAPI = async (
  fetch: Fetch<Booking>,
  bookingId: number,
  params: SetSpotParams,
): Promise<Booking> => {
  const { data } = await fetch(
    `${API_URL_BOOKING}/${bookingId}/set_spot_for_member/`,
    {
      method: "POST",
      body: JSON.stringify(params),
    },
  );
  return data;
};

export const refundBookingAPI = async (
  fetch: Fetch<Booking>,
  bookingId: number,
): Promise<Booking> => {
  const { data } = await fetch(`${API_URL_BOOKING}/${bookingId}/refund/`, {
    method: "PATCH",
    body: JSON.stringify({}),
  });
  return data;
};

export const setAttendanceAPI = async (
  fetch: Fetch<void>,
  bookingId: number,
  attendance: boolean,
): Promise<void> => {
  await fetch(`${API_URL_BOOKING}/${bookingId}/attendance/`, {
    method: "POST",
    body: JSON.stringify({ attendance }),
  });
};

export const createRecurrenceRuleBookingAPI = async (
  fetch: Fetch<RecurrenceRuleBooking>,
  params: CreateRecurrenceRuleBookingParams,
): Promise<RecurrenceRuleBooking> => {
  const { data } = await fetch(`${API_URL_RECURRENCE_RULE}/`, {
    method: "POST",
    body: JSON.stringify(params),
  });
  return data;
};

export const updateRecurrenceRuleBookingAPI = async (
  fetch: Fetch<RecurrenceRuleBooking>,
  id: number,
  params: UpdateRecurrenceRuleBookingParams,
): Promise<RecurrenceRuleBooking> => {
  const { data } = await fetch(`${API_URL_RECURRENCE_RULE}/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(params),
  });
  return data;
};

export const deleteRecurrenceRuleBookingAPI = async (
  fetch: Fetch<RecurrenceRuleBooking>,
  id: number,
  params: DeleteRecurrenceRuleBookingParams = {},
): Promise<RecurrenceRuleBooking> => {
  const { data } = await fetch(
    `${API_URL_RECURRENCE_RULE}/${id}/${buildUrlParams(params)}`,
    { method: "DELETE" },
  );
  return data;
};

export const updateSessionWithCancelledBookingsToRetryAPI = async (
  fetch: Fetch<number>,
  recurrenceRuleId: number,
  params: UpdateSessionWithCancelledBookingsToRetryParams,
): Promise<number> => {
  const { data } = await fetch(
    `${API_URL_RECURRENCE_RULE}/${recurrenceRuleId}/update_recurrence_booking_offers_to_retry/`,
    {
      method: "POST",
      body: JSON.stringify(params),
    },
  );
  return data;
};
