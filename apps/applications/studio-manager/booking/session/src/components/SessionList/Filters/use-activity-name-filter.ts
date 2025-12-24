import { useState } from "react";

import type { FilterField } from "@bsport/kaizen-primitive-core";
import { useDebounce } from "@bsport/use-debounce";

import { useSearchActivities } from "#src/hooks/use-search-activities";
import { useTranslation } from "#src/utils/i18n";

import { SessionFilterTypes, SessionFilters } from "./types";

export const useActivityNameFilter = (): FilterField => {
  const { t } = useTranslation("sessionList");

  // Load activitynames for the activityname filter
  const [inputValue, setInputValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(inputValue);
  const debouncedSetDebouncedSearch = useDebounce(setDebouncedSearch);

  const { data: activitynames } = useSearchActivities(debouncedSearch);

  return {
    id: SessionFilterTypes.ACTIVITY_NAME,
    label: t("table.filters.activityName.label"),
    availableFilters: [SessionFilters.FILTER_IS],
    values: activitynames || [],
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
