import { mutationOptions } from "@tanstack/react-query";

import { type Fetch } from "@bsport/store-base";

import { SMARTLIST_API_V1 } from "../../constants";
import type {
  CreateHasPasswordFilterPayload,
  HasPasswordFilter,
  UpdateHasPasswordFilterPayload,
  UpsertHasPasswordFilterVariables,
} from "./types";

const HAS_PASSWORD_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/has_password`;

export const createHasPasswordFilter = async (
  fetch: Fetch<HasPasswordFilter>,
  payload: CreateHasPasswordFilterPayload,
): Promise<HasPasswordFilter> => {
  const { data } = await fetch(`${HAS_PASSWORD_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export const patchHasPasswordFilter = async (
  fetch: Fetch<HasPasswordFilter>,
  filterId: number,
  payload: UpdateHasPasswordFilterPayload,
): Promise<HasPasswordFilter> => {
  const { data } = await fetch(`${HAS_PASSWORD_FILTER_ENDPOINT}/${filterId}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return data;
};

export const deleteHasPasswordFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${HAS_PASSWORD_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};

export const createHasPasswordFilterMutationOptions = (
  fetch: Fetch<HasPasswordFilter>,
) =>
  mutationOptions({
    mutationFn: (payload: CreateHasPasswordFilterPayload) =>
      createHasPasswordFilter(fetch, payload),
  });

export const patchHasPasswordFilterMutationOptions = (
  fetch: Fetch<HasPasswordFilter>,
) =>
  mutationOptions({
    mutationFn: ({
      filterId,
      payload,
    }: {
      filterId: number;
      payload: UpdateHasPasswordFilterPayload;
    }) => patchHasPasswordFilter(fetch, filterId, payload),
  });

export const upsertHasPasswordFilterMutationOptions = (
  fetch: Fetch<HasPasswordFilter>,
) =>
  mutationOptions({
    mutationFn: async ({
      filterId,
      createPayload,
      updatePayload,
    }: UpsertHasPasswordFilterVariables) => {
      if (!filterId) {
        if (!createPayload) {
          throw new Error("Missing payload to create has password filter.");
        }
        return createHasPasswordFilter(fetch, createPayload);
      }

      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        throw new Error("Missing payload to update has password filter.");
      }

      return patchHasPasswordFilter(fetch, filterId, updatePayload);
    },
  });

export const deleteHasPasswordFilterMutationOptions = (fetch: Fetch<void>) =>
  mutationOptions({
    mutationFn: (filterId: number) => deleteHasPasswordFilter(fetch, filterId),
  });
