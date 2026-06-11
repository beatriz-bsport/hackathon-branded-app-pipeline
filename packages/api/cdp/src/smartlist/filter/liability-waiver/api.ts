import { mutationOptions } from "@tanstack/react-query";

import { type Fetch } from "@bsport/store-base";

import { SMARTLIST_API_V1 } from "../../constants";
import type {
  CreateLiabilityWaiverFilterPayload,
  LiabilityWaiverFilter,
  UpdateLiabilityWaiverFilterPayload,
  UpsertLiabilityWaiverFilterVariables,
} from "./types";

const LIABILITY_WAIVER_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/waiver`;

export const createLiabilityWaiverFilter = async (
  fetch: Fetch<LiabilityWaiverFilter>,
  payload: CreateLiabilityWaiverFilterPayload,
): Promise<LiabilityWaiverFilter> => {
  const { data } = await fetch(`${LIABILITY_WAIVER_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export const patchLiabilityWaiverFilter = async (
  fetch: Fetch<LiabilityWaiverFilter>,
  filterId: number,
  payload: UpdateLiabilityWaiverFilterPayload,
): Promise<LiabilityWaiverFilter> => {
  const { data } = await fetch(
    `${LIABILITY_WAIVER_FILTER_ENDPOINT}/${filterId}/`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return data;
};

export const deleteLiabilityWaiverFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${LIABILITY_WAIVER_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};

export const createLiabilityWaiverFilterMutationOptions = (
  fetch: Fetch<LiabilityWaiverFilter>,
) =>
  mutationOptions({
    mutationFn: (payload: CreateLiabilityWaiverFilterPayload) =>
      createLiabilityWaiverFilter(fetch, payload),
  });

export const patchLiabilityWaiverFilterMutationOptions = (
  fetch: Fetch<LiabilityWaiverFilter>,
) =>
  mutationOptions({
    mutationFn: ({
      filterId,
      payload,
    }: {
      filterId: number;
      payload: UpdateLiabilityWaiverFilterPayload;
    }) => patchLiabilityWaiverFilter(fetch, filterId, payload),
  });

export const upsertLiabilityWaiverFilterMutationOptions = (
  fetch: Fetch<LiabilityWaiverFilter>,
) =>
  mutationOptions({
    mutationFn: async ({
      filterId,
      createPayload,
      updatePayload,
    }: UpsertLiabilityWaiverFilterVariables) => {
      if (!filterId) {
        if (!createPayload) {
          throw new Error("Missing payload to create liability waiver filter.");
        }
        return createLiabilityWaiverFilter(fetch, createPayload);
      }

      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        throw new Error("Missing payload to update liability waiver filter.");
      }

      return patchLiabilityWaiverFilter(fetch, filterId, updatePayload);
    },
  });

export const deleteLiabilityWaiverFilterMutationOptions = (
  fetch: Fetch<void>,
) =>
  mutationOptions({
    mutationFn: (filterId: number) =>
      deleteLiabilityWaiverFilter(fetch, filterId),
  });
