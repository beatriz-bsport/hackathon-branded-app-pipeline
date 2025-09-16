import { Result } from "typescript-result";

import {
  type Action,
  type SearchResponse,
  createErrorWithContext,
} from "@bsport/store-base";

import { fetchAppointmentsAPI, searchAppointmentsAPI } from "#src/api";
import type {
  Appointment,
  FetchAppointmentParams,
  SearchAppointmentParams,
} from "#src/types";

import { setAppointments, setSearchedAppointments } from "./store";

/**
 * Fetches a list of appointments.
 * @param params.mine Whether to fetch only user's appointments.
 * @param params.id__in array of ids to fetch.
 */
export const fetchAppointmentsAction: Action<
  FetchAppointmentParams,
  Appointment[]
> = async (fetch, params) => {
  const [uri, init] = fetchAppointmentsAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setAppointments({
        appointments: data,
        page: 1,
        count: data.length,
      });

      return data;
    },
    (error) => createErrorWithContext(error, "Failed to fetch appointments"),
  );
};

/**
 * Fetches a list of appointments.
 * @param params.q The search query.
 * @param params.page The page number to fetch.
 * @param params.page_size The number of results to fetch per page.
 * @param params.mine Whether to fetch only user's appointments.
 */
export const searchAppointmentsAction: Action<
  SearchAppointmentParams,
  SearchResponse<Appointment>
> = async (fetch, params) => {
  const [uri, init] = searchAppointmentsAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setSearchedAppointments({
        appointments: data.results,
        count: data.count,
        page: 1,
      });

      return data;
    },
    (error) => createErrorWithContext(error, "Failed to search appointments"),
  );
};
