import { IFuseOptions } from "fuse.js";

import { useFuzzySearch } from "#src/hooks/useFuzzySearch";
import type { RefinedBooking } from "#src/types";

const SEARCH_KEYS: IFuseOptions<RefinedBooking>["keys"] = [
  "memberData.first_name",
  "memberData.last_name",
  "passData.name",
  "spot_information.name",
];

export const useSearchBookings = (
  bookings: RefinedBooking[],
  searchQuery: string,
) => useFuzzySearch(bookings, searchQuery, SEARCH_KEYS);
