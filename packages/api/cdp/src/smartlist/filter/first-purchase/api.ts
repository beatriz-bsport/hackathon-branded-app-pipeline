import { type Fetch } from "@bsport/store-base";

import { SMARTLIST_API_V1 } from "../../constants";
import type {
  CreateFirstPurchaseFilterPayload,
  FirstPurchaseFilter,
  UpdateFirstPurchaseFilterPayload,
} from "./types";

const FIRST_PURCHASE_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/first_purchase`;

export const createFirstPurchaseFilter = async (
  fetch: Fetch<FirstPurchaseFilter>,
  payload: CreateFirstPurchaseFilterPayload,
): Promise<FirstPurchaseFilter> => {
  const { data } = await fetch(`${FIRST_PURCHASE_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export const patchFirstPurchaseFilter = async (
  fetch: Fetch<FirstPurchaseFilter>,
  filterId: number,
  payload: UpdateFirstPurchaseFilterPayload,
): Promise<FirstPurchaseFilter> => {
  const { data } = await fetch(
    `${FIRST_PURCHASE_FILTER_ENDPOINT}/${filterId}/`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return data;
};

export const deleteFirstPurchaseFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${FIRST_PURCHASE_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};
