import {
  type ApiConfig,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  buildUrlParams,
} from "@bsport/store-base";

import type { FetchAppointmentPassCategoriesParams } from "#src/types";

import { API_URL } from "./constants";

const APPOINTMENT_PASS_CATEGORY_API_URL = `${API_URL}/private_pass_category`;

export const fetchAppointmentPassCategoriesAPI = (
  params?: FetchAppointmentPassCategoriesParams,
): ApiConfig => {
  const { id__in, page, page_size, ...otherParams } = params ?? {};

  const defaultPageSize = id__in?.length ? id__in.length : DEFAULT_PAGE_SIZE;
  const finalParams = {
    page_size: page_size ?? defaultPageSize,
    page: page ?? DEFAULT_PAGE,
    ...(id__in?.length ? { id__in } : {}),
    ...otherParams,
  };

  return [
    `${APPOINTMENT_PASS_CATEGORY_API_URL}/${buildUrlParams(finalParams)}`,
  ];
};
