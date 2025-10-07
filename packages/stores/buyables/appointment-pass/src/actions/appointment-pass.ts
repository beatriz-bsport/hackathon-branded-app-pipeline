import { Result } from "typescript-result";

import {
  type Action,
  type PaginatedResponse,
  type SearchResponse,
  createErrorWithContext,
} from "@bsport/store-base";

import {
  fetchAppointmentPassesAPI,
  searchAppointmentPassesAPI,
} from "#src/api/appointment-pass";
import type {
  AppointmentPass,
  FetchAppointmentPassesParams,
  SearchAppointmentPassesParams,
} from "#src/types";

import {
  setPaginatedAppointmentPassesList,
  setSearchedAppointmentPasses,
} from "./store";

/**
 * Fetches a list of paginated appointment pass.
 * @param params.page The page number.
 * @param params.page_size The number of items per page.
 * @param params.id__in The IDs of the appointment passes to fetch.
 */
export const fetchAppointmentPassesAction: Action<
  FetchAppointmentPassesParams,
  PaginatedResponse<AppointmentPass>
> = async (fetch, params) => {
  const [uri, init] = fetchAppointmentPassesAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setPaginatedAppointmentPassesList({
        appointmentPasses: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(
        error,
        "Failed to fetch paginated list of appointment passes",
      ),
  );
};

/**
 * Fetches a list of all appointment pass.
 */
export const fetchAllAppointmentPassesAction: Action<
  void,
  AppointmentPass[]
> = async (fetch) => {
  const [uri, init] = fetchAppointmentPassesAPI();

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setPaginatedAppointmentPassesList({
        appointmentPasses: data,
        page: 1,
        count: data.length,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, "Failed to fetch all appointment passes"),
  );
};

/**
 * Searched through a list of appointment pass and return a paginated list.
 * @param params.q The search query.
 * @param params.page The page number.
 * @param params.page_size The number of items per page.
 * @param params.id__in The IDs of the appointment passes to fetch.
 */
export const searchAppointmentPassesAction: Action<
  SearchAppointmentPassesParams,
  SearchResponse<AppointmentPass>
> = async (fetch, params) => {
  const [uri, init] = searchAppointmentPassesAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setSearchedAppointmentPasses({
        appointmentPasses: data.results,
        count: data.count,
        page: 1,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(
        error,
        "Failed to search for a list of appointment pass",
      ),
  );
};
