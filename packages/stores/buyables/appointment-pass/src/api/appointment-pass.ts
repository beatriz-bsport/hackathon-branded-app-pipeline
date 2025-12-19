import {
  type ApiConfig,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  buildUrlParams,
} from "@bsport/store-base";

import type {
  FetchAppointmentPassesParams,
  SearchAppointmentPassesParams,
} from "#src/types";

import { API_URL } from "./constants";

const APPOINTMENT_PASS_API_URL = `${API_URL}/private_pass`;

export const fetchAppointmentPassesAPI = (
  params: FetchAppointmentPassesParams = {},
): ApiConfig => {
  const { page_size, page, id__in, ...otherParams } = params ?? {};

  const defaultPageSize = id__in?.length ? id__in.length : DEFAULT_PAGE_SIZE;
  const finalParams = {
    page_size: page_size ?? defaultPageSize,
    page: page ?? DEFAULT_PAGE,
    ...(id__in?.length ? { id__in } : {}),
    ...otherParams,
  };

  return [`${APPOINTMENT_PASS_API_URL}/${buildUrlParams(finalParams)}`];
};

export const searchAppointmentPassesAPI = (
  params: SearchAppointmentPassesParams,
): ApiConfig => {
  return [`${APPOINTMENT_PASS_API_URL}/search/${buildUrlParams(params)}`];
};
