import uniqBy from "lodash/uniqBy";
import { useMemo, useState } from "react";

import type { FilterField } from "@bsport/kaizen-primitive-core";
import { useDebounce } from "@bsport/use-debounce";

type FilterValue = FilterField["values"][number];

type UseSearchableFilterFieldConfig = {
  filterType: string;
  availableFilters: string[];
  label: string;
  searchPlaceholder: string;
  multiSelect: boolean;
  persistedItems: FilterValue[] | undefined;
  useSearch: (searchQuery: string) => { data: FilterValue[] | undefined };
};

export const useSearchableFilterField = (
  config: UseSearchableFilterFieldConfig,
): FilterField => {
  const {
    filterType,
    availableFilters,
    label,
    searchPlaceholder,
    multiSelect,
    persistedItems,
    useSearch,
  } = config;

  const [inputValue, setInputValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(inputValue);
  const debouncedSetDebouncedSearch = useDebounce(setDebouncedSearch);

  const { data: searchedItems } = useSearch(debouncedSearch);

  const allItems = useMemo(() => {
    const searched = searchedItems || [];
    const persisted = persistedItems || [];
    return uniqBy([...searched, ...persisted], (val) => val.id);
  }, [searchedItems, persistedItems]);

  return {
    id: filterType,
    label,
    availableFilters,
    values: allItems,
    multiSelect,
    searchConfig: {
      value: inputValue,
      onChange: (value: string) => {
        setInputValue(value);
        debouncedSetDebouncedSearch(value);
      },
      placeholder: searchPlaceholder,
    },
  };
};
