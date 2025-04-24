import { useState } from "react";

export const useTeacherFilters = () => {
  /** @todo Add filter management here as well */

  const [searchInput, setSearchInput] = useState<string>("");

  return {
    searchInput,
    setSearchInput,
    clearSearchInput: () => setSearchInput(""),
  };
};
