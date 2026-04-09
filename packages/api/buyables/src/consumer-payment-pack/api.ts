import { queryOptions } from "@tanstack/react-query";

import {
  type Fetch,
  type PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import { API_V1_URL } from "#src/constants";

import type {
  CompatibleWithSessionParams,
  ConsumerPaymentPack,
  IncompatibilityErrorCodeListResponse,
  MaxoutBookingResponse,
  PaginatedConsumerPaymentPackFilterParams,
  RegisterBookingPayload,
} from "./types";

const CONSUMER_PAYMENT_PACK_API_URL = `${API_V1_URL}/payment-pack/consumer-payment-pack`;

export const consumerPaymentPackKeys = {
  all: ["@api-buyables", "consumer-payment-pack"] as const,
  list: (params: PaginatedConsumerPaymentPackFilterParams = {}) =>
    [...consumerPaymentPackKeys.all, "list", params] as const,
  compatibleBySession: (
    sessionId: number,
    params: CompatibleWithSessionParams = {},
  ) =>
    [
      ...consumerPaymentPackKeys.all,
      "compatible-by-session",
      sessionId,
      params,
    ] as const,
  nonCompatibleBySession: (
    sessionId: number,
    params: CompatibleWithSessionParams = {},
  ) =>
    [
      ...consumerPaymentPackKeys.all,
      "non-compatible-by-session",
      sessionId,
      params,
    ] as const,
  maxoutBooking: (params: PaginatedConsumerPaymentPackFilterParams = {}) =>
    [...consumerPaymentPackKeys.all, "maxout-booking", params] as const,
  incompatibilityReasons: (id: number, sessionId: number) =>
    [
      ...consumerPaymentPackKeys.all,
      "incompatibility-reasons",
      id,
      sessionId,
    ] as const,
} as const;

export const registerBookingAPI = async (
  fetch: Fetch<ConsumerPaymentPack>,
  consumerPaymentPackId: number,
  payload: RegisterBookingPayload,
): Promise<ConsumerPaymentPack> => {
  const { data } = await fetch(
    `${CONSUMER_PAYMENT_PACK_API_URL}/${consumerPaymentPackId}/register_booking/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  return data;
};

export const fetchConsumerPaymentPackListAPI = async (
  fetch: Fetch<PaginatedResponse<ConsumerPaymentPack>>,
  params: PaginatedConsumerPaymentPackFilterParams = {},
): Promise<PaginatedResponse<ConsumerPaymentPack>> => {
  const { data } = await fetch(
    `${CONSUMER_PAYMENT_PACK_API_URL}/${buildUrlParams(params, { withDefaultPagination: true })}`,
  );
  return data;
};

export const consumerPaymentPackListQueryOptions = (
  fetch: Fetch<PaginatedResponse<ConsumerPaymentPack>>,
  params: PaginatedConsumerPaymentPackFilterParams = {},
) => {
  return queryOptions({
    queryKey: consumerPaymentPackKeys.list(params),
    queryFn: () => fetchConsumerPaymentPackListAPI(fetch, params),
  });
};

export const fetchCompatibleBySessionAPI = async (
  fetch: Fetch<ConsumerPaymentPack[]>,
  sessionId: number,
  params: CompatibleWithSessionParams = {},
): Promise<ConsumerPaymentPack[]> => {
  const { data } = await fetch(
    `${CONSUMER_PAYMENT_PACK_API_URL}/compatible_with_offer_v2/${buildUrlParams(params)}`,
    {
      method: "POST",
      body: JSON.stringify({ offer: sessionId }),
    },
  );
  return data;
};

export const compatibleBySessionQueryOptions = (
  fetch: Fetch<ConsumerPaymentPack[]>,
  sessionId: number,
  params: CompatibleWithSessionParams = {},
) =>
  queryOptions({
    queryKey: consumerPaymentPackKeys.compatibleBySession(sessionId, params),
    queryFn: () => fetchCompatibleBySessionAPI(fetch, sessionId, params),
  });

export const fetchNonCompatibleBySessionAPI = async (
  fetch: Fetch<ConsumerPaymentPack[]>,
  sessionId: number,
  params: CompatibleWithSessionParams = {},
): Promise<ConsumerPaymentPack[]> => {
  const { data } = await fetch(
    `${CONSUMER_PAYMENT_PACK_API_URL}/noncompatible_with_offer/${buildUrlParams(params)}`,
    {
      method: "POST",
      body: JSON.stringify({ offer: sessionId }),
    },
  );
  return data;
};

export const nonCompatibleBySessionQueryOptions = (
  fetch: Fetch<ConsumerPaymentPack[]>,
  sessionId: number,
  params: CompatibleWithSessionParams = {},
) =>
  queryOptions({
    queryKey: consumerPaymentPackKeys.nonCompatibleBySession(sessionId, params),
    queryFn: () => fetchNonCompatibleBySessionAPI(fetch, sessionId, params),
  });

export const fetchIncompatibilityReasonsAPI = async (
  fetch: Fetch<IncompatibilityErrorCodeListResponse>,
  id: number,
  sessionId: number,
): Promise<IncompatibilityErrorCodeListResponse> => {
  const { data } = await fetch(
    `${CONSUMER_PAYMENT_PACK_API_URL}/${id}/incompatibility_error_code_list/${buildUrlParams({ offer: sessionId })}`,
  );
  return data;
};

export const incompatibilityReasonsQueryOptions = (
  fetch: Fetch<IncompatibilityErrorCodeListResponse>,
  id: number,
  sessionId: number,
) =>
  queryOptions({
    queryKey: consumerPaymentPackKeys.incompatibilityReasons(id, sessionId),
    queryFn: () => fetchIncompatibilityReasonsAPI(fetch, id, sessionId),
  });

export const fetchMaxoutBookingAPI = async (
  fetch: Fetch<MaxoutBookingResponse>,
  params: PaginatedConsumerPaymentPackFilterParams = {},
): Promise<MaxoutBookingResponse> => {
  const { data } = await fetch(
    `${CONSUMER_PAYMENT_PACK_API_URL}/maxout_booking/${buildUrlParams(params, { withDefaultPagination: true })}`,
    {
      method: "POST",
      body: JSON.stringify({}),
    },
  );
  return data;
};

export const maxoutBookingQueryOptions = (
  fetch: Fetch<MaxoutBookingResponse>,
  params: PaginatedConsumerPaymentPackFilterParams = {},
) => {
  return queryOptions({
    queryKey: consumerPaymentPackKeys.maxoutBooking(params),
    queryFn: () => fetchMaxoutBookingAPI(fetch, params),
  });
};
