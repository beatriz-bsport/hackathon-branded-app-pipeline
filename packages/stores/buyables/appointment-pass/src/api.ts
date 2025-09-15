import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

import type {
  FetchAppointmentPassParams,
  SearchAppointmentPassParams,
} from "./types";

const API_URL = "book/v1/private_service/private_pass";

export const fetchAppointmentPassAPI = (
  params: FetchAppointmentPassParams = {},
): ApiConfig => {
  return [`${API_URL}/${buildUrlParams(params)}`];
};

export const searchAppointmentPassAPI = (
  params: SearchAppointmentPassParams,
): ApiConfig => {
  return [`${API_URL}/search/${buildUrlParams(params)}`];
};
