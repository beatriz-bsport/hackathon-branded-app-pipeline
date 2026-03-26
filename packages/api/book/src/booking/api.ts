import { queryOptions } from "@tanstack/react-query";

import {
  type Fetch,
  type PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

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
  UpdateRecurrenceRuleBookingParams,
  UpdateSessionWithCancelledBookingsToRetryParams,
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

export const fetchBookingsAPI = async (
  fetch: Fetch<PaginatedResponse<Booking>>,
  params: PaginatedBookingFilterParams,
): Promise<PaginatedResponse<Booking>> => {
  const { data } = await fetch(`${API_URL_BOOKING}/${buildUrlParams(params)}`);
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
  });

export const fetchRecurrenceRuleBookingsAPI = async (
  fetch: Fetch<PaginatedResponse<RecurrenceRuleBooking>>,
  params: RecurrenceRuleBookingFilterParams = {},
): Promise<PaginatedResponse<RecurrenceRuleBooking>> => {
  const { data } = await fetch(
    `${API_URL_RECURRENCE_RULE}/${buildUrlParams(params)}`,
  );
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
