import { useState } from "react";

import { useDebounce } from "@bsport/use-debounce";

export const useSearchContractsInput = () => {
  const [searchInput, setSearchInput] = useState<string>("");

  return {
    searchInput,
    setSearchInput: useDebounce(setSearchInput),
    clearSearchInput: () => setSearchInput(""),
  };
};
