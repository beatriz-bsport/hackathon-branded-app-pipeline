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
  PaginatedBookingFilterParams,
  RecurrenceRuleBooking,
  RecurrenceRuleBookingFilterParams,
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
