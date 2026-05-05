import { IFuseOptions } from "fuse.js";

import { useFuzzySearch } from "#src/hooks/useFuzzySearch";
import type { RefinedBookingOption } from "#src/types";

const SEARCH_KEYS: IFuseOptions<RefinedBookingOption>["keys"] = [
  "memberData.first_name",
  "memberData.last_name",
];

export const useSearchBookingOptions = (
  bookingOptions: RefinedBookingOption[],
  searchQuery: string,
) => useFuzzySearch(bookingOptions, searchQuery, SEARCH_KEYS);
