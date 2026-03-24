import { queryOptions } from "@tanstack/react-query";

import {
  type ApiConfig,
  type Fetch,
  type PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import type { Session } from "#src/session/types";

import type {
  Booking,
  CancelBookingParams,
  PaginatedBookingFilterParams,
  RecurrenceRuleBooking,
  RecurrenceRuleBookingFilterParams,
  SetSpotParams,
} from "./types";

const API_URL = "book/v1";
const API_URL_BOOKING = `${API_URL}/booking`;
const API_URL_RECURRENCE_RULE = `${API_URL_BOOKING}/recurrence_rule_booking`;

export const bookingKeys = {
  all: ["@api-book", "booking"] as const,
  list: (params: PaginatedBookingFilterParams) =>
    [...bookingKeys.all, "list", params] as const,
  detail: (bookingId: number) => [...bookingKeys.all, bookingId] as const,
  recurrenceRulesScope: () => [...bookingKeys.all, "recurrence-rules"] as const,
  recurrenceRules: (params: RecurrenceRuleBookingFilterParams = {}) =>
    [...bookingKeys.recurrenceRulesScope(), params] as const,
  groupSessionRelated: (bookingId: number) =>
    [...bookingKeys.all, "group-session-related", bookingId] as const,
  sessionWithCancelledBookings: (recurrenceRuleId: number) =>
    [...bookingKeys.all, "cancelled", recurrenceRuleId] as const,
} as const;

const fetchBookingsAPIConfig = (
  params: PaginatedBookingFilterParams,
): ApiConfig => {
  return [`${API_URL_BOOKING}/${buildUrlParams(params)}`];
};

export const fetchBookingsAPI = async (
  fetch: Fetch<PaginatedResponse<Booking>>,
  params: PaginatedBookingFilterParams,
): Promise<PaginatedResponse<Booking>> => {
  const [uri, init] = fetchBookingsAPIConfig(params);
  const { data } = await fetch(uri, init);
  return data;
};

export const bookingsQueryOptions = (
  fetch: Fetch<PaginatedResponse<Booking>>,
  params: PaginatedBookingFilterParams,
) =>
  queryOptions({
    queryKey: bookingKeys.list(params),
    queryFn: () => fetchBookingsAPI(fetch, params),
  });

const fetchGroupSessionRelatedBookingsAPIConfig = (
  bookingId: number,
): ApiConfig => {
  return [`${API_URL_BOOKING}/${bookingId}/get_offer_group_related_bookings/`];
};

export const fetchGroupSessionRelatedBookingsAPI = async (
  fetch: Fetch<Booking[]>,
  bookingId: number,
): Promise<Booking[]> => {
  const [uri, init] = fetchGroupSessionRelatedBookingsAPIConfig(bookingId);
  const { data } = await fetch(uri, init);
  return data;
};

export const groupSessionRelatedBookingsQueryOptions = (
  fetch: Fetch<Booking[]>,
  bookingId: number,
) =>
  queryOptions({
    queryKey: bookingKeys.groupSessionRelated(bookingId),
    queryFn: () => fetchGroupSessionRelatedBookingsAPI(fetch, bookingId),
  });

const fetchRecurrenceRuleBookingsAPIConfig = (
  params: RecurrenceRuleBookingFilterParams = {},
): ApiConfig => {
  return [`${API_URL_RECURRENCE_RULE}/${buildUrlParams(params)}`];
};

export const fetchRecurrenceRuleBookingsAPI = async (
  fetch: Fetch<PaginatedResponse<RecurrenceRuleBooking>>,
  params?: RecurrenceRuleBookingFilterParams,
): Promise<PaginatedResponse<RecurrenceRuleBooking>> => {
  const [uri, init] = fetchRecurrenceRuleBookingsAPIConfig(params);
  const { data } = await fetch(uri, init);
  return data;
};

export const recurrenceRuleBookingsQueryOptions = (
  fetch: Fetch<PaginatedResponse<RecurrenceRuleBooking>>,
  params?: RecurrenceRuleBookingFilterParams,
) =>
  queryOptions({
    queryKey: bookingKeys.recurrenceRules(params),
    queryFn: () => fetchRecurrenceRuleBookingsAPI(fetch, params),
  });

const retrieveSessionWithCancelledBookingsAPIConfig = (
  recurrenceRuleId: number,
): ApiConfig => {
  return [
    `${API_URL_RECURRENCE_RULE}/${recurrenceRuleId}/get_offers_to_rebook/`,
  ];
};

export const retrieveSessionWithCancelledBookingsAPI = async (
  fetch: Fetch<Session[]>,
  recurrenceRuleId: number,
): Promise<Session[]> => {
  const [uri, init] =
    retrieveSessionWithCancelledBookingsAPIConfig(recurrenceRuleId);
  const { data } = await fetch(uri, init);
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
  });

export const cancelBookingAPIConfig = (
  bookingId: number,
  params: CancelBookingParams = {},
): ApiConfig => {
  return [
    `${API_URL_BOOKING}/${bookingId}/cancel/`,
    {
      method: "POST",
      body: JSON.stringify(params),
    },
  ];
};

export const cancelBookingAPI = async (
  fetch: Fetch<Booking>,
  bookingId: number,
  params?: CancelBookingParams,
): Promise<Booking> => {
  const [uri, init] = cancelBookingAPIConfig(bookingId, params);
  const { data } = await fetch(uri, init);
  return data;
};

export const setSpotForBookingAPIConfig = (
  bookingId: number,
  params: SetSpotParams,
): ApiConfig => {
  return [
    `${API_URL_BOOKING}/${bookingId}/set_spot_for_member/`,
    {
      method: "POST",
      body: JSON.stringify(params),
    },
  ];
};

export const setSpotForBookingAPI = async (
  fetch: Fetch<Booking>,
  bookingId: number,
  params: SetSpotParams,
): Promise<Booking> => {
  const [uri, init] = setSpotForBookingAPIConfig(bookingId, params);
  const { data } = await fetch(uri, init);
  return data;
};

export const refundBookingAPIConfig = (bookingId: number): ApiConfig => {
  return [
    `${API_URL_BOOKING}/${bookingId}/refund/`,
    {
      method: "PATCH",
      body: JSON.stringify({}),
    },
  ];
};

export const refundBookingAPI = async (
  fetch: Fetch<Booking>,
  bookingId: number,
): Promise<Booking> => {
  const [uri, init] = refundBookingAPIConfig(bookingId);
  const { data } = await fetch(uri, init);
  return data;
};

export const setAttendanceAPIConfig = (
  bookingId: number,
  attendance: boolean,
): ApiConfig => {
  return [
    `${API_URL_BOOKING}/${bookingId}/attendance/`,
    {
      method: "POST",
      body: JSON.stringify({ attendance }),
    },
  ];
};

export const setAttendanceAPI = async (
  fetch: Fetch<void>,
  bookingId: number,
  attendance: boolean,
): Promise<void> => {
  const [uri, init] = setAttendanceAPIConfig(bookingId, attendance);
  await fetch(uri, init);
};
