import { Result } from "typescript-result";

import { fetchEstablishments, searchEstablishments } from "@bsport/api-core";
import {
  type Action,
  type PaginatedResponse,
  type SearchResponse,
  createErrorWithContext,
} from "@bsport/store-base";

import type {
  Establishment,
  FetchEstablishmentParams,
  SearchEstablishmentParams,
} from "#src/types";

import { setEstablishments } from "./store";

/**
 * Fetches a list of establishments.
 * @param params.page The page number to fetch.
 * @param params.page_size The number of results to fetch per page.
 * @param params.id__in The IDs of the establishments to fetch.
 */
export const fetchEstablishmentsAction: Action<
  FetchEstablishmentParams,
  PaginatedResponse<Establishment>
> = async (fetch, params) => {
  return Result.try(
    async () => {
      const data = await fetchEstablishments(fetch, params);

      setEstablishments({
        establishments: data.results,
        page: data.page,
        count: data.count,
        search: false,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, "Failed to fetch list of establishments"),
  );
};

/**
 * Searches a list of establishments.
 * @param params.q The search query.
 * @param params.page The page number to fetch.
 * @param params.page_size The number of results to fetch per page.
 */
export const searchEstablishmentsAction: Action<
  SearchEstablishmentParams,
  SearchResponse<Establishment>
> = async (fetch, params) => {
  return Result.try(
    async () => {
      const data = await searchEstablishments(fetch, params);

      setEstablishments({
        establishments: data.results,
        count: data.count,
        page: 1,
        search: true,
      });

      return data;
    },
    (error) => createErrorWithContext(error, "Failed to search establishments"),
  );
};
