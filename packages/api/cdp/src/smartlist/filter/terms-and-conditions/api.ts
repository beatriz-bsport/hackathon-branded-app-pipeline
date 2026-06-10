import { mutationOptions } from "@tanstack/react-query";

import { type Fetch } from "@bsport/store-base";

import { SMARTLIST_API_V1 } from "../../constants";
import type {
  CreateTermsAndConditionsFilterPayload,
  TermsAndConditionsFilter,
  UpdateTermsAndConditionsFilterPayload,
  UpsertTermsAndConditionsFilterVariables,
} from "./types";

const TERMS_AND_CONDITIONS_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/terms_and_conditions`;

export const createTermsAndConditionsFilter = async (
  fetch: Fetch<TermsAndConditionsFilter>,
  payload: CreateTermsAndConditionsFilterPayload,
): Promise<TermsAndConditionsFilter> => {
  const { data } = await fetch(`${TERMS_AND_CONDITIONS_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export const patchTermsAndConditionsFilter = async (
  fetch: Fetch<TermsAndConditionsFilter>,
  filterId: number,
  payload: UpdateTermsAndConditionsFilterPayload,
): Promise<TermsAndConditionsFilter> => {
  const { data } = await fetch(
    `${TERMS_AND_CONDITIONS_FILTER_ENDPOINT}/${filterId}/`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return data;
};

export const deleteTermsAndConditionsFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${TERMS_AND_CONDITIONS_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};

export const createTermsAndConditionsFilterMutationOptions = (
  fetch: Fetch<TermsAndConditionsFilter>,
) =>
  mutationOptions({
    mutationFn: (payload: CreateTermsAndConditionsFilterPayload) =>
      createTermsAndConditionsFilter(fetch, payload),
  });

export const patchTermsAndConditionsFilterMutationOptions = (
  fetch: Fetch<TermsAndConditionsFilter>,
) =>
  mutationOptions({
    mutationFn: ({
      filterId,
      payload,
    }: {
      filterId: number;
      payload: UpdateTermsAndConditionsFilterPayload;
    }) => patchTermsAndConditionsFilter(fetch, filterId, payload),
  });

export const upsertTermsAndConditionsFilterMutationOptions = (
  fetch: Fetch<TermsAndConditionsFilter>,
) =>
  mutationOptions({
    mutationFn: async ({
      filterId,
      createPayload,
      updatePayload,
    }: UpsertTermsAndConditionsFilterVariables) => {
      if (!filterId) {
        if (!createPayload) {
          throw new Error(
            "Missing payload to create terms and conditions filter.",
          );
        }
        return createTermsAndConditionsFilter(fetch, createPayload);
      }

      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        throw new Error(
          "Missing payload to update terms and conditions filter.",
        );
      }

      return patchTermsAndConditionsFilter(fetch, filterId, updatePayload);
    },
  });

export const deleteTermsAndConditionsFilterMutationOptions = (
  fetch: Fetch<void>,
) =>
  mutationOptions({
    mutationFn: (filterId: number) =>
      deleteTermsAndConditionsFilter(fetch, filterId),
  });
