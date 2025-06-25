import { useState } from "react";

import { useDebounce } from "@bsport/use-debounce";

export const useTeacherFilters = () => {
  /** @todo Add filter management here as well */

  const [searchInput, setSearchInput] = useState<string>("");

  return {
    searchInput,
    setSearchInput: useDebounce(setSearchInput),
    clearSearchInput: () => setSearchInput(""),
  };
};
