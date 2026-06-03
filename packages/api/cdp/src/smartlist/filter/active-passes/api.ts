import { type Fetch } from "@bsport/store-base";

import { SMARTLIST_API_V1 } from "../../constants";
import type {
  ActivePassesFilter,
  CreateActivePassesFilterPayload,
  UpdateActivePassesFilterPayload,
} from "./types";

const ACTIVE_PASSES_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/active_passes`;

export const createActivePassesFilter = async (
  fetch: Fetch<ActivePassesFilter>,
  payload: CreateActivePassesFilterPayload,
): Promise<ActivePassesFilter> => {
  const { data } = await fetch(`${ACTIVE_PASSES_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export const patchActivePassesFilter = async (
  fetch: Fetch<ActivePassesFilter>,
  filterId: number,
  payload: UpdateActivePassesFilterPayload,
): Promise<ActivePassesFilter> => {
  const { data } = await fetch(
    `${ACTIVE_PASSES_FILTER_ENDPOINT}/${filterId}/`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return data;
};

export const deleteActivePassesFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${ACTIVE_PASSES_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};
