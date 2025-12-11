import { Result } from "typescript-result";

import {
  fetchEstablishmentGroups,
  searchEstablishmentGroups,
} from "@bsport/api-core";
import {
  type Action,
  type PaginatedResponse,
  type SearchResponse,
  createErrorWithContext,
} from "@bsport/store-base";

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
  return Result.try(
    async () => {
      const data = await fetchEstablishmentGroups(fetch, params);

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
  return Result.try(
    async () => {
      const data = await searchEstablishmentGroups(fetch, params);

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
