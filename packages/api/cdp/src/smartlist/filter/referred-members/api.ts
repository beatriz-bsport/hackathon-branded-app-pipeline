import { type Fetch } from "@bsport/store-base";

import { SMARTLIST_API_V1 } from "../../constants";
import type {
  CreateReferredMemberFilterPayload,
  ReferredMemberFilter,
  UpdateReferredMemberFilterPayload,
} from "./types";

const REFERRED_MEMBERS_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/referred_members`;

/**
 * Creates a referred member filter row for a smartlist.
 */
export const createReferredMemberFilter = async (
  fetch: Fetch<ReferredMemberFilter>,
  payload: CreateReferredMemberFilterPayload,
): Promise<ReferredMemberFilter> => {
  const { data } = await fetch(`${REFERRED_MEMBERS_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

/**
 * Partially updates an existing referred member filter row.
 */
export const patchReferredMemberFilter = async (
  fetch: Fetch<ReferredMemberFilter>,
  filterId: number,
  payload: UpdateReferredMemberFilterPayload,
): Promise<ReferredMemberFilter> => {
  const { data } = await fetch(
    `${REFERRED_MEMBERS_FILTER_ENDPOINT}/${filterId}/`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return data;
};

/**
 * Deletes a referred member filter row.
 */
export const deleteReferredMemberFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${REFERRED_MEMBERS_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};
