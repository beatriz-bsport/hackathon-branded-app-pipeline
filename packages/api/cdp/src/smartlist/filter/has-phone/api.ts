import { type Fetch } from "@bsport/store-base";

import { SMARTLIST_API_V1 } from "../../constants";
import type {
  CreateHasPhoneFilterPayload,
  HasPhoneFilter,
  UpdateHasPhoneFilterPayload,
} from "./types";

const HAS_PHONE_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/has_phone`;

export const createHasPhoneFilter = async (
  fetch: Fetch<HasPhoneFilter>,
  payload: CreateHasPhoneFilterPayload,
): Promise<HasPhoneFilter> => {
  const { data } = await fetch(`${HAS_PHONE_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export const patchHasPhoneFilter = async (
  fetch: Fetch<HasPhoneFilter>,
  filterId: number,
  payload: UpdateHasPhoneFilterPayload,
): Promise<HasPhoneFilter> => {
  const { data } = await fetch(`${HAS_PHONE_FILTER_ENDPOINT}/${filterId}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return data;
};

export const deleteHasPhoneFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${HAS_PHONE_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};
