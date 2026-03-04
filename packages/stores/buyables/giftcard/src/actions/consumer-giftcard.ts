import { Result } from "typescript-result";

import {
  type ConsumerGiftcard,
  type FetchConsumerGiftcardsParams,
  fetchConsumerGiftcardsAPI,
} from "@bsport/api-buyables";
import type { Action, PaginatedResponse } from "@bsport/store-base";
import { createErrorWithContext } from "@bsport/store-base";

import { setConsumerGiftcards } from "./store";

export const fetchConsumerGiftcardsAction: Action<
  FetchConsumerGiftcardsParams,
  PaginatedResponse<ConsumerGiftcard>
> = async (fetch, params) => {
  return Result.try(
    async () => {
      const data = await fetchConsumerGiftcardsAPI(fetch, params);

      setConsumerGiftcards({
        objects: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch Consumer Giftcards",
        params,
      }),
  );
};
