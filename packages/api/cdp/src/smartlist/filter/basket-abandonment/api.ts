import { type Fetch } from "@bsport/store-base";

import { SMARTLIST_API_V1 } from "../../constants";
import type {
  BasketAbandonmentFilter,
  CreateBasketAbandonmentFilterPayload,
  UpdateBasketAbandonmentFilterPayload,
} from "./types";

const BASKET_ABANDONMENT_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/basket_abandonment`;

export const createBasketAbandonmentFilter = async (
  fetch: Fetch<BasketAbandonmentFilter>,
  payload: CreateBasketAbandonmentFilterPayload,
): Promise<BasketAbandonmentFilter> => {
  const { data } = await fetch(`${BASKET_ABANDONMENT_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export const patchBasketAbandonmentFilter = async (
  fetch: Fetch<BasketAbandonmentFilter>,
  filterId: number,
  payload: UpdateBasketAbandonmentFilterPayload,
): Promise<BasketAbandonmentFilter> => {
  const { data } = await fetch(
    `${BASKET_ABANDONMENT_FILTER_ENDPOINT}/${filterId}/`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return data;
};

export const deleteBasketAbandonmentFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${BASKET_ABANDONMENT_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};
