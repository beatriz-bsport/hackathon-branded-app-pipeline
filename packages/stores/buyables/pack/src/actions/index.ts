import { Result } from "typescript-result";

import {
  type Action,
  type PaginatedResponse,
  type SearchResponse,
  createErrorWithContext,
} from "@bsport/store-base";

import {
  type FetchPacksParams,
  type FuzzySearchParams,
  archivePackAPI,
  createPackAPI,
  fetchPackAPI,
  fetchPacksAPI,
  fuzzySearchPacksAPI,
  restorePackAPI,
} from "#src/api";
import type { Pack, PackFormData } from "#src/types";

import { setFuzzyPacks, setPacks, updatePack } from "./store";

/**
 * Fetch a list of paginated packs.
 * @param params.page The page number.
 * @param params.page_size The number of items per page.
 * @param params.archived [Optional] If provided, filter on 'available' field.
 * @param params.include_expired [Optional] Whether to include Pack with a passed expiration date.
 * @param params.offer [Optionam] If an id is provided, select Packs with a Pass compatible with the offer.
 */
export const fetchPacksAction: Action<
  FetchPacksParams,
  PaginatedResponse<Pack>
> = async (fetch, params) => {
  const [uri, init] = fetchPacksAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setPacks({
        packs: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch packs",
        params,
      }),
  );
};

/**
 * Fuzzy search a list of packs.
 * @param params.queryString The string to make the search comparison with.
 * @param params.page_size The number of items for the search.
 * @param params.archived [Optional] If provided, filter on 'available' field.
 * @param params.include_expired [Optional] Whether to include Pack with a passed expiration date.
 * @param params.offer [Optionam] If an id is provided, select Packs with a Pass compatible with the offer.
 */
export const fuzzySearchPacksAction: Action<
  FuzzySearchParams,
  SearchResponse<Pack>
> = async (fetch, params) => {
  const [uri, init] = fuzzySearchPacksAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setFuzzyPacks({
        packs: data.results,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fuzzy search packs",
        params,
      }),
  );
};

export const fetchPackAction: Action<{ id: number }, Pack> = async (
  fetch,
  params,
) => {
  const [uri, init] = fetchPackAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updatePack(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: `Failed to fetch pack n°${params.id}`,
        params,
      }),
  );
};

/**
 * Archive an active Pack (PaymentCombo)
 * @param id Id of the Pack to archive
 */
export const archivePackAction: Action<{ id: number }, Pack> = async (
  fetch,
  params,
) => {
  const [uri, init] = archivePackAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updatePack(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: `Failed to archive pack n°${params.id}`,
        params,
      }),
  );
};

/**
 * Restore an archived Pack (PaymentCombo)
 * @param id Id of the Pack to restore
 */
export const restorePackAction: Action<{ id: number }, Pack> = async (
  fetch,
  params,
) => {
  const [uri, init] = restorePackAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updatePack(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: `Failed to restore pack n°${params.id}`,
        params,
      }),
  );
};

export const createPackAction: Action<PackFormData, Pack> = async (
  fetch,
  params,
) => {
  const [uri, init] = createPackAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      updatePack(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: `Failed to create pack`,
        params,
      }),
  );
};
