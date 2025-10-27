import { Result } from "typescript-result";

import {
  type Action,
  type PaginatedResponse,
  type SearchResponse,
  createErrorWithContext,
} from "@bsport/store-base";

import {
  fetchEstablishmentGroupsAPI,
  searchEstablishmentGroupsAPI,
} from "#src/api/establishment-group";
import type {
  EstablishmentGroup,
  FetchEstablishmentGroupQueryParams,
  SearchEstablishmentGroupSearchParams,
} from "#src/types";

import { setEstablishmentGroups } from "./store";

/**
 * Fetches a list of establishment groups.
 * @param params.page The page number to fetch.
 * @param params.page_size The number of results to fetch per page.
 * @param params.id__in The IDs of the establishment groups to fetch.
 */
export const fetchEstablishmentGroupsAction: Action<
  FetchEstablishmentGroupQueryParams,
  PaginatedResponse<EstablishmentGroup>
> = async (fetch, params) => {
  const [uri, init] = fetchEstablishmentGroupsAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setEstablishmentGroups({
        establishmentGroups: data.results,
        page: data.page,
        count: data.count,
        search: false,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(
        error,
        "Failed to fetch list of establishment groups",
      ),
  );
};

/**
 * Searches a list of establishment groups.
 * @param params.q The search query.
 * @param params.page The page number to fetch.
 * @param params.page_size The number of results to fetch per page.
 */
export const searchEstablishmentGroupsAction: Action<
  SearchEstablishmentGroupSearchParams,
  SearchResponse<EstablishmentGroup>
> = async (fetch, params) => {
  const [uri, init] = searchEstablishmentGroupsAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setEstablishmentGroups({
        establishmentGroups: data.results,
        count: data.count,
        page: 1,
        search: true,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, "Failed to search establishment groups"),
  );
};
