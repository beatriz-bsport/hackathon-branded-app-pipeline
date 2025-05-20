import { useState } from "react";

import { useDebounce } from "@bsport/use-debounce";

const DEBOUNCE_DELAY = 500;

export const useTeacherFilters = () => {
  /** @todo Add filter management here as well */

  const [searchInput, setSearchInput] = useState<string>("");

  return {
    searchInput,
    setSearchInput: useDebounce(setSearchInput, DEBOUNCE_DELAY),
    clearSearchInput: () => setSearchInput(""),
  };
};
