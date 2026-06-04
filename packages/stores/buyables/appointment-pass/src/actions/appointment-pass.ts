import { Result } from "typescript-result";

import {
  fetchAppointmentPassesAPI,
  searchAppointmentPassesAPI,
} from "@bsport/api-buyables/appointment-pass";
import {
  type Action,
  type PaginatedResponse,
  type SearchResponse,
  createErrorWithContext,
} from "@bsport/store-base";

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
  return Result.try(
    async () => {
      const data = await fetchAppointmentPassesAPI(fetch, params);

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
  return Result.try(
    async () => {
      const data = await searchAppointmentPassesAPI(fetch, params);

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
