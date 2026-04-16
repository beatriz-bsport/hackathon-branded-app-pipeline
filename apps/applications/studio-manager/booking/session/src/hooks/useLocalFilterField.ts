import { useMemo, useState } from "react";

import type { FilterField } from "@bsport/kaizen-primitive-core";

type LocalFilterFieldConfig<T> = {
  items: T[];
  extractValue: (item: T) => string | undefined;
  filterType: string;
  availableFilters: string[];
  label: string;
  searchPlaceholder: string;
  multiSelect: boolean;
};

export const useLocalFilterField = <T>(
  config: LocalFilterFieldConfig<T>,
): FilterField => {
  const {
    items,
    extractValue,
    filterType,
    availableFilters,
    label,
    searchPlaceholder,
    multiSelect,
  } = config;

  const [search, setSearch] = useState("");

  const values = useMemo(() => {
    const unique = new Map<string, string>();
    for (const item of items) {
      const value = extractValue(item);
      if (value && !unique.has(value)) {
        unique.set(value, value);
      }
    }
    return Array.from(unique, ([name]) => ({ id: name, label: name }));
  }, [items, extractValue]);

  const filteredValues = useMemo(
    () =>
      search
        ? values.filter((v) =>
            v.label.toLowerCase().includes(search.toLowerCase()),
          )
        : values,
    [values, search],
  );

  return {
    id: filterType,
    label,
    availableFilters,
    values: filteredValues,
    multiSelect,
    searchConfig: {
      value: search,
      onChange: setSearch,
      placeholder: searchPlaceholder,
    },
  };
};
