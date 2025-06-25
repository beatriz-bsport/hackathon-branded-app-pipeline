import { useState } from "react";

import { useDebounce } from "@bsport/use-debounce";

export const usePageFilter = () => {
  const [searchInput, setSearchInput] = useState<string>("");

  return {
    searchInput,
    setSearchInput: useDebounce(setSearchInput),
    clearSearchInput: () => setSearchInput(""),
  };
};
