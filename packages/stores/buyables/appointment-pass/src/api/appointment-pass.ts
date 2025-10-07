import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

import type {
  FetchAppointmentPassesParams,
  SearchAppointmentPassesParams,
} from "#src/types";

import { API_URL } from "./constants";

const APPOINTMENT_PASS_API_URL = `${API_URL}/private_pass`;

export const fetchAppointmentPassesAPI = (
  params: FetchAppointmentPassesParams = {},
): ApiConfig => {
  return [`${APPOINTMENT_PASS_API_URL}/${buildUrlParams(params)}`];
};

export const searchAppointmentPassesAPI = (
  params: SearchAppointmentPassesParams,
): ApiConfig => {
  return [`${APPOINTMENT_PASS_API_URL}/search/${buildUrlParams(params)}`];
};
