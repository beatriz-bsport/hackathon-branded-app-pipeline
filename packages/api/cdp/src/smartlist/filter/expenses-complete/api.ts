import { mutationOptions } from "@tanstack/react-query";

import { type Fetch } from "@bsport/store-base";

import { SMARTLIST_API_V1 } from "../../constants";
import type {
  CreateExpensesCompleteFilterPayload,
  ExpensesCompleteFilter,
  UpdateExpensesCompleteFilterPayload,
  UpsertExpensesCompleteFilterVariables,
} from "./types";

const EXPENSES_COMPLETE_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/expenses_complete`;

export const createExpensesCompleteFilter = async (
  fetch: Fetch<ExpensesCompleteFilter>,
  payload: CreateExpensesCompleteFilterPayload,
): Promise<ExpensesCompleteFilter> => {
  const { data } = await fetch(`${EXPENSES_COMPLETE_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export const patchExpensesCompleteFilter = async (
  fetch: Fetch<ExpensesCompleteFilter>,
  filterId: number,
  payload: UpdateExpensesCompleteFilterPayload,
): Promise<ExpensesCompleteFilter> => {
  const { data } = await fetch(
    `${EXPENSES_COMPLETE_FILTER_ENDPOINT}/${filterId}/`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return data;
};

export const deleteExpensesCompleteFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${EXPENSES_COMPLETE_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};

export const createExpensesCompleteFilterMutationOptions = (
  fetch: Fetch<ExpensesCompleteFilter>,
) =>
  mutationOptions({
    mutationFn: (payload: CreateExpensesCompleteFilterPayload) =>
      createExpensesCompleteFilter(fetch, payload),
  });

export const patchExpensesCompleteFilterMutationOptions = (
  fetch: Fetch<ExpensesCompleteFilter>,
) =>
  mutationOptions({
    mutationFn: ({
      filterId,
      payload,
    }: {
      filterId: number;
      payload: UpdateExpensesCompleteFilterPayload;
    }) => patchExpensesCompleteFilter(fetch, filterId, payload),
  });

export const upsertExpensesCompleteFilterMutationOptions = (
  fetch: Fetch<ExpensesCompleteFilter>,
) =>
  mutationOptions({
    mutationFn: async ({
      filterId,
      createPayload,
      updatePayload,
    }: UpsertExpensesCompleteFilterVariables) => {
      if (!filterId) {
        if (!createPayload) {
          throw new Error("Missing payload to create purchase history filter.");
        }
        return createExpensesCompleteFilter(fetch, createPayload);
      }

      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        throw new Error("Missing payload to update purchase history filter.");
      }

      return patchExpensesCompleteFilter(fetch, filterId, updatePayload);
    },
  });

export const deleteExpensesCompleteFilterMutationOptions = (
  fetch: Fetch<void>,
) =>
  mutationOptions({
    mutationFn: (filterId: number) =>
      deleteExpensesCompleteFilter(fetch, filterId),
  });
