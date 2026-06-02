import type { FetchSessionsParams } from "@bsport/api-book";

/** Single-select session status. `null` = no filter (show all). */
export type StatusFilter = "upcoming" | "ongoing" | "past" | "cancelled";

export const STATUS_FILTER_OPTIONS: StatusFilter[] = [
  "ongoing",
  "upcoming",
  "past",
  "cancelled",
];

export const mapStatusFilterToParams = (
  filter: StatusFilter | null,
): Pick<
  FetchSessionsParams,
  "only_future_strict" | "only_past_strict" | "only_in_progress" | "available"
> => {
  switch (filter) {
    case null:
      return {};
    // Time-based statuses are mutually exclusive with "cancelled": a cancelled
    // session reports as "cancelled" regardless of when it falls, so exclude
    // them (available: true) to keep each filter showing a single status.
    case "upcoming":
      return { only_future_strict: true, available: true };
    case "ongoing":
      return { only_in_progress: true, available: true };
    case "past":
      return { only_past_strict: true, available: true };
    case "cancelled":
      return { available: false };
  }
};
