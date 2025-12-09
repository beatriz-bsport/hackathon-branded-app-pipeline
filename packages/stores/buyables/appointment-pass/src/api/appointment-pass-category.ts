import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

import type { FetchAppointmentPassCategoriesParams } from "#src/types";

import { API_URL } from "./constants";

const APPOINTMENT_PASS_CATEGORY_API_URL = `${API_URL}/private_pass_category`;

export const fetchAppointmentPassCategoriesAPI = (
  params?: FetchAppointmentPassCategoriesParams,
): ApiConfig => {
  return [
    `${APPOINTMENT_PASS_CATEGORY_API_URL}/${buildUrlParams(params ?? {})}`,
  ];
};
