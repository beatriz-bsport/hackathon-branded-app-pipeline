import { type Fetch } from "@bsport/store-base";

import { SMARTLIST_API_V1 } from "../../constants";
import type {
  CreateTagFilterPayload,
  TagFilter,
  UpdateTagFilterPayload,
} from "./types";

const TAG_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/tag_filter`;

export const createTagFilter = async (
  fetch: Fetch<TagFilter>,
  payload: CreateTagFilterPayload,
): Promise<TagFilter> => {
  const { data } = await fetch(`${TAG_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export const patchTagFilter = async (
  fetch: Fetch<TagFilter>,
  filterId: number,
  payload: UpdateTagFilterPayload,
): Promise<TagFilter> => {
  const { data } = await fetch(`${TAG_FILTER_ENDPOINT}/${filterId}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return data;
};

export const deleteTagFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${TAG_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};
