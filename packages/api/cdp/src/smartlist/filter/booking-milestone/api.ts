import { type Fetch } from "@bsport/store-base";

import { SMARTLIST_API_V1 } from "../../constants";
import type {
  BookingMilestoneFilter,
  CreateBookingMilestoneFilterPayload,
  UpdateBookingMilestoneFilterPayload,
} from "./types";

const BOOKING_MILESTONE_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/bookings_number`;

export const createBookingMilestoneFilter = async (
  fetch: Fetch<BookingMilestoneFilter>,
  payload: CreateBookingMilestoneFilterPayload,
): Promise<BookingMilestoneFilter> => {
  const { data } = await fetch(`${BOOKING_MILESTONE_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export const patchBookingMilestoneFilter = async (
  fetch: Fetch<BookingMilestoneFilter>,
  filterId: number,
  payload: UpdateBookingMilestoneFilterPayload,
): Promise<BookingMilestoneFilter> => {
  const { data } = await fetch(
    `${BOOKING_MILESTONE_FILTER_ENDPOINT}/${filterId}/`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return data;
};

export const deleteBookingMilestoneFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${BOOKING_MILESTONE_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};
