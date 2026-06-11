import { type Fetch } from "@bsport/store-base";

import { SMARTLIST_API_V1 } from "../../constants";
import type {
  AgeFilter,
  CreateAgeFilterPayload,
  UpdateAgeFilterPayload,
} from "./types";

const AGE_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/age`;

export const createAgeFilter = async (
  fetch: Fetch<AgeFilter>,
  payload: CreateAgeFilterPayload,
): Promise<AgeFilter> => {
  const { data } = await fetch(`${AGE_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export const patchAgeFilter = async (
  fetch: Fetch<AgeFilter>,
  filterId: number,
  payload: UpdateAgeFilterPayload,
): Promise<AgeFilter> => {
  const { data } = await fetch(`${AGE_FILTER_ENDPOINT}/${filterId}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return data;
};

export const deleteAgeFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${AGE_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};
