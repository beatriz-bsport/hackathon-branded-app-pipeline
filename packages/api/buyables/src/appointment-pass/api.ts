import {
  type ApiConfig,
  type Fetch,
  type PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import { QUERY_KEY_MAIN } from "#src/constants";

import type { AppointmentPass, FetchAppointmentPassesParams } from "./types";

const APPOINTMENT_PASS_API_URL = "book/v1/private_service/private_pass";

export const appointmentPassKeys = {
  all: [QUERY_KEY_MAIN, "appointment-pass"] as const,
  list: (params: FetchAppointmentPassesParams) =>
    [...appointmentPassKeys.all, "list", params] as const,
} as const;

const fetchAppointmentPassesAPIConfig = (
  params: FetchAppointmentPassesParams,
): ApiConfig => {
  return [`${APPOINTMENT_PASS_API_URL}/${buildUrlParams(params)}`];
};

/**
 * Fetches a paginated list of appointment passes (PrivatePass).
 *
 * @param fetch - The authenticated fetch function.
 * @param params - Query parameters (pagination, search, filters).
 */
export const fetchAppointmentPassesAPI = async (
  fetch: Fetch<PaginatedResponse<AppointmentPass>>,
  params: FetchAppointmentPassesParams,
): Promise<PaginatedResponse<AppointmentPass>> => {
  const [uri, init] = fetchAppointmentPassesAPIConfig(params);
  const { data } = await fetch(uri, init);
  return data;
};
