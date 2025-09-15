import { Result } from "typescript-result";

import type { Action, PaginatedResponse } from "@bsport/store-base";

import { fetchWebshopItemsAPI } from "#src/api";
import type { WebshopItem } from "#src/types";

import { setWebshopItems } from "./store";

/**
 * Fetches a list of paginated models.
 * @param params.page The page number.
 * @param params.page_size The number of items per page.
 */
export const fetchWebshopItemsAction: Action<
  { page: number; page_size: number },
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
      });

      return data;
    },
    (error) => new Error("Failed to fetch models", { cause: error }),
  );
};
