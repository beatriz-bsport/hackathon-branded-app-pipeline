import { type Fetch } from "@bsport/store-base";

import { SMARTLIST_API_V1 } from "../../constants";
import type {
  CreateNotesFilterPayload,
  NotesFilter,
  UpdateNotesFilterPayload,
} from "./types";

const NOTES_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/notes`;

export const createNotesFilter = async (
  fetch: Fetch<NotesFilter>,
  payload: CreateNotesFilterPayload,
): Promise<NotesFilter> => {
  const { data } = await fetch(`${NOTES_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export const patchNotesFilter = async (
  fetch: Fetch<NotesFilter>,
  filterId: number,
  payload: UpdateNotesFilterPayload,
): Promise<NotesFilter> => {
  const { data } = await fetch(`${NOTES_FILTER_ENDPOINT}/${filterId}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return data;
};

export const deleteNotesFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${NOTES_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};
