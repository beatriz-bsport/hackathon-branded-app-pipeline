import { Result } from "typescript-result";

import type { Action, Fetch } from "@bsport/store-base";

import { fetchSearchSmartlistsAPI, fetchSmartlistsAPI } from "#src/api";
import { selectCount, selectSmartlists } from "#src/selectors";
import { smartlistStore } from "#src/store";
import type { Smartlist, SmartlistSearchResult } from "#src/types";

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
