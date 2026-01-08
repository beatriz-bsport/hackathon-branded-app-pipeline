import { useState } from "react";

import type { FilterField } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";
import { useDebounce } from "@bsport/use-debounce";

import { useSearchEstablishmentGroups } from "#src/hooks/use-search-establishment-groups";
import { useTranslation } from "#src/utils/i18n";

import { SessionFilterTypes, SessionFilters } from "./types";

type UseFilterConfigResult = {
  shouldDisplayFilter: boolean;
  filterConfig: FilterField;
};

export const useLocationFilter = (): UseFilterConfigResult => {
  const { t } = useTranslation("sessionList");

  // Load and filter establishment groups for the establishment group filter
  const [inputValue, setInputValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(inputValue);
  const debouncedSetDebouncedSearch = useDebounce(setDebouncedSearch);

  const { data: establishmentGroups } =
    useSearchEstablishmentGroups(debouncedSearch);

  const hasMultiLocation =
    !!dataAccessLayer.useCompanyTheme()?.enable_multi_localization &&
    !!establishmentGroups &&
    establishmentGroups.length !== 0;

  return {
    shouldDisplayFilter: hasMultiLocation,
    filterConfig: {
      id: SessionFilterTypes.LOCATION,
      label: t("table.filters.location.label"),
      availableFilters: [SessionFilters.FILTER_IS],
      values: establishmentGroups || [],
      multiSelect: true,
      searchConfig: {
        value: inputValue,
        onChange: (value: string) => {
          setInputValue(value);
          debouncedSetDebouncedSearch(value);
        },
        placeholder: t("table.filters.searchPlaceholder"),
      },
    },
  };
};
