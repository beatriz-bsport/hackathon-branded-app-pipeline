import { queryOptions } from "@tanstack/react-query";

import {
  type Fetch,
  type PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import { API_V1_URL, BOOKING_QUERY_KEY } from "#src/constants";

import type {
  DisableAppointmentParams,
  PrivateBooking,
  PrivateBookingFilterParams,
  PrivateConsumerPass,
  PrivateConsumerPassFilterParams,
  RescheduleAppointmentParams,
  ResourceAllocationParams,
  SwapPassParams,
  SwapTeacherParams,
} from "./types";

const PRIVATE_SERVICE_API_URL = `${API_V1_URL}/private_service`;
const PRIVATE_BOOKING_API_URL = `${PRIVATE_SERVICE_API_URL}/private_booking`;
const PRIVATE_CONSUMER_PASS_API_URL = `${PRIVATE_SERVICE_API_URL}/private_consumer_pass`;
const PRIVATE_SLOT_API_URL = `${PRIVATE_SERVICE_API_URL}/private_slot`;

export const PRIVATE_BOOKING_STALE_TIME = 2 * 60 * 1000; // 2 minutes
export const PRIVATE_CONSUMER_PASS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

export const privateBookingKeys = {
  all: [BOOKING_QUERY_KEY, "private-booking"] as const,
  listScope: () => [...privateBookingKeys.all, "list"] as const,
  list: (params: PrivateBookingFilterParams = {}) =>
    [...privateBookingKeys.listScope(), params] as const,
} as const;

export const privateConsumerPassKeys = {
  all: [BOOKING_QUERY_KEY, "private-consumer-pass"] as const,
  listScope: () => [...privateConsumerPassKeys.all, "list"] as const,
  list: (params: PrivateConsumerPassFilterParams = {}) =>
    [...privateConsumerPassKeys.listScope(), params] as const,
  compatibleScope: () =>
    [...privateConsumerPassKeys.all, "compatible"] as const,
  compatible: (privateSlotId: number, memberId: number) =>
    [
      ...privateConsumerPassKeys.compatibleScope(),
      privateSlotId,
      memberId,
    ] as const,
} as const;

export const fetchPrivateBookingsAPI = async (
  fetch: Fetch<PaginatedResponse<PrivateBooking>>,
  params: PrivateBookingFilterParams = {},
): Promise<PaginatedResponse<PrivateBooking>> => {
  const { data } = await fetch(
    `${PRIVATE_BOOKING_API_URL}/${buildUrlParams(params)}`,
  );
  return data;
};

export const privateBookingsQueryOptions = (
  fetch: Fetch<PaginatedResponse<PrivateBooking>>,
  params: PrivateBookingFilterParams = {},
) =>
  queryOptions({
    queryKey: privateBookingKeys.list(params),
    queryFn: () => fetchPrivateBookingsAPI(fetch, params),
    staleTime: PRIVATE_BOOKING_STALE_TIME,
  });

export const disableAppointmentAPI = async (
  fetch: Fetch<PrivateBooking>,
  id: number,
  params: DisableAppointmentParams = {},
): Promise<PrivateBooking> => {
  const { data } = await fetch(`${PRIVATE_BOOKING_API_URL}/${id}/disable/`, {
    method: "POST",
    body: JSON.stringify(params),
  });
  return data;
};

export const rescheduleAppointmentAPI = async (
  fetch: Fetch<PrivateBooking>,
  id: number,
  params: RescheduleAppointmentParams,
): Promise<PrivateBooking> => {
  const { data } = await fetch(
    `${PRIVATE_BOOKING_API_URL}/${id}/update_datetime/`,
    {
      method: "POST",
      body: JSON.stringify(params),
    },
  );
  return data;
};

export const swapPassAPI = async (
  fetch: Fetch<PrivateBooking>,
  id: number,
  params: SwapPassParams,
): Promise<PrivateBooking> => {
  const { data } = await fetch(`${PRIVATE_BOOKING_API_URL}/${id}/swap_pass/`, {
    method: "POST",
    body: JSON.stringify(params),
  });
  return data;
};

export const fetchCompatiblePassesAPI = async (
  fetch: Fetch<PrivateConsumerPass[]>,
  privateSlotId: number,
  memberId: number,
): Promise<PrivateConsumerPass[]> => {
  const { data } = await fetch(
    `${PRIVATE_CONSUMER_PASS_API_URL}/compatible_with_slot/?private_slot=${privateSlotId}&member=${memberId}`,
  );
  return data;
};

export const swapTeacherAPI = async (
  fetch: Fetch<PrivateBooking>,
  id: number,
  params: SwapTeacherParams,
): Promise<PrivateBooking> => {
  const { data } = await fetch(
    `${PRIVATE_BOOKING_API_URL}/${id}/update_coach/`,
    {
      method: "POST",
      body: JSON.stringify(params),
    },
  );
  return data;
};

export const checkResourceAllocationAPI = async (
  fetch: Fetch<string[][] | null>,
  privateSlotId: number,
  params: ResourceAllocationParams,
): Promise<string[][] | null> => {
  const { data } = await fetch(
    `${PRIVATE_SLOT_API_URL}/${privateSlotId}/get_resource_allocation/`,
    {
      method: "POST",
      body: JSON.stringify(params),
    },
  );
  return data;
};

export const fetchPrivateConsumerPassesAPI = async (
  fetch: Fetch<PaginatedResponse<PrivateConsumerPass>>,
  params: PrivateConsumerPassFilterParams = {},
): Promise<PaginatedResponse<PrivateConsumerPass>> => {
  const { data } = await fetch(
    `${PRIVATE_CONSUMER_PASS_API_URL}/${buildUrlParams(params)}`,
  );
  return data;
};

export const privateConsumerPassesQueryOptions = (
  fetch: Fetch<PaginatedResponse<PrivateConsumerPass>>,
  params: PrivateConsumerPassFilterParams = {},
) =>
  queryOptions({
    queryKey: privateConsumerPassKeys.list(params),
    queryFn: () => fetchPrivateConsumerPassesAPI(fetch, params),
    staleTime: PRIVATE_CONSUMER_PASS_STALE_TIME,
  });
