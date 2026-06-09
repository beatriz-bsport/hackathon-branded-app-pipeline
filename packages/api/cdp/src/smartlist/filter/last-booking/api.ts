import { type Fetch } from "@bsport/store-base";

import { SMARTLIST_API_V1 } from "../../constants";
import type {
  CreateLastBookingFilterPayload,
  LastBookingFilter,
  UpdateLastBookingFilterPayload,
} from "./types";

const LAST_BOOKING_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/last_booking`;

export const createLastBookingFilter = async (
  fetch: Fetch<LastBookingFilter>,
  payload: CreateLastBookingFilterPayload,
): Promise<LastBookingFilter> => {
  const { data } = await fetch(`${LAST_BOOKING_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export const patchLastBookingFilter = async (
  fetch: Fetch<LastBookingFilter>,
  filterId: number,
  payload: UpdateLastBookingFilterPayload,
): Promise<LastBookingFilter> => {
  const { data } = await fetch(`${LAST_BOOKING_FILTER_ENDPOINT}/${filterId}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return data;
};

export const deleteLastBookingFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${LAST_BOOKING_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};
