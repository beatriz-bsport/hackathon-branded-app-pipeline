import { type Fetch } from "@bsport/store-base";

import { SMARTLIST_API_V1 } from "../../constants";
import type {
  CreatePrivatePassFilterPayload,
  PrivatePassFilter,
  UpdatePrivatePassFilterPayload,
} from "./types";

const PRIVATE_PASS_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/private_pass`;

export const createPrivatePassFilter = async (
  fetch: Fetch<PrivatePassFilter>,
  payload: CreatePrivatePassFilterPayload,
): Promise<PrivatePassFilter> => {
  const { data } = await fetch(`${PRIVATE_PASS_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export const patchPrivatePassFilter = async (
  fetch: Fetch<PrivatePassFilter>,
  filterId: number,
  payload: UpdatePrivatePassFilterPayload,
): Promise<PrivatePassFilter> => {
  const { data } = await fetch(`${PRIVATE_PASS_FILTER_ENDPOINT}/${filterId}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return data;
};

export const deletePrivatePassFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${PRIVATE_PASS_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};
