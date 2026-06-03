import { type Fetch } from "@bsport/store-base";

import { SMARTLIST_API_V1 } from "../../constants";
import type {
  CreateCreditAccountFilterPayload,
  CreditAccountFilter,
  UpdateCreditAccountFilterPayload,
} from "./types";

const CREDIT_ACCOUNT_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/credit_account_filter`;

export const createCreditAccountFilter = async (
  fetch: Fetch<CreditAccountFilter>,
  payload: CreateCreditAccountFilterPayload,
): Promise<CreditAccountFilter> => {
  const { data } = await fetch(`${CREDIT_ACCOUNT_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export const patchCreditAccountFilter = async (
  fetch: Fetch<CreditAccountFilter>,
  filterId: number,
  payload: UpdateCreditAccountFilterPayload,
): Promise<CreditAccountFilter> => {
  const { data } = await fetch(
    `${CREDIT_ACCOUNT_FILTER_ENDPOINT}/${filterId}/`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return data;
};

export const deleteCreditAccountFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${CREDIT_ACCOUNT_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};
