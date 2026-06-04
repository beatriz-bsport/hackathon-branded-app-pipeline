import { type Fetch } from "@bsport/store-base";

import { SMARTLIST_API_V1 } from "../../constants";
import type {
  CreateGenderFilterPayload,
  GenderFilter,
  UpdateGenderFilterPayload,
} from "./types";

const GENDER_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/gender_filter`;

export const createGenderFilter = async (
  fetch: Fetch<GenderFilter>,
  payload: CreateGenderFilterPayload,
): Promise<GenderFilter> => {
  const { data } = await fetch(`${GENDER_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export const patchGenderFilter = async (
  fetch: Fetch<GenderFilter>,
  filterId: number,
  payload: UpdateGenderFilterPayload,
): Promise<GenderFilter> => {
  const { data } = await fetch(`${GENDER_FILTER_ENDPOINT}/${filterId}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return data;
};

export const deleteGenderFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${GENDER_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};
