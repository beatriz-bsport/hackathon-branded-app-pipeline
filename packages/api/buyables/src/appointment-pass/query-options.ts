import { queryOptions } from "@tanstack/react-query";

import { Fetch, PaginatedResponse } from "@bsport/store-base";

import { appointmentPassKeys, fetchAppointmentPassesAPI } from "./api";
import { AppointmentPass, FetchAppointmentPassesParams } from "./types";

const APPOINTMENT_PASS_STALE_TIME = 2 * 60 * 1000;

export const appointmentPassesQueryOptions = (
  fetch: Fetch<PaginatedResponse<AppointmentPass>>,
  params: FetchAppointmentPassesParams,
) =>
  queryOptions({
    queryKey: appointmentPassKeys.list(params),
    queryFn: () => fetchAppointmentPassesAPI(fetch, params),
    staleTime: APPOINTMENT_PASS_STALE_TIME,
  });
