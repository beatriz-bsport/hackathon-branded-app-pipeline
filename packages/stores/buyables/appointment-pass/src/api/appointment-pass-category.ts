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
  const { page, page_size } = params ?? {};
  const finalParams = {
    page_size: page_size ?? DEFAULT_PAGE_SIZE,
    page: page ?? DEFAULT_PAGE,
  };
  return [
    `${APPOINTMENT_PASS_CATEGORY_API_URL}/${buildUrlParams(finalParams)}`,
  ];
};
