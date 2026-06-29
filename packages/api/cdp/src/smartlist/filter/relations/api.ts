import { mutationOptions } from "@tanstack/react-query";

import { type Fetch } from "@bsport/store-base";

import { SMARTLIST_API_V1 } from "../../constants";
import type {
  CreateRelationsFilterPayload,
  RelationsFilter,
  UpdateRelationsFilterPayload,
  UpsertRelationsFilterVariables,
} from "./types";

const RELATIONS_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/relations`;

/**
 * Creates a relationships filter row.
 */
export const createRelationsFilter = async (
  fetch: Fetch<RelationsFilter>,
  payload: CreateRelationsFilterPayload,
): Promise<RelationsFilter> => {
  const { data } = await fetch(`${RELATIONS_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

/**
 * Partially updates a relationships filter row.
 */
export const patchRelationsFilter = async (
  fetch: Fetch<RelationsFilter>,
  filterId: number,
  payload: UpdateRelationsFilterPayload,
): Promise<RelationsFilter> => {
  const { data } = await fetch(`${RELATIONS_FILTER_ENDPOINT}/${filterId}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return data;
};

/**
 * Deletes a relationships filter row.
 */
export const deleteRelationsFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${RELATIONS_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};

export const createRelationsFilterMutationOptions = (
  fetch: Fetch<RelationsFilter>,
) =>
  mutationOptions({
    mutationFn: (payload: CreateRelationsFilterPayload) =>
      createRelationsFilter(fetch, payload),
  });

export const patchRelationsFilterMutationOptions = (
  fetch: Fetch<RelationsFilter>,
) =>
  mutationOptions({
    mutationFn: ({
      filterId,
      payload,
    }: {
      filterId: number;
      payload: UpdateRelationsFilterPayload;
    }) => patchRelationsFilter(fetch, filterId, payload),
  });

export const upsertRelationsFilterMutationOptions = (
  fetch: Fetch<RelationsFilter>,
) =>
  mutationOptions({
    mutationFn: async ({
      filterId,
      createPayload,
      updatePayload,
    }: UpsertRelationsFilterVariables) => {
      if (!filterId) {
        if (!createPayload) {
          throw new Error("Missing payload to create relationships filter.");
        }
        return createRelationsFilter(fetch, createPayload);
      }

      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        throw new Error("Missing payload to update relationships filter.");
      }

      return patchRelationsFilter(fetch, filterId, updatePayload);
    },
  });

export const deleteRelationsFilterMutationOptions = (fetch: Fetch<void>) =>
  mutationOptions({
    mutationFn: (filterId: number) => deleteRelationsFilter(fetch, filterId),
  });
