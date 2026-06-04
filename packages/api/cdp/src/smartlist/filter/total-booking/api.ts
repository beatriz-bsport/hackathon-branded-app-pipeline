import { type Fetch } from "@bsport/store-base";

import { SMARTLIST_API_V1 } from "../../constants";
import type {
  CreateTotalBookingFilterPayload,
  TotalBookingFilter,
  UpdateTotalBookingFilterPayload,
} from "./types";

const TOTAL_BOOKING_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/bookings`;

export const createTotalBookingFilter = async (
  fetch: Fetch<TotalBookingFilter>,
  payload: CreateTotalBookingFilterPayload,
): Promise<TotalBookingFilter> => {
  const { data } = await fetch(`${TOTAL_BOOKING_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export const patchTotalBookingFilter = async (
  fetch: Fetch<TotalBookingFilter>,
  filterId: number,
  payload: UpdateTotalBookingFilterPayload,
): Promise<TotalBookingFilter> => {
  const { data } = await fetch(
    `${TOTAL_BOOKING_FILTER_ENDPOINT}/${filterId}/`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return data;
};

export const deleteTotalBookingFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${TOTAL_BOOKING_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};
