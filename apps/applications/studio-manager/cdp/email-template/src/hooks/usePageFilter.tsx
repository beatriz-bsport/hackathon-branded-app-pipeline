import { useState } from "react";

import { useDebounce } from "@bsport/use-debounce";

const DEBOUNCE_DELAY = 500;

export const usePageFilter = () => {
  const [searchInput, setSearchInput] = useState<string>("");

  return {
    searchInput,
    setSearchInput: useDebounce(setSearchInput, DEBOUNCE_DELAY),
    clearSearchInput: () => setSearchInput(""),
  };
};
