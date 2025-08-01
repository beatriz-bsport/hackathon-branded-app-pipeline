import { useId, useState } from "react";

import { useDebounce } from "@bsport/use-debounce";

export const useDebouncedSearch = () => {
  const [searchInput, setSearchInput] = useState<string>("");

  return {
    id: useId(),
    inputValue: searchInput,
    onInputValueChange: useDebounce(setSearchInput),
    onClear: () => setSearchInput(""),
    tooltipConfig: {},
  };
};
