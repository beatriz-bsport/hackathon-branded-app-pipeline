import { Result } from "typescript-result";

import {
  type Action,
  SearchResponse,
  createErrorWithContext,
} from "@bsport/store-base";

import { fetchPrivateServicesAPI, searchPrivateServicesAPI } from "#src/api";
import type {
  FetchPrivateServiceParams,
  PrivateService,
  SearchPrivateServiceParams,
} from "#src/types";

import { setPrivateServices, setSearchedPrivateServices } from "./store";

/**
 * Fetches a list of private services.
 * @param params.mine Whether to fetch only user's private services.
 */
export const fetchModelsAction: Action<
  FetchPrivateServiceParams,
  PrivateService[]
> = async (fetch, params) => {
  const [uri, init] = fetchPrivateServicesAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setPrivateServices({
        privateServices: data,
        page: 1,
        count: data.length,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, "Failed to fetch private services"),
  );
};

/**
 * Fetches a list of private services.
 * @param params.q The search query.
 * @param params.page The page number to fetch.
 * @param params.page_size The number of results to fetch per page.
 * @param params.mine Whether to fetch only user's private services.
 */
export const searchPrivateServicesAction: Action<
  SearchPrivateServiceParams,
  SearchResponse<PrivateService>
> = async (fetch, params) => {
  const [uri, init] = searchPrivateServicesAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setSearchedPrivateServices({
        privateServices: data.results,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, "Failed to search private services"),
  );
};
