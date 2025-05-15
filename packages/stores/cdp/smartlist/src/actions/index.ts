import { Result } from "typescript-result";

import type { Action, Fetch } from "@bsport/store-base";

import {
  createSmartlistAPI,
  deleteSmartlistAPI,
  duplicateSmartlistAPI,
  editSmartlistAPI,
  fetchSearchSmartlistsAPI,
  fetchSmartlistsAPI,
} from "#src/api";
import { selectCount, selectSmartlists } from "#src/selectors";
import { smartlistStore } from "#src/store";
import type {
  CreateSmartlistParams,
  EditSmartlistParams,
  GeneralSmartlistParams,
  Smartlist,
  SmartlistSearchResult,
} from "#src/types";

import { resetFuzzySearch, setPaginationData, setSmartlists } from "./store";

type Params = {
  page: number;
  page_size: number;
  search?: string;
};

function hasSearch(params: Params): params is Required<Params> {
  // we are not interested in undefined or empty strings
  return !!params.search?.trim();
}

/**
 * Fetches smartlists from the API
 * @param fetch - Fetch function to use for the API call
 * @param params - Parameters for fetching smartlists
 * @param params.page - Page number
 * @param params.page_size - Page size
 * @param params.search - Search query
 * @returns A Result containing the fetched smartlists or an error
 */
export const fetchSmartlistsAction = async (
  fetch: Fetch<Smartlist[] | SmartlistSearchResult>,
  params: Params,
) => {
  const currentState = smartlistStore.getState();
  const count = selectCount(currentState);
  const isNotFirstPage = params.page !== 1;
  const hasData = count > 0;
  /**
   * Why?
   * For the time being the API doesn't support pagination
   * We want to implement pagination in the UI in the meantime
   * In any case we are loading all the smartlists at once
   *
   * What's the tradeoff?
   * - We reload when we have page 1 if not we return the cached data
   */
  if (isNotFirstPage && hasData) {
    setPaginationData({ page: params.page, pageSize: params.page_size });

    const updatedState = smartlistStore.getState();
    const smartlists = selectSmartlists(updatedState);

    return Result.ok(smartlists);
  }

  if (hasSearch(params)) {
    return fetchSearchSmartlistsAction(
      fetch as Fetch<SmartlistSearchResult>,
      params,
    );
  }

  // Clear fuzzySearchIds when not searching
  resetFuzzySearch();

  return fetchAllSmartlistsAction(fetch as Fetch<Smartlist[]>, params);
};

const fetchAllSmartlistsAction: Action<Params, Smartlist[]> = async (
  fetch,
  params,
) => {
  const [uri, init] = fetchSmartlistsAPI();

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setSmartlists({
        smartlists: data,
        page: params.page,
        pageSize: params.page_size,
        count: data.length,
      });

      return data;
    },
    (error) => new Error("Failed to fetch smartlists", { cause: error }),
  );
};

const fetchSearchSmartlistsAction: Action<
  Required<Params>,
  SmartlistSearchResult
> = async (fetch, params) => {
  const [uri, init] = fetchSearchSmartlistsAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setSmartlists({
        smartlists: data.results,
        page: 1,
        pageSize: params.page_size,
        count: data.results.length,
        mode: "search",
      });

      return data;
    },
    (error) => new Error("Failed to search smartlists", { cause: error }),
  );
};

/**
 * Creates a new smartlist
 * @param fetch - Fetch function to use for the API call
 * @param params - Parameters for creating a smartlist
 * @param params.name - Name of the smartlist
 * @param params.description - Description of the smartlist
 * @param params.company - Company of the smartlist
 * @returns A Result containing the created smartlist or an error
 */
export const createSmartlistAction: Action<
  CreateSmartlistParams,
  Smartlist
> = async (fetch, params) => {
  const [uri, init] = createSmartlistAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      return data;
    },
    (error) => new Error("Failed to create smartlist", { cause: error }),
  );
};

/**
 * Edits an existing smartlist
 * @param fetch - Fetch function to use for the API call
 * @param params - Parameters for editing the smartlist
 * @param params.name - Name of the smartlist
 * @param params.description - Description of the smartlist
 * @returns A Result containing the updated smartlist or an error
 */
export const editSmartlistAction: Action<
  EditSmartlistParams,
  Smartlist
> = async (fetch, params) => {
  const [uri, init] = editSmartlistAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      return data;
    },
    (error) => new Error("Failed to edit smartlist", { cause: error }),
  );
};

/**
 * Deletes an existing smartlist
 * @param fetch - Fetch function to use for the API call
 * @param params - Parameters for deleting the smartlist
 * @param params.id - ID of the smartlist to delete
 * @returns A Result containing a success boolean or an error
 */
export const deleteSmartlistAction: Action<
  GeneralSmartlistParams,
  boolean
> = async (fetch, params) => {
  const [uri, init] = deleteSmartlistAPI(params);

  return Result.try(
    async () => {
      await fetch(uri, init);

      return true;
    },
    (error) => new Error("Failed to delete smartlist", { cause: error }),
  );
};

/**
 * Creates a copy of an existing smartlist
 * @param fetch - Fetch function to use for the API call
 * @param params - Parameters for duplicating the smartlist
 * @param params.id - ID of the smartlist to duplicate
 * @returns A Result containing the newly created smartlist or an error
 */
export const duplicateSmartlistAction: Action<
  GeneralSmartlistParams,
  Smartlist
> = async (fetch, params) => {
  const [uri, init] = duplicateSmartlistAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      return data;
    },
    (error) => new Error("Failed to duplicate smartlist", { cause: error }),
  );
};
