import { type Fetch } from "@bsport/store-base";

import { SMARTLIST_API_V1 } from "../../constants";
import type {
  CreatePrivateBookingsFilterPayload,
  PrivateBookingsFilter,
  UpdatePrivateBookingsFilterPayload,
} from "./types";

const PRIVATE_BOOKINGS_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/private_bookings`;

export const createPrivateBookingsFilter = async (
  fetch: Fetch<PrivateBookingsFilter>,
  payload: CreatePrivateBookingsFilterPayload,
): Promise<PrivateBookingsFilter> => {
  const { data } = await fetch(`${PRIVATE_BOOKINGS_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export const patchPrivateBookingsFilter = async (
  fetch: Fetch<PrivateBookingsFilter>,
  filterId: number,
  payload: UpdatePrivateBookingsFilterPayload,
): Promise<PrivateBookingsFilter> => {
  const { data } = await fetch(
    `${PRIVATE_BOOKINGS_FILTER_ENDPOINT}/${filterId}/`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return data;
};

export const deletePrivateBookingsFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${PRIVATE_BOOKINGS_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};
