import { Result } from "typescript-result";

import type {
  Action,
  PaginatedResponse,
  SearchResponse,
} from "@bsport/store-base";
import { DEFAULT_PAGE, createErrorWithContext } from "@bsport/store-base";

import {
  fetchWebshopItemsAPI,
  searchWebshopItemsAPI,
} from "#src/api/webshop-item";
import type {
  FetchWebshopItemsParams,
  SearchWebshopItemsParams,
  WebshopItem,
} from "#src/types";

import { setWebshopItems } from "./store";

export const fetchWebshopItemsAction: Action<
  FetchWebshopItemsParams,
  PaginatedResponse<WebshopItem>
> = async (fetch, params) => {
  const [uri, init] = fetchWebshopItemsAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setWebshopItems({
        webshopItems: data.results,
        page: data.page,
        count: data.count,
        kind: "active",
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch webshop items",
        params,
      }),
  );
};

export const searchWebshopItemsAction: Action<
  SearchWebshopItemsParams,
  SearchResponse<WebshopItem>
> = async (fetch, params) => {
  const [uri, init] = searchWebshopItemsAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setWebshopItems({
        webshopItems: data.results,
        page: DEFAULT_PAGE,
        count: data.count,
        kind: "searched",
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to search webshop items",
        params,
      }),
  );
};
