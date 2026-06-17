import { mutationOptions } from "@tanstack/react-query";

import { type Fetch } from "@bsport/store-base";

import { SMARTLIST_API_V1 } from "../../constants";
import type {
  CreateReferrerFilterPayload,
  ReferrerFilter,
  UpdateReferrerFilterPayload,
  UpsertReferrerFilterVariables,
} from "./types";

const REFERRER_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/referrer`;

/**
 * Creates a referrer filter row.
 */
export const createReferrerFilter = async (
  fetch: Fetch<ReferrerFilter>,
  payload: CreateReferrerFilterPayload,
): Promise<ReferrerFilter> => {
  const { data } = await fetch(`${REFERRER_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

/**
 * Partially updates a referrer filter row.
 */
export const patchReferrerFilter = async (
  fetch: Fetch<ReferrerFilter>,
  filterId: number,
  payload: UpdateReferrerFilterPayload,
): Promise<ReferrerFilter> => {
  const { data } = await fetch(`${REFERRER_FILTER_ENDPOINT}/${filterId}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return data;
};

/**
 * Deletes a referrer filter row.
 */
export const deleteReferrerFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${REFERRER_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};

export const createReferrerFilterMutationOptions = (
  fetch: Fetch<ReferrerFilter>,
) =>
  mutationOptions({
    mutationFn: (payload: CreateReferrerFilterPayload) =>
      createReferrerFilter(fetch, payload),
  });

export const patchReferrerFilterMutationOptions = (
  fetch: Fetch<ReferrerFilter>,
) =>
  mutationOptions({
    mutationFn: ({
      filterId,
      payload,
    }: {
      filterId: number;
      payload: UpdateReferrerFilterPayload;
    }) => patchReferrerFilter(fetch, filterId, payload),
  });

export const upsertReferrerFilterMutationOptions = (
  fetch: Fetch<ReferrerFilter>,
) =>
  mutationOptions({
    mutationFn: async ({
      filterId,
      createPayload,
      updatePayload,
    }: UpsertReferrerFilterVariables) => {
      if (!filterId) {
        if (!createPayload) {
          throw new Error("Missing payload to create referrer filter.");
        }
        return createReferrerFilter(fetch, createPayload);
      }

      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        throw new Error("Missing payload to update referrer filter.");
      }

      return patchReferrerFilter(fetch, filterId, updatePayload);
    },
  });

export const deleteReferrerFilterMutationOptions = (fetch: Fetch<void>) =>
  mutationOptions({
    mutationFn: (filterId: number) => deleteReferrerFilter(fetch, filterId),
  });
