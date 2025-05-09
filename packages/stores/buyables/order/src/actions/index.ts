import { Result } from "typescript-result";

import type { Action, PaginatedResponse } from "@bsport/store-base";

import { fetchOrdersAPI } from "#src/api";
import type { Order } from "#src/types";

import { setOrders } from "./store";

/**
 * Fetches a list of paginated orders.
 * @param params.page The page number.
 * @param params.page_size The number of items per page.
 */
export const fetchOrdersAction: Action<
  { page: number; page_size: number },
  PaginatedResponse<Order>
> = async (fetch, params) => {
  const [uri, init] = fetchOrdersAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setOrders({
        orders: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) => new Error("Failed to fetch orders", { cause: error }),
  );
};
