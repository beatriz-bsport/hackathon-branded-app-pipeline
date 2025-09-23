import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

import type { FetchAppointmentParams, SearchAppointmentParams } from "./types";

const API_URL = "book/v1/private_service/";

export const fetchAppointmentsAPI = (
  params: FetchAppointmentParams,
): ApiConfig => {
  return [`${API_URL}/private_service/${buildUrlParams(params)}`];
};

export const searchAppointmentsAPI = (
  params: SearchAppointmentParams,
): ApiConfig => {
  return [`${API_URL}/private_service/search/${buildUrlParams(params)}`];
};
