import { useState } from "react";

import type { FilterField } from "@bsport/kaizen-primitive-core";
import { useDebounce } from "@bsport/use-debounce";

import { useSearchEstablishments } from "#src/hooks/use-search-establishments";
import { useTranslation } from "#src/utils/i18n";

import { SessionFilterTypes, SessionFilters } from "./types";

export const useEstablishmentFilter = (): FilterField => {
  const { t } = useTranslation("sessionList");

  // Load establishments for the establishment filter
  const [inputValue, setInputValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(inputValue);
  const debouncedSetDebouncedSearch = useDebounce(setDebouncedSearch);

  const { data: establishments } = useSearchEstablishments(debouncedSearch);

  return {
    id: SessionFilterTypes.ESTABLISHMENT,
    label: t("table.filters.establishment.label"),
    availableFilters: [SessionFilters.FILTER_IS],
    values: establishments || [],
    multiSelect: true,
    searchConfig: {
      value: inputValue,
      onChange: (value: string) => {
        setInputValue(value);
        debouncedSetDebouncedSearch(value);
      },
      placeholder: t("table.filters.searchPlaceholder"),
    },
  };
};
