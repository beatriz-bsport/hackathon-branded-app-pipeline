import { Result } from "typescript-result";

import {
  type Action,
  type PaginatedResponse,
  type SearchResponse,
  createErrorWithContext,
} from "@bsport/store-base";

import { fetchEstablishmentsAPI, searchEstablishmentsAPI } from "#src/api";
import type {
  Establishment,
  FetchEstablishmentParams,
  SearchEstablishmentParams,
} from "#src/types";

import { setEstablishments, setSearchedEstablishments } from "./store";

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
  const [uri, init] = fetchEstablishmentsAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setEstablishments({
        establishments: data.results,
        page: data.page,
        count: data.count,
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
  const [uri, init] = searchEstablishmentsAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setSearchedEstablishments({
        establishments: data.results,
        count: data.count,
        page: 1,
      });

      return data;
    },
    (error) => createErrorWithContext(error, "Failed to search establishments"),
  );
};
