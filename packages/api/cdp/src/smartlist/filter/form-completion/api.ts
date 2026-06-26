import { mutationOptions } from "@tanstack/react-query";

import { type Fetch } from "@bsport/store-base";

import { SMARTLIST_API_V1 } from "../../constants";
import type {
  CreateCustomFormFilterPayload,
  CustomFormFilter,
  UpdateCustomFormFilterPayload,
  UpsertCustomFormFilterVariables,
} from "./types";

const CUSTOM_FORM_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/custom_form`;

/**
 * Creates a custom form completion filter row.
 */
export const createCustomFormFilter = async (
  fetch: Fetch<CustomFormFilter>,
  payload: CreateCustomFormFilterPayload,
): Promise<CustomFormFilter> => {
  const { data } = await fetch(`${CUSTOM_FORM_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

/**
 * Partially updates a custom form completion filter row.
 */
export const patchCustomFormFilter = async (
  fetch: Fetch<CustomFormFilter>,
  filterId: number,
  payload: UpdateCustomFormFilterPayload,
): Promise<CustomFormFilter> => {
  const { data } = await fetch(`${CUSTOM_FORM_FILTER_ENDPOINT}/${filterId}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return data;
};

/**
 * Deletes a custom form completion filter row.
 */
export const deleteCustomFormFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${CUSTOM_FORM_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};

export const createCustomFormFilterMutationOptions = (
  fetch: Fetch<CustomFormFilter>,
) =>
  mutationOptions({
    mutationFn: (payload: CreateCustomFormFilterPayload) =>
      createCustomFormFilter(fetch, payload),
  });

export const patchCustomFormFilterMutationOptions = (
  fetch: Fetch<CustomFormFilter>,
) =>
  mutationOptions({
    mutationFn: ({
      filterId,
      payload,
    }: {
      filterId: number;
      payload: UpdateCustomFormFilterPayload;
    }) => patchCustomFormFilter(fetch, filterId, payload),
  });

export const upsertCustomFormFilterMutationOptions = (
  fetch: Fetch<CustomFormFilter>,
) =>
  mutationOptions({
    mutationFn: async ({
      filterId,
      createPayload,
      updatePayload,
    }: UpsertCustomFormFilterVariables) => {
      if (!filterId) {
        if (!createPayload) {
          throw new Error(
            "Missing payload to create custom form completion filter.",
          );
        }
        return createCustomFormFilter(fetch, createPayload);
      }

      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        throw new Error(
          "Missing payload to update custom form completion filter.",
        );
      }

      return patchCustomFormFilter(fetch, filterId, updatePayload);
    },
  });

export const deleteCustomFormFilterMutationOptions = (fetch: Fetch<void>) =>
  mutationOptions({
    mutationFn: (filterId: number) => deleteCustomFormFilter(fetch, filterId),
  });
