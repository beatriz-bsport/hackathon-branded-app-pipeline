import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  type PaginatedResponse,
  type SearchResponse,
  buildUrlParams,
} from "@bsport/store-base";

import { QUERY_KEY_MAIN } from "#src/constants";
import { createAPI, createQueryOptions } from "#src/shared";

import type {
  AppointmentPass,
  FetchAppointmentPassesParams,
  SearchAppointmentPassesParams,
} from "./types";

// ----------------------------------------------------------------------------

const APPOINTMENT_PASS_API_URL = "book/v1/private_service/private_pass";

export const appointmentPassKeys = {
  all: [QUERY_KEY_MAIN, "appointment-pass"] as const,

  lists: () => [...appointmentPassKeys.all, "list"] as const,
  list: (params: FetchAppointmentPassesParams) =>
    [...appointmentPassKeys.lists(), params] as const,

  searches: () => [...appointmentPassKeys.lists(), "search"] as const,
  search: (params: SearchAppointmentPassesParams) =>
    [...appointmentPassKeys.searches(), params] as const,

  details: () => [...appointmentPassKeys.all, "detail"] as const,
  detail: (id: number) => [...appointmentPassKeys.details(), id] as const,
} as const;

// ----------------------------------------------------------------------------

function buildFetchAppointmentPassesParams(
  params: FetchAppointmentPassesParams,
) {
  const { page_size, page, id__in, ...otherParams } = params ?? {};

  const defaultPageSize = id__in?.length ? id__in.length : DEFAULT_PAGE_SIZE;
  const finalParams = {
    page_size: page_size ?? defaultPageSize,
    page: page ?? DEFAULT_PAGE,
    ...(id__in?.length ? { id__in } : {}),
    ...otherParams,
  };

  return buildUrlParams(finalParams);
}

// Used in store/buyables/appointment-pass
export const fetchAppointmentPassesAPI = createAPI<
  PaginatedResponse<AppointmentPass>,
  FetchAppointmentPassesParams
>((params) => [
  `${APPOINTMENT_PASS_API_URL}/${buildFetchAppointmentPassesParams(params)}`,
]);

export const fetchAppointmentPassesQueryOptions = createQueryOptions<
  PaginatedResponse<AppointmentPass>,
  FetchAppointmentPassesParams
>(
  (params) => [
    `${APPOINTMENT_PASS_API_URL}/${buildFetchAppointmentPassesParams(params)}`,
  ],
  (params) => appointmentPassKeys.list(params),
);

// ----------------------------------------------------------------------------

// Used in store/buyables/appointment-pass
export const searchAppointmentPassesAPI = createAPI<
  SearchResponse<AppointmentPass>,
  SearchAppointmentPassesParams
>((params) => [`${APPOINTMENT_PASS_API_URL}/search/${buildUrlParams(params)}`]);

export const searchAppointmentPassesQueryOptions = createQueryOptions<
  SearchResponse<AppointmentPass>,
  SearchAppointmentPassesParams
>(
  (params) => [`${APPOINTMENT_PASS_API_URL}/search/${buildUrlParams(params)}`],
  (params) => appointmentPassKeys.search(params),
);

// ----------------------------------------------------------------------------

export const retrieveAppointmentPassQueryOptions = createQueryOptions<
  AppointmentPass,
  number
>(
  (id) => [`${APPOINTMENT_PASS_API_URL}/${id}`],
  (id) => appointmentPassKeys.detail(id),
);
