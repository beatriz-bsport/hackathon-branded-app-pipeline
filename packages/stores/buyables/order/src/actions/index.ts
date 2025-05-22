import { Result } from "typescript-result";

import type { Action, PaginatedResponse } from "@bsport/store-base";

import { type FetchOrdersParams, fetchOrdersAPI } from "#src/api";
import type { Order } from "#src/types";

import { setOrders } from "./store";

/**
 * Fetches a list of paginated orders.
 * @param params.page The page number.
 * @param params.page_size The number of items per page.
 * @param params.company [Optional] The company to which should belong the member that has created the order.
 * @param params.state [Optional] The order status.
 * @param params.member [Optional] Id of a member to get only the orders of this member.
 */
export const fetchOrdersAction: Action<
  FetchOrdersParams,
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
